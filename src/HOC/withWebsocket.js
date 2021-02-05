import React, { useState, useEffect } from 'react';
import { useAuctionDispatch } from '../context/auctionContext';
import { useAuthState } from '../context/authContext';
import { useLeagueState } from '../context/leagueContext';
import { AUCTION_STATUS, NOTIF } from '../utilities/constants';
import Pubsub from '../utilities/pubsub';
import { parseChatMessage, parseAuctionMessage } from './websocketHelper';


function withAuctionWebsocket(WrappedComponent, config) {
  return function(props) {
    const { authenticated, token, userId } = useAuthState();
    const { leagueId } = useLeagueState();

    const auctionDispatch = useAuctionDispatch();

    const [socket, setSocket] = useState(null);

    useEffect(() => {
      if (authenticated && leagueId && token && (socket === null || socket.readyState == 3)) {
        connect();
      }

      return(() => {
        if (socket !== null) {
          socket.close();
        }
      });
    }, [token, leagueId]);

    const connect = () => {
      let client = new WebSocket(`${config.socketService}?Authorizer=${token}&leagueId=${leagueId}`)

      /**
       * @todo send feedback to the user
       */
      client.onopen = function(event) {
        console.log(event);
      }

      /**
       * @todo send feedback to the user
       */
      client.onerror = function(error) {
        console.log(error)
      }

      client.onmessage = function(event) {
        let { msgType, msgObj, message } = JSON.parse(event.data);
        console.log(msgType);
        console.log(msgObj);

        emit(msgType, msgObj, message);
      }
      
      setSocket(client);
    }

    const sendSocketMessage = (action, payload) => {
      let messageObj = generateMessageObj(action, payload);

      socket.send(messageObj);
    }

    const generateMessageObj = (action, payload) => {
      let obj = {
        action: action,
        ...payload
      };

      return JSON.stringify(obj);
    }

    const emit = (msgType, msgObj, errorMessage) => {
      if (msgType === 'chat') {
        Pubsub.publish(NOTIF.NEW_CHAT_MESSAGE, parseChatMessage(msgObj));
      } else if (msgType === 'auction') {
        // parse auction obj then publish
        processAuctionStatus(msgObj);
        Pubsub.publish(NOTIF.NEW_AUCTION_DATA, null);
      } else if (msgType === 'auction_error') {
        // Pubsub.publish(NOTIF.AUCTION_ERROR, errorMessage);
        processAuctionError(errorMessage)
      }
    }

    const processAuctionStatus = (data) => {
      let itemSoldFlag = data.Status === AUCTION_STATUS.SOLD;

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
        auctionDispatch({ type: 'update', key: key, value: statusObj[key] });
      }

      auctionDispatch({ type: 'update', key: 'prevUpdate', value: new Date().valueOf() });
    }

    return (
      <WrappedComponent {...props} sendSocketMessage={sendSocketMessage} />
    );
  }
}

export default withAuctionWebsocket