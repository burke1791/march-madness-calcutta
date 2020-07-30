import { AUCTION_SERVICE_ENDPOINTS, NOTIF, AUCTION_STATUS } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { auctionServiceHelper } from './helper';

/**
 * @todo move to context
 */
var auctionTeams = [];
var userBuyIns = [];
var Auction = {};

export const auctionEndpoints = {
  getServerTimestamp: function(apiService) {
    apiService({
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.SERVER_TIMESTAMP
    }).then(response => {
      auctionServiceHelper.updateServerPing(response.data[0].ServerTimestamp);
    }).catch(error => {
      console.log(error);
    });
  },

  fetchChatMessages: function(apiService, params) {
    apiService({
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.FETCH_CHAT + `/${params.leagueId}`
    }).then(response => {
      let chatMessages = auctionServiceHelper.packageChatMessages(response.data);
      Pubsub.publish(NOTIF.NEW_CHAT_MESSAGE, chatMessages);
    }).catch(error => {
      console.log(error);
    });
  },

  fetchAuctionStatus: function(apiService, params) {
    apiService({
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_STATUS + `/${params.leagueId}`
    }).then(response => {
      let updatedTeams = response.data[0].status === AUCTION_STATUS.SOLD;
      Auction = auctionServiceHelper.updateAuctionStatus(response.data[0]);
      Pubsub.publish(NOTIF.NEW_AUCTION_DATA, updatedTeams);
    }).catch(error => {
      console.log(error);
    });
  },

  fetchAuctionTeams: function(apiService, params) {
    apiService({
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_TEAMS + `/${params.leagueId}`
    }).then(response => {
      auctionTeams = auctionServiceHelper.packageAuctionTeams(response.data);
      Pubsub.publish(NOTIF.AUCTION_TEAMS_DOWNLOADED, null);
    }).catch(error => {
      console.log(error);
    });
  },

  fetchUserBuyIns: function(apiService, params) {
    apiService({
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_BUYINS + `/${params.leagueId}`
    }).then(response => {
      console.log(response);
      userBuyIns = auctionServiceHelper.packageUserBuyIns(response.data);
      Pubsub.publish(NOTIF.AUCTION_BUYINS_DOWNLOADED, null);
    }).catch(error => {
      console.log(error);
    });
  }
}

export function clearAuctionTeams() {
  auctionTeams = [];
}

export function clearAuctionState() {
  Auction = {};
}

export {
  auctionTeams,
  userBuyIns,
  Auction
}