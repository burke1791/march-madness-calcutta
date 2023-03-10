import { message } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useAuctionDispatch, useAuctionState } from '../context/auctionContext';
import { useAuthState } from '../context/authContext';
import { useLeagueState } from '../context/leagueContext';
import { parseAuctionSummary, parseAuctionTeams } from '../parsers/auction';
import { AUCTION_NOTIF, AUCTION_STATUS, AUCTION_WEBSOCKET_MSG_TYPE, NOTIF } from '../utilities/constants';
import Pubsub from '../utilities/pubsub';
import { parseChatMessage, parseAuctionMessage } from './websocketHelper';


function withAuctionWebsocket(WrappedComponent, config) {
  return function(props) {
    const { authenticated, token, userId } = useAuthState();
    const { leagueId } = useLeagueState();
    const { reconnectTrigger } = useAuctionState();

    const auctionDispatch = useAuctionDispatch();

    const socket = useRef(null);

    useEffect(() => {
      if (authenticated && leagueId && token && (socket.current === null || socket.current.readyState == 3)) {
        connect();
      }

      return(() => {
        if (socket.current !== null) {
          socket.current.close(1000);
        }
      });
    }, [token, leagueId]);

    useEffect(() => {
      if (authenticated && leagueId && token && (socket.current === null || socket.current.readyState == 3)) {
        connect();
      }
    }, [reconnectTrigger]);

    const connect = () => {
      socket.current = new WebSocket(`${config.socketService}?Authorizer=${token}&leagueId=${leagueId}`)

      /**
       * @todo send feedback to the user
       */
      socket.current.onopen = function(event) {
        auctionDispatch({ type: 'update', key: 'connected', value: true });
        Pubsub.publish(NOTIF.AUCTION_MODAL_DISMISS);
      }

      /**
       * @todo send feedback to the user
       */
      socket.current.onerror = function(error) {
        console.log(error);
        processAuctionError('Auction server error');
      }

      socket.current.onmessage = function(event) {
        const { msgType, msgObj, message } = JSON.parse(event.data);

        emit(msgType, msgObj, message);
      }

      socket.current.onclose = function(event) {
        auctionDispatch({ type: 'update', key: 'connected', value: false });

        // if the socket was closed for any reason other than navigating away from the page
        if (event.code != 1000) {
          Pubsub.publish(NOTIF.AUCTION_MODAL_SHOW);
        }
      }
    }

    const sendSocketMessage = (action, payload) => {
      if (socket && socket.current) {
        if (socket?.current?.readyState == 3) {
          message.warning('You are not connected to the auction service');
          Pubsub.publish(NOTIF.AUCTION_MODAL_SHOW);
  
          // this simply halts all loading animations
          auctionDispatch({ type: 'update', key: 'prevUpdate', value: new Date().valueOf() });
        } else {
          const messageObj = generateMessageObj(action, payload);
  
          socket.current.send(messageObj);
        }
      }
    }

    const generateMessageObj = (action, payload) => {
      const obj = {
        action: action,
        ...payload
      };

      return JSON.stringify(obj);
    }

    const showNotifMessage = (notifLevel, notifMessage) => {
      switch (notifLevel) {
        case 'info':
          message.info(notifMessage);
          break;
        case 'error':
          message.error(notifMessage);
          break;
        case 'success':
          message.success(notifMessage);
          break;
        default:
          console.log('unknown notifLevel: ' + notifLevel);
      }
    }

    const emit = (msgType, msgObj, messageText) => {
      switch (msgType) {
        case 'auction_open':
          // open auction
          processAuctionStatus(msgObj);
          break;
        case 'auction_close':
          message.info(messageText);
          auctionDispatch({ type: 'update', key: 'auctionClosed', value: true });
          break;
        case 'auction_bid':
          // handle bid
          processAuctionStatus(msgObj);
          break;
        case 'auction_sale':
          // handles all sale types: sold, not purchased, unsold (?)
          processAuctionStatus(msgObj);
          break;
        case AUCTION_WEBSOCKET_MSG_TYPE.SYNC:
          // this msgType indicates a full data update was sent with the websocket payload
          fullAuctionDataSync(msgObj);
          break;
        case 'auction_info':
          // misc info that doesn't affect core auction functionality
          showNotifMessage(msgObj.notifLevel, msgObj.notifMessage);
          console.log(msgObj);

          auctionInfoUpdateContext(msgObj.action);
          break;
        case 'connection':
          Pubsub.publish(AUCTION_NOTIF.CONNECTION, msgObj);
          break;
        case 'auction_error':
          // error catchall
          processAuctionError(messageText);
          break;
        case 'chat':
          Pubsub.publish(NOTIF.NEW_CHAT_MESSAGE, parseChatMessage(msgObj));
          break;
        default:
          console.log('unknown auction websocket message');
          console.log(msgType);
      }
    }

    const processAuctionStatus = (data) => {
      const itemSoldFlag = data.Status === AUCTION_STATUS.CONFIRMED_SOLD;

      // indicate to listeners that an item was sold
      if (itemSoldFlag) {
        auctionDispatch({ type: 'update', key: 'confirmedSoldTimestamp', value: new Date().valueOf() });
      }

      const statusObj = parseAuctionMessage(data);
      updateAuctionStatusInContext(statusObj);
    }

    const processAuctionError = (error) => {
      const obj = {
        errorMessage: error
      };

      updateAuctionStatusInContext(obj);
    }

    const fullAuctionDataSync = (data) => {
      const parsedSummary = parseAuctionSummary(data?.summary);
      console.log(parsedSummary);

      if (parsedSummary.prizepool !== undefined) {
        auctionDispatch({ type: 'update', key: 'prizepool', value: parsedSummary.prizepool });
      }

      const parsedTeams = parseAuctionTeams(data?.teams);
      console.log(parsedTeams);

      auctionDispatch({ type: 'update', key: 'teams', value: parsedTeams });
      auctionDispatch({ type: 'update', key: 'teamsDownloadedDate', value: new Date().valueOf() });

      const parsedMemberBuyIns = data?.memberBuyIns // no parser at the moment
      console.log(parsedMemberBuyIns);

      auctionDispatch({ type: 'update', key: 'memberBuyIns', value: parsedMemberBuyIns });
      auctionDispatch({ type: 'update', key: 'auctionBuyInsDownloadedDate', value: new Date().valueOf() });
    }

    const updateAuctionStatusInContext = (statusObj) => {
      const keys = Object.keys(statusObj);

      for (var key of keys) {
        if (statusObj[key] !== undefined) {
          auctionDispatch({ type: 'update', key: key, value: statusObj[key] });
        }
      }

      auctionDispatch({ type: 'update', key: 'prevUpdate', value: new Date().valueOf() });
    }

    const auctionInfoUpdateContext = (action) => {
      switch (action) {
        case 'RESET_ITEM':
          auctionDispatch({ type: 'update', key: 'resetItemTriggered', value: new Date().valueOf() });
          break;
        case 'RESET_AUCTION':
          auctionDispatch({ type: 'update', key: 'resetAuctionTriggered', value: new Date().valueOf() });
          break;
      }
    }

    return (
      <WrappedComponent {...props} sendSocketMessage={sendSocketMessage} />
    );
  }
}

export default withAuctionWebsocket