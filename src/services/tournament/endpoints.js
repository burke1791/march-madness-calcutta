import { TOURNAMENT_SERVICE_ENDPOINTS } from "../../utilities/constants"


export const tournamentEndpoints = {
  getTournamentTree: function(apiService, params) {
    let options = {
      method: 'GET',
      url: TOURNAMENT_SERVICE_ENDPOINTS.GET_TOURNAMENT_TREE + `/${params.leagueId}`
    };

    return apiService(options);
  }
}