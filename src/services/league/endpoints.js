import { LEAGUE_SERVICE_ENDPOINTS, NOTIF } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { leagueServiceHelper } from './helper';

/**
 * @todo put these data sets in context - storing them like this is essentially a poor man's context
 */
let Data = {};
let leaguesFetched = false;

export const leagueEndpoints = {
  fetchTournamentOptions: function(apiService) {
    let options = {
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.TOURNAMENT_OPTIONS
    };

    return apiService(options);
  },

  getLeagueSummaries: function(apiService, params) {
    let options = {
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.LEAGUE_SUMMARIES
    };

    return apiService(options);
  },

  createLeague: function(apiService, params) {
    let league = {
      name: params.name,
      password: params.password,
      tournamentId: params.tournamentId,
      tournamentScopeId: params.tournamentScopeId
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

  // called within a promise
  getLeagueMetadata: function(apiService, params) {
    let options = {
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.LEAGUE_METADATA + `/${params.leagueId}`
    };

    return apiService(options);
  },

  getLeagueUserSummaries: function(apiService, params) {
    let options = {
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES + `/${params.leagueId}`
    };

    return apiService(options);
  },

  getUpcomingGames: function(apiService, params) {
    let options = {
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.UPCOMING_GAMES + `/${params.leagueId}`
    };

    return apiService(options);
  },

  getRemainingTeamsCount: function(apiService, params) {
    let options = {
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.REMAINING_TEAMS_COUNT + `/${params.leagueId}`
    };

    return apiService(options);
  },

  getTournamentGamesForBracket: function(apiService, params) {
    if (params.leagueId != undefined && params.leagueId != null) {
      apiService({
        method: 'GET',
        url: LEAGUE_SERVICE_ENDPOINTS.TOURNAMENT_BRACKET_GAMES + `/${params.leagueId}`
      }).then(response => {
        Data.tournamentBracketGames = leagueServiceHelper.packageBracketGames(response.data);
        Pubsub.publish(NOTIF.TOURNAMENT_BRACKET_GAMES, Data.tournamentBracketGames);
      }).catch(error => {
        console.log(error);
      });
    }
  },

  getLeagueUserMetadata: function(apiService, params) {
    let options = {
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_USER_METADATA + `/${params.leagueId}/${params.userId}`
    };

    return apiService(options);
  },

  fetchUserTeams: function(apiService, params) {
    let options = {
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_TEAMS + `/${params.leagueId}/${params.userId}`
    }

    return apiService(options);
    
    // apiService({
    //   method: 'GET',
    //   url: LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_TEAMS + `/${params.leagueId}/${params.userId}`
    // }).then(response => {
    //   if (response.data.length > 0) {
    //     Data.userTeams = leagueServiceHelper.packageUserTeams(response.data);
    //     Data.userAlias = leagueServiceHelper.parseUserAlias(response.data);
    //   }
    //   Pubsub.publish(NOTIF.LEAGUE_USER_TEAMS_FETCHED, null);
    // }).catch(error => {
    //   console.log(error);
    // });
  },

  getLeagueSettings: function(apiService, params) {
    let options = {
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS + `/${params.leagueId}`
    };
    
    return apiService(options);
  },

  updateLeagueSettings: function(apiService, params) {
    let options = {
      method: 'POST',
      url: LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_SETTINGS,
      data: {
        leagueId: params.leagueId,
        settings: params.settings
      }
    };

    return apiService(options);
  },

  getLeaguePayoutSettings: function(apiService, params) {
    let options = {
      method: 'GET',
      url: LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_PAYOUT_SETTINGS + `/${params.leagueId}`
    };

    return apiService(options);
  },

  updateLeaguePayoutSettings: function(apiService, params) {
    let options = {
      method: 'POST',
      url: LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_PAYOUT_SETTINGS,
      data: {
        leagueId: params.leagueId,
        settings: params.settings
      }
    };

    return apiService(options);
  }
};

/**
 * @todo move clearUserTeams() and clearDataOnSignout() functionality to context
 */
export function clearUserTeams() {
  Data.userTeams = [];
  Data.userAlias = '';
}

function clearLeagueInfo() {
  Data.leagueInfo = null;
}

function clearUpcomingGames() {
  Data.upcomingGames = null;
}

export function clearDataOnSignout() {
  Data = {};
}

export function cleanupLeagueHomeData() {
  clearLeagueInfo();
  clearUpcomingGames();
}


export {
  Data,
  leaguesFetched
};