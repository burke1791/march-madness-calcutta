import ApiService from '../apiService';
import { API_CONFIG, AUCTION_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { auctionEndpoints } from './endpoints';

/**
 * IIFE pattern used to achieve a singleton instance of the ApiService module. This will be the interface between
 * the React components and the auction service API
 * @module AuctionService
 */
var AuctionService = (function() {
  var instance;

  function createInstance() {
    var api = new ApiService(API_CONFIG.AUCTION_SERVICE_BASE_URL);
    return api;
  }

  if (!instance) {
    instance = createInstance();
  }
  return instance;
})();

/**
 * Adding each auction service endpoint to the AuctionService instance
 */
AuctionService.newEndpoint(AUCTION_SERVICE_ENDPOINTS.SERVER_TIMESTAMP, auctionEndpoints.getServerTimestamp);
AuctionService.newEndpoint(AUCTION_SERVICE_ENDPOINTS.FETCH_CHAT, auctionEndpoints.fetchChatMessages);
AuctionService.newEndpoint(AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_STATUS, auctionEndpoints.fetchAuctionStatus);
AuctionService.newEndpoint(AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_TEAMS, auctionEndpoints.fetchAuctionTeams);
AuctionService.newEndpoint(AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_BUYINS, auctionEndpoints.fetchUserBuyIns);

 export default AuctionService;