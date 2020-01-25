import { User } from './authService';
import Axios from 'axios';
import Pubsub from './pubsub';
import { SOCKETS } from './constants';

var client = null;

export function connectAuction(leagueId) {
  console.log('leagueId: ' + leagueId);
  client = new WebSocket(`${SOCKETS.AUCTION}?Authorizer=${User.session.idToken.jwtToken}&leagueId=${leagueId}`);

  client.onopen = function(event) {
    console.log(event);
  }

  client.onerror = function(error) {
    console.log(error);
  }

  client.onclose = function(event) {
    console.log(event);
  }

  client.onmessage = function(event) {
    console.log(event);
  }
}

export function disconnect() {
  client.close();
}

export function sendSocketMessage(messageObj) {
  messageObj.action = 'MESSAGE';
  console.log('sending socket');
  client.send(JSON.stringify(messageObj));
}