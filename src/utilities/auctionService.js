import { User } from './authService';
import Axios from 'axios';
import Pubsub from './pubsub';
import { SOCKETS, ENDPOINTS, NOTIF } from './constants';

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
  userBuyIns
};

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
    Pubsub.publish(NOTIF.NEW_AUCTION_DATA, null);
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
  Axios({
    method: 'GET',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.START_AUCTION + `/${leagueId}`,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  })
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
  Auction = {
    status: status.status,
    current: {
      itemId: status.currentItemId,
      itemName: status.name,
      itemSeed: status.seed,
      price: status.currentItemPrice,
      winnerId: status.currentItemWinner,
      winnerAlias: status.alias,
      lastBid: status.lastBidTimestamp
    }
  };
}