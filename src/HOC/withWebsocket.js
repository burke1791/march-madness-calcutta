import { message } from 'antd';
import React, { useEffect, useRef } from 'react';
import { useAuctionDispatch, useAuctionState } from '../context/auctionContext';
import { useAuthState } from '../context/authContext';
import { useLeagueState } from '../context/leagueContext';
import { parseAuctionSummary, parseAuctionTeams } from '../parsers/auction';
import { AUCTION_NOTIF, AUCTION_STATUS, AUCTION_WEBSOCKET_MSG_TYPE, NOTIF } from '../utilities/constants';
import Pubsub from '../utilities/pubsub';
import { parseChatMessage, parseAuctionMessage } from './websocketHelper';
import { parseAuctionTeamsNew } from '../parsers/auction/fetchAuctionTeams';


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

    /**
     * 
     */
    const emit = (msgType, msgObj, messageText) => {
      switch (msgType) {
        case AUCTION_WEBSOCKET_MSG_TYPE.OPEN:
          console.log(msgObj);
          processAuctionStatus(msgObj.status);
          break;
        case AUCTION_WEBSOCKET_MSG_TYPE.CLOSE:
          if (msgObj.message) {
            message.info(msgObj.message);
          }
          processAuctionStatus(msgObj.status);
          auctionDispatch({ type: 'update', key: 'auctionClosed', value: true });
          break;
        case AUCTION_WEBSOCKET_MSG_TYPE.BID:
          // handle bid
          console.log(msgObj);
          processAuctionStatus(msgObj.status);
          break;
        case AUCTION_WEBSOCKET_MSG_TYPE.SALE:
        case AUCTION_WEBSOCKET_MSG_TYPE.RESET:
          console.log(msgObj);
          auctionDataSync(msgObj);
          break;
        case AUCTION_WEBSOCKET_MSG_TYPE.SYNC:
          // this msgType indicates a full data update was sent with the websocket payload
          auctionDataSync(msgObj);
          break;
        case AUCTION_WEBSOCKET_MSG_TYPE.SETTINGS:
          console.log(msgObj);
          auctionSettingsSync(msgObj);
          break;
        case AUCTION_WEBSOCKET_MSG_TYPE.INFO:
          // misc info that doesn't affect core auction functionality
          showNotifMessage(msgObj.notifLevel, msgObj.notifMessage);
          console.log(msgObj);

          auctionInfoUpdateContext(msgObj.action);
          break;
        case AUCTION_WEBSOCKET_MSG_TYPE.CONNECTION:
          Pubsub.publish(AUCTION_NOTIF.CONNECTION, msgObj);
          break;
        case AUCTION_WEBSOCKET_MSG_TYPE.ERROR:
          // error catchall
          processAuctionError(messageText);
          break;
        case AUCTION_WEBSOCKET_MSG_TYPE.CHAT:
          Pubsub.publish(NOTIF.NEW_CHAT_MESSAGE, parseChatMessage(msgObj));
          break;
        default:
          console.log('unknown auction websocket message');
          console.log(msgType);
          console.log(msgObj);
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

    const syncAuctionTeams = (teams) => {
      const parsedTeams = parseAuctionTeamsNew(teams);

      auctionDispatch({ type: 'update', key: 'teams', value: parsedTeams });
      auctionDispatch({ type: 'update', key: 'teamsDownloadedDate', value: new Date().valueOf() });
    }

    const syncAuctionSettings = (settings) => {
      if (!Array.isArray(settings) || settings.length == 0) return;

      auctionDispatch({ type: 'update', key: 'auctionSettings', value: settings });
      auctionDispatch({ type: 'update', key: 'auctionSettingsDownloadedDate', value: new Date().valueOf() });
    }

    const syncAuctionSummary = (users, userId) => {
      if (!Array.isArray(users) || users.length == 0) return;

      const thisUser = users.find(u => u.userId == userId);
      if (thisUser != undefined) {
        auctionDispatch({ type: 'update', key: 'naturalBuyIn', value: thisUser.naturalBuyIn });
        auctionDispatch({ type: 'update', key: 'taxBuyIn', value: thisUser.taxBuyIn });
      }

      let prizepool = 0;

      users.forEach(u => {
        prizepool += u.naturalBuyIn;
        prizepool += u.taxBuyIn;
      });

      auctionDispatch({ type: 'update', key: 'prizepool', value: prizepool });
    }

    const syncAuctionUsers = (users) => {
      if (!Array.isArray(users) || users.length == 0) return;

      auctionDispatch({ type: 'update', key: 'memberBuyIns', value: users });
      auctionDispatch({ type: 'update', key: 'auctionBuyInsDownloadedDate', value: new Date().valueOf() });
    }

    const auctionDataSync = (payload) => {
      syncAuctionSummary(payload.users, userId);
      processAuctionStatus(payload.status);
      syncAuctionTeams(payload.slots);
      syncAuctionSettings(payload.settings);
      syncAuctionUsers(payload.users);

      // if all teams have been sold (or unclaimed) then show a modal prompting the auctioneer to close the auction
      auctionDispatch({ type: 'update', key: 'numLotsRemaining', value: countAvailableLots(payload.slots) });

      if (payload.message) {
        message.info(payload.message);
      }
    }

    const auctionSettingsSync = (payload) => {
      syncAuctionTeams(payload.slots);
      syncAuctionSettings(payload.settings);

      auctionDispatch({ type: 'update', key: 'numLotsRemaining', value: countAvailableLots(payload.slots) });

    }

    const countAvailableLots = (slots) => {
      let available = 0;

      slots.forEach(s => {
        if (s.price == null) available++;
      });

      return available;
    }

    const processAuctionError = (error) => {
      const obj = {
        errorMessage: error
      };

      updateAuctionStatusInContext(obj);
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