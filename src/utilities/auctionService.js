import { User } from './authService';
import Axios from 'axios';
import Pubsub from './pubsub';
import { SOCKETS, ENDPOINTS, NOTIF, AUCTION_STATUS } from './constants';

var chatMessages = [];
var auctionTeams = [];
var userBuyIns = [];
var Auction = {};
/**
 * @property status
 * @object current
 * @property current.itemId
 * @property current.itemName
 * @property current.itemSeed
 * @property current.price
 * @property current.winnerId
 * @property current.winnerAlias
 * @property current.lastBid
 */

var client = null;

export {
  chatMessages,
  auctionTeams,
  userBuyIns,
  Auction
};

export function getServerTimestamp() {
  Axios({
    method: 'GET',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.SERVER_TIMESTAMP
  }).then(response => {
    console.log(response);
    updateServerPing(response.data[0].ServerTimestamp);
  }).catch(error => {
    console.log(error);
  });
}

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
    let data = JSON.parse(event.data);
    console.log(data);
    if (data.msgType === 'chat') {
      chatMessages.push(handleNewMessage(data.msgObj));
      Pubsub.publish(NOTIF.NEW_CHAT_MESSAGE, null);
    } else if (data.msgType === 'auction') {
      updateAuctionStatus(data.msgObj);
    }
  }
}

export function disconnect() {
  client.close();
}

export function sendSocketMessage(messageObj) {
  messageObj.action = 'MESSAGE';
  client.send(JSON.stringify(messageObj));
}

export function fetchChatMessages(leagueId) {
  Axios({
    method: 'GET',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.FETCH_CHAT + `/${leagueId}`,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    chatMessages = packageChatMessages(response.data);
    Pubsub.publish(NOTIF.NEW_CHAT_MESSAGE, null);
  }).catch(error => {
    console.log(error);
  });
}

export function clearChatMessages() {
  chatMessages = [];
}

export function fetchAuctionStatus(leagueId) {
  Axios({
    method: 'GET',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.FETCH_AUCTION_STATUS + `/${leagueId}`,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    console.log(response);
    updateAuctionStatus(response.data[0]);
  }).catch(error => {
    console.log(error);
  });
}

export function fetchAuctionTeams(leagueId) {
  Axios({
    method: 'GET',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.FETCH_AUCTION_TEAMS + `/${leagueId}`,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    console.log(response);
    auctionTeams = packageAuctionTeams(response.data);
    Pubsub.publish(NOTIF.AUCTION_TEAMS_DOWNLOADED, null);
  }).catch(error => {
    console.log(error);
  });
}

export function fetchUserBuyIns(leagueId) {
  Axios({
    method: 'GET',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.FETCH_AUCTION_BUYINS + `/${leagueId}`,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    console.log(response);
    userBuyIns = packageUserBuyIns(response.data);
    Pubsub.publish(NOTIF.AUCTION_BUYINS_DOWNLOADED, null);
  }).catch(error => {
    console.log(error);
  });
}

export function clearAuctionTeams() {
  auctionTeams = [];
}

export function clearAuctionState() {
  Auction = {};
}

export function startAuction(leagueId) {
  let messageObj = {
    action: 'START_AUCTION',
    leagueId: leagueId
  }

  console.log(messageObj);

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
  console.log('complete');
  let messageObj = {
    action: 'ITEM_COMPLETE',
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

function updateServerPing(pingObj) {
  let serverTime = new Date(pingObj).valueOf();
  let local = Date.now();

  let offset = serverTime - local;
  
  Pubsub.publish(NOTIF.SERVER_SYNCED, offset);
}

function packageChatMessages(messages) {
  const msgArr = messages.map(msgObj => {
    let chatMessage = {
      msgId: msgObj.id,
      userId: msgObj.userId,
      alias: msgObj.alias,
      content: msgObj.content,
      timestamp: msgObj.timestamp
    };

    return chatMessage;
  });

  return msgArr;
}

function handleNewMessage(msgObj) {
  let chatMessage = {
    msgId: msgObj.id,
    userId: msgObj.userId,
    alias: msgObj.alias,
    content: msgObj.content,
    timestamp: msgObj.timestamp
  };

  return chatMessage;
}

function packageAuctionTeams(teams) {
  const teamArr = teams.map(teamObj => {
    let team = {
      teamId: Number(teamObj.id),
      price: teamObj.price,
      name: teamObj.name,
      seed: teamObj.seed,
      owner: Number(teamObj.userId)
    };

    return team;
  });

  return teamArr;
}

function packageUserBuyIns(users) {
  const buyInArr = users.map(userObj => {
    let user = {
      userId: +userObj.userId,
      alias: userObj.alias,
      naturalBuyIn: userObj.naturalBuyIn,
      taxBuyIn: userObj.taxBuyIn,
      totalBuyIn: userObj.naturalBuyIn + userObj.taxBuyIn
    };

    return user;
  });

  return buyInArr;
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