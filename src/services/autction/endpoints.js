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
    let options = {
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.SERVER_TIMESTAMP
    };

    return apiService(options);
  },

  fetchChatMessages: function(apiService, params) {
    apiService({
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.FETCH_CHAT + `/${params.leagueId}`
    }).then(response => {
      console.log(response);
      let chatMessages = auctionServiceHelper.packageChatMessages(response.data);
      console.log(chatMessages);
      Pubsub.publish(NOTIF.NEW_CHAT_MESSAGE, chatMessages);
    }).catch(error => {
      console.log(error);
    });
  },

  fetchAuctionStatus: function(apiService, params) {
    let options = {
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_STATUS + `/${params.leagueId}`
    };

    return apiService(options);
  },

  fetchAuctionTeams: function(apiService, params) {
    let options = {
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_TEAMS + `/${params.leagueId}`
    };

    return apiService(options);
  },

  fetchUserBuyIns: function(apiService, params) {
    let options = {
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_BUYINS + `/${params.leagueId}`
    };

    return apiService(options);
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