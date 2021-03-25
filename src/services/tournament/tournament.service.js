import ApiService from '../apiService';
import { API_CONFIG, TOURNAMENT_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { tournamentEndpoints } from './endpoints';

/**
 * IIFE pattern used to achieve a singleton instance of the ApiService module. This will be the interface between
 * the React components and the tournament service API
 * @module TournamentService
 */
var TournamentService = (function() {
  var instance;

  function createInstance() {
    var api = new ApiService(API_CONFIG.TOURNAMENT_SERVICE_BASE_URL);
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
 TournamentService.newEndpoint(TOURNAMENT_SERVICE_ENDPOINTS.GET_TOURNAMENT_TREE, tournamentEndpoints.getTournamentTree);

 export default TournamentService;