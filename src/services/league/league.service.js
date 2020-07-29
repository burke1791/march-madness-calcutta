import ApiService from '../apiService';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { leagueEndpoints } from './endpoints';

/**
 * IIFE pattern used to achieve a singleton instance of the ApiService module. This will be the interface between
 * the React components and the league service API
 * @module LeagueService
 */
var LeagueService = (function() {
  var instance;

  function createInstance() {
    var api = new ApiService(API_CONFIG.BASE_URL);
    return api;
  }

  if (!instance) {
    instance = createInstance();
  }
  return instance;
})();

/**
 * Adding each league service endpoint to the LeagueService instance
 */
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.TOURNAMENT_OPTIONS, leagueEndpoints.fetchTournamentOptions);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_SUMMARIES, leagueEndpoints.getLeagueSummaries);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.NEW_LEAGUE, leagueEndpoints.createLeague);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.JOIN_LEAGUE, leagueEndpoints.joinLeague);

export default LeagueService;