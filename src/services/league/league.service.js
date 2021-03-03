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
    var api = new ApiService(API_CONFIG.LEAGUE_SERVICE_BASE_URL);
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
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_METADATA, leagueEndpoints.getLeagueMetadata);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, leagueEndpoints.getLeagueUserSummaries);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.UPCOMING_GAMES, leagueEndpoints.getUpcomingGames);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.REMAINING_TEAMS_COUNT, leagueEndpoints.getRemainingTeamsCount);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.TOURNAMENT_BRACKET_GAMES, leagueEndpoints.getTournamentGamesForBracket);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_TEAMS, leagueEndpoints.fetchUserTeams);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS, leagueEndpoints.getLeagueSettings);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_SETTINGS, leagueEndpoints.updateLeagueSettings);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_PAYOUT_SETTINGS, leagueEndpoints.getLeaguePayoutSettings);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_PAYOUT_SETTINGS, leagueEndpoints.updateLeaguePayoutSettings);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_USER_METADATA, leagueEndpoints.getLeagueUserMetadata);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SEED_GROUPS, leagueEndpoints.getLeagueSeedGroups);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.NEW_LEAGUE_SEED_GROUP, leagueEndpoints.newLeagueSeedGroup);
LeagueService.newEndpoint(LEAGUE_SERVICE_ENDPOINTS.DELETE_LEAGUE_SEED_GROUP, leagueEndpoints.deleteLeagueSeedGroup);

export default LeagueService;