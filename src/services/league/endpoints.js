import { LEAGUE_SERVICE_ENDPOINTS, NOTIF } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { leagueServiceHelper } from './helper';

/**
 * @todo put these data sets in context - storing them like this is essentially a poor man's context
 */
let Data = {};
let leaguesFetched = false;

/**
 * @todo refactor this into a user meta data query upon sign in
 */
var userId = null;

export const leagueEndpoints = {
  fetchTournamentOptions: function(apiService) {
    apiService({
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.TOURNAMENT_OPTIONS
    }).then(response => {
      console.log(response);
      Data.tournaments = response.data;
      Pubsub.publish(NOTIF.TOURNAMENT_OPTIONS_DOWNLOADED, null);
    }).catch(error => {
      console.log(error);
    });
  },

  getLeagueSummaries: function(apiService, params) {
    if (!leaguesFetched || params.override) {
      apiService({
        method: 'GET',
        url: LEAGUE_SERVICE_ENDPOINTS.LEAGUE_SUMMARIES
      }).then(response => {
        console.log(response);
        Data.leagues = leagueServiceHelper.packageLeagueSummaries(response.data);
        userId = leagueServiceHelper.extractUserId(response.data);
        leaguesFetched = true;
        Pubsub.publish(NOTIF.LEAGUE_SUMMARIES_FETCHED, null);
      }).catch(error => {
        leaguesFetched = false;
        console.log(error);
      });
    }
  },

  createLeague: function(apiService, params) {
    let league = {
      name: params.name,
      password: params.password,
      tournamentId: params.tournamentId
    };
  
    apiService({
      method: 'POST',
      url: LEAGUE_SERVICE_ENDPOINTS.NEW_LEAGUE,
      data: league
    }).then(response => {
      Pubsub.publish(NOTIF.LEAGUE_JOINED);
    }).catch(error => {
      console.log(error);
    });
  },

  joinLeague: function(apiService, params) {
    let league = {
      name: params.name,
      password: params.password
    };
  
    apiService({
      method: 'POST',
      url: LEAGUE_SERVICE_ENDPOINTS.JOIN_LEAGUE,
      data: league
    }).then(response => {
      Pubsub.publish(NOTIF.LEAGUE_JOINED);
    }).catch(error => {
      console.log(error);
    });
  },

  getLeagueUserSummaries: function(apiService, params) {
    apiService({
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES + `/${params.leagueId}`
    }).then(response => {
      Data.leagueInfo = leagueServiceHelper.packageLeagueInfo(response.data);
      Pubsub.publish(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED);
    }).catch(error => {
      console.log(error);
    });
  },

  getUpcomingGames: function(apiService, params) {
    apiService({
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.UPCOMING_GAMES + `/${params.leagueId}`
    }).then(response => {
      Data.upcomingGames = leagueServiceHelper.packageUpcomingGames(response.data);
      Pubsub.publish(NOTIF.UPCOMING_GAMES_DOWNLOADED);
    }).catch(error => {
      console.log(error);
    });
  },

  getRemainingGamesCount: function(apiService, params) {
    apiService({
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.REMAINING_GAMES_COUNT + `/${params.tournamentId}`
    }).then(response => {
      Data.remainingGames = response.data[0].numGamesRemaining;
      Pubsub.publish(NOTIF.REMAINING_GAMES_COUNT_DOWNLOADED, null);
    }).catch(error => {
      console.log(error);
    });
  }
}


export {
  Data,
  userId,
  leaguesFetched
};