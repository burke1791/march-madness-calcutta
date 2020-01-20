import { User } from './authService';
import Axios from 'axios';
import Pubsub from './pubsub';
import { SOCKETS } from './constants';

let socket = null;

export function connectAuction(auctionId) {
  socket = new WebSocket(SOCKETS.AUCTION);

  socket.onopen = function(event) {
    console.log('open');
    console.log(event);
  }

  socket.onmessage = function(event) {
    console.log('message');
    console.log(event);
  }

  socket.onerror = function(event) {
    console.log('error');
    console.log(event);
  }

  socket.onclose = function(event) {
    console.log('close');
    console.log(event);
  }
}

export function disconnect() {
  socket.close();
}
