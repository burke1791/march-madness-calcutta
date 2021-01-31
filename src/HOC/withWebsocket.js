import React, { useState, useEffect } from 'react';
import { useAuthState } from '../context/authContext';
import { useLeagueState } from '../context/leagueContext';
import { NOTIF } from '../utilities/constants';
import Pubsub from '../utilities/pubsub';
import { parseChatMessage } from './websocketHelper';


function withWebsocket(WrappedComponent, config) {
  return function(props) {
    const { authenticated, token, userId } = useAuthState();
    const { leagueId } = useLeagueState();

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
        let { msgType, msgObj } = JSON.parse(event.data);
        console.log(msgObj);

        emit(msgType, msgObj);
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

    const emit = (msgType, msgObj) => {
      if (msgType === 'chat') {
        Pubsub.publish(NOTIF.NEW_CHAT_MESSAGE, parseChatMessage(msgObj));
      } else if (msgType === 'auction') {
        // parse auction obj then publish
      } else if (msgType === 'error') {
        Pubsub.publish(NOTIF.AUCTION_ERROR, msgObj);
      }
    }

    return (
      <WrappedComponent {...props} sendSocketMessage={sendSocketMessage} />
    );
  }
}

export default withWebsocket