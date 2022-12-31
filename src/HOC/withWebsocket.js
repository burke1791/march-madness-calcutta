import { message } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useAuctionDispatch, useAuctionState } from '../context/auctionContext';
import { useAuthState } from '../context/authContext';
import { useLeagueState } from '../context/leagueContext';
import { AUCTION_NOTIF, AUCTION_STATUS, NOTIF } from '../utilities/constants';
import Pubsub from '../utilities/pubsub';
import { parseChatMessage, parseAuctionMessage } from './websocketHelper';


function withAuctionWebsocket(WrappedComponent, config) {
  return function(props) {
    const { authenticated, token } = useAuthState();
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
        console.log(error)
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
      if (socket.current.readyState == 3) {
        message.warning('You are not connected to the auction service');
        Pubsub.publish(NOTIF.AUCTION_MODAL_SHOW);

        // this simply halts all loading animations
        auctionDispatch({ type: 'update', key: 'prevUpdate', value: new Date().valueOf() });
      } else {
        const messageObj = generateMessageObj(action, payload);

        socket.current.send(messageObj);
      }
    }

    const generateMessageObj = (action, payload) => {
      const obj = {
        action: action,
        ...payload
      };

      return JSON.stringify(obj);
    }

    const emit = (msgType, msgObj, messageText) => {
      switch (msgType) {
        case 'auction_open':
          // open auction
          break;
        case 'auction_close':
          message.info(messageText);
          auctionDispatch({ type: 'update', key: 'auctionClosed', value: true });
          break;
        case 'auction_bid':
          // handle bid
          processAuctionStatus(msgObj);
          Pubsub.publish(NOTIF.NEW_AUCTION_DATA, null);
          break;
        case 'auction_sale':
          // handles all sale types: sold, not purchased, unsold (?)
          break;
        case 'auction_info':
          // misc info that doesn't affect core auction functionality
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

      if (msgType === 'chat') {
        // Pubsub.publish(NOTIF.NEW_CHAT_MESSAGE, parseChatMessage(msgObj));
      } else if (msgType === 'auction') {
        // parse auction obj then publish
        processAuctionStatus(msgObj);
        Pubsub.publish(NOTIF.NEW_AUCTION_DATA, null);
      } else if (msgType === 'auction_close') {
        message.info(messageText);
        auctionDispatch({ type: 'update', key: 'auctionClosed', value: true });
      } else if (msgType === 'auction_error') {
        // Pubsub.publish(NOTIF.AUCTION_ERROR, messageText);
        processAuctionError(messageText);
      }
    }

    const processAuctionStatus = (data) => {
      let itemSoldFlag = data.Status === AUCTION_STATUS.CONFIRMED_SOLD;

      // indicate to listeners that an item was sold
      if (itemSoldFlag) {
        auctionDispatch({ type: 'update', key: 'newItemTimestamp', value: new Date().valueOf() });
      }

      let statusObj = parseAuctionMessage(data);
      updateAuctionStatusInContext(statusObj);
    }

    const processAuctionError = (error) => {
      let obj = {
        errorMessage: error
      };

      updateAuctionStatusInContext(obj);
    }

    const updateAuctionStatusInContext = (statusObj) => {
      let keys = Object.keys(statusObj);

      for (var key of keys) {
        if (statusObj[key] !== undefined) {
          auctionDispatch({ type: 'update', key: key, value: statusObj[key] });
        }
      }

      auctionDispatch({ type: 'update', key: 'prevUpdate', value: new Date().valueOf() });
    }

    return (
      <WrappedComponent {...props} sendSocketMessage={sendSocketMessage} />
    );
  }
}

export default withAuctionWebsocket