import { User } from './authService';
import Axios from 'axios';
import Pubsub from './pubsub';
import { SOCKETS } from './constants';
import { client as WebsocketClient } from 'websocket';

const client = new WebsocketClient();

client.on('connect', connection => {
  console.log('connected');
  connection.on('error', error => {
    console.log(error);
    connection.close();
  });

  connection.on('close', () => {
    console.log('connection closed');
  });

  connection.on('message', message => {
    console.log(message);
  });

  // pings the connection to keep it alive
  // const ping = () => {
  //   if (connection.connected) {
  //     let pingMessage = {
  //       action: 'PING'
  //     };
  //     connection.sendUTF(JSON.stringify(pingMessage));
  //     setTimeout(ping, 30000);
  //   }
  // }

  // ping();
});

client.on('connectFailed', error => {
  console.log(error);
  client.abort();
});


export function connectAuction() {
  client.connect(`${SOCKETS.AUCTION}?Authorizer=${User.session.idToken.jwtToken}`);
}