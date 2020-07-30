import { User } from './authService';
import Axios from 'axios';
import Pubsub from './pubsub';
import { Auction, auctionTeams } from '../services/autction/endpoints';
import { SOCKETS, NOTIF, AUCTION_STATUS } from './constants';

var client = null;

/**
 * @todo possibly make this into a HOC
 */
export function connectAuction(leagueId) {
  console.log(client);
  if (client === null || client.readyState == 3) {
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
      let data = JSON.parse(event.data);
      console.log(data);

      if (data.msgType === 'chat') {
        // chatMessages.push(handleNewMessage(data.msgObj));
        Pubsub.publish(NOTIF.NEW_CHAT_MESSAGE, handleNewMessage(data.msgObj));
      } else if (data.msgType === 'auction') {
        updateAuctionStatus(data.msgObj);
      } else if (data.msgType === 'auction_error') {
        Pubsub.publish(NOTIF.AUCTION_ERROR, null);
      }
    }
  }
}

export function disconnect() {
  if (client) {
    client.close();
  }
}

export function sendSocketMessage(messageObj) {
  messageObj.action = 'MESSAGE';
  client.send(JSON.stringify(messageObj));
}

export function startAuction(leagueId) {
  let messageObj = {
    action: 'START_AUCTION',
    leagueId: leagueId
  }

  client.send(JSON.stringify(messageObj));
}

export function nextItem(leagueId) {
  let messageObj = {
    action: 'NEXT_ITEM',
    leagueId: leagueId
  };

  client.send(JSON.stringify(messageObj));
}

export function resetClock(leagueId) {
  let messageObj = {
    action: 'RESET_CLOCK',
    leagueId: leagueId
  };

  client.send(JSON.stringify(messageObj));
}

export function setItemComplete(leagueId) {
  let messageObj = {
    action: 'ITEM_COMPLETE',
    leagueId: leagueId
  };

  client.send(JSON.stringify(messageObj));
}

export function closeAuction(leagueId) {
  let messageObj = {
    action: 'CLOSE_AUCTION',
    leagueId: leagueId
  };

  client.send(JSON.stringify(messageObj));
}

export function placeAuctionBid(leagueId, amount) {
  let bidObj = {
    action: 'PLACE_BID',
    leagueId: leagueId,
    amount: amount
  };

  client.send(JSON.stringify(bidObj));
}

function handleNewMessage(msgObj) {
  let chatMessage = {
    msgId: msgObj.id,
    userId: msgObj.userId,
    alias: msgObj.alias,
    content: msgObj.content,
    timestamp: msgObj.timestamp
  };

  return [chatMessage];
}

function updateAuctionStatus(status) {
  let updatedTeams = status.status === AUCTION_STATUS.SOLD;
  
  Auction = {
    status: status.status,
    current: {
      itemId: status.currentItemId,
      itemName: status.name,
      itemSeed: status.seed,
      price: status.currentItemPrice,
      winnerId: status.currentItemWinner,
      winnerAlias: status.alias,
      lastBid: new Date(status.lastBidTimestamp)
    }
  };

  Pubsub.publish(NOTIF.NEW_AUCTION_DATA, updatedTeams);
}