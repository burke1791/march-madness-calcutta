import { User } from './authService';
import { API_CONFIG, ENDPOINTS, NOTIF } from './constants';
import Axios from 'axios';
import Pubsub from './pubsub';
import { formatMoney } from './helper';

let Data = {};
let leaguesFetched = false;

// @TODO this is temporary - eventually query for user meta data upon sign-in
var userId = null;

export function fetchTournamentOptions() {
  Axios({
    method: 'GET',
    url: API_CONFIG.BASE_URL + ENDPOINTS.TOURNAMENT_OPTIONS,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    console.log(response);
    Data.tournaments = response.data;
    Pubsub.publish(NOTIF.TOURNAMENT_OPTIONS_DOWNLOADED, null);
  }).catch(error => {
    console.log(error);
  })
}

export function getLeagueSummaries(override = false) {
  if ((User.authenticated && !leaguesFetched) || (User.authenticated && override)) {
    Axios({
      method: 'GET',
      url: API_CONFIG.BASE_URL + ENDPOINTS.LEAGUE_SUMMARIES,
      headers: {
        'x-cognito-token': User.session.idToken.jwtToken || ''
      }
    }).then(response => {
      console.log(response);
      Data.leagues = packageLeagueSummaries(response.data);
      leaguesFetched = true;
      Pubsub.publish(NOTIF.LEAGUE_SUMMARIES_FETCHED, null);
    }).catch(error => {
      leaguesFetched = false;
      console.log(error);
    });
  }
}

export function createLeague(name, password, tournamentId) {
  let league = {
    name: name,
    password: password,
    tournamentId: tournamentId
  };

  Axios({
    method: 'POST',
    url: API_CONFIG.BASE_URL + ENDPOINTS.NEW_LEAGUE,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    },
    data: league
  }).then(response => {
    Pubsub.publish(NOTIF.LEAGUE_JOINED);
  }).catch(error => {
    console.log(error);
  });
}

export function joinLeague(name, password) {
  let league = {
    name: name,
    password: password
  };

  Axios({
    method: 'POST',
    url: API_CONFIG.BASE_URL + ENDPOINTS.JOIN_LEAGUE,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    },
    data: league
  }).then(response => {
    Pubsub.publish(NOTIF.LEAGUE_JOINED);
  }).catch(error => {
    console.log(error);
  });
}

export function getLeagueUserSummaries(leagueId) {
  Axios({
    method: 'GET',
    url: API_CONFIG.BASE_URL + ENDPOINTS.LEAGUE_USER_SUMMARIES + `/${leagueId}`,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    Data.leagueInfo = packageLeagueInfo(response.data);
    Pubsub.publish(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED);
  }).catch(error => {
    console.log(error);
  });
}

export function getUpcomingGames(leagueId) {
  Axios({
    method: 'GET',
    url: API_CONFIG.BASE_URL + ENDPOINTS.UPCOMING_GAMES + `/${leagueId}`,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    Data.upcomingGames = packageUpcomingGames(response.data);
    Pubsub.publish(NOTIF.UPCOMING_GAMES_DOWNLOADED);
  }).catch(error => {
    console.log(error);
  });
}

export function getRemainingGamesCount(tournamentId) {
  Axios({
    method: 'GET',
    url: API_CONFIG.BASE_URL + ENDPOINTS.REMAINING_GAMES_COUNT + `/${tournamentId}`,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    Data.remainingGames = response.data[0].numGamesRemaining;
    Pubsub.publish(NOTIF.REMAINING_GAMES_COUNT_DOWNLOADED, null);
  }).catch(error => {
    console.log(error);
  });
}

export function getTournamentGamesForBracket(leagueId) {
  if (leagueId != undefined && leagueId != null) {
    Axios({
      method: 'GET',
      url: API_CONFIG.BASE_URL + ENDPOINTS.TOURNAMENT_BRACKET_GAMES + `/${leagueId}`,
      headers: {
        'x-cognito-token': User.session.idToken.jwtToken || ''
      }
    }).then(response => {
      console.log(response);
      Data.tournamentBracketGames = packageBracketGames(response.data);
      Pubsub.publish(NOTIF.TOURNAMENT_BRACKET_GAMES, Data.tournamentBracketGames);
    }).catch(error => {
      console.log(error);
    });
  }
}

export function fetchUserTeams(leagueId, userId) {
  Axios({
    method: 'GET',
    url: API_CONFIG.BASE_URL + ENDPOINTS.LEAGUE_USER_TEAMS + `/${leagueId}/${userId}`,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    Data.userTeams = packageUserTeams(response.data);
    Data.userAlias = parseUserAlias(response.data);
    Pubsub.publish(NOTIF.LEAGUE_USER_TEAMS_FETCHED, null);
  }).catch(error => {
    console.log(error);
  })
}

export function clearUserTeams() {
  Data.userTeams = [];
  Data.userAlias = '';
}

function packageBracketGames(games) {
  return games.map(game => {
    // refactor to account for no seeds, etc.
    return {
      gameId: game.gameId,
      nextGameId: game.nextGameId,
      team1Id: game.team1Id,
      team1Name: game.team1Id == null ? null : `(${game.team1Seed}) ${game.team1Name}`,
      team1Score: game.team1Score,
      team2Id: game.team2Id,
      team2Name: game.team2Id == null ? null : `(${game.team2Seed}) ${game.team2Name}`,
      team2Score: game.team2Score
    };
  });
}

function packageLeagueSummaries(data) {
  if (data != null && data.length) {
    let leagues = data.map(league => {
      let leagueObj = {
        id: league.leagueId,
        name: league.name,
        tournamentId: league.tournamentId,
        tournamentName: league.tournamentName,
        buyIn: league.naturalBuyIn + league.taxBuyIn,
        payout: league.totalReturn,
        role: league.role,
        roleId: league.roleId,
        auctionId: league.auctionId
      };
  
      return leagueObj;
    });
    userId = +data[0].userId;
  
    return leagues;
  }
  return null;
}

function packageLeagueInfo(userSummaries) {
  if (userSummaries.length) {
    let leagueInfo = {
      name: userSummaries[0].name,
      tournamentName: userSummaries[0].tournamentName,
      auctionId: userSummaries[0].auctionId,
      status: userSummaries[0].status,
      users: []
    };

    leagueInfo.users = userSummaries.map(user => {
      return {
        id: user.userId,
        key: user.userId,
        name: user.alias,
        buyIn: user.naturalBuyIn + user.taxBuyIn,
        payout: user.totalReturn,
        return: user.totalReturn - user.naturalBuyIn - user.taxBuyIn,
        numTeams: user.numTeams,
        numTeamsAlive: user.numTeamsAlive
      };
    });

    // sorts the users in descending order by their net return
    leagueInfo.users.sort(function(a, b) { return b.return - a.return });

    // adds a rank property to each user after being sorted
    // and formats the money value into a friendlier string representation
    leagueInfo.users.forEach((user, index) => {
      user.rank = index + 1;
    });

    return leagueInfo;
  }
  return null;
}

function packageUpcomingGames(games) {
  if (games.length) {
    let upcomingGames = games.map(game => {
      return game;
    });

    return upcomingGames;
  }

  return null;
}

function packageUserTeams(teams) {
  const userTeams = teams.map(team => {
    return {
      teamId: team.teamId,
      name: team.name,
      seed: team.seed,
      price: team.price,
      payout: team.payout,
      netReturn: team.payout - team.price,
      eliminated: !team.alive
    };
  });

  // sorting the teams in descending order by their net return
  userTeams.sort(function(a, b) { return b.netReturn - a.netReturn });

  // adding a tax object to the list of user teams
  if (teams[0].taxBuyIn > 0) {
    userTeams.push({
      teamId: 0,
      name: 'Tax',
      seed: null,
      price: teams[0].taxBuyIn,
      payout: 0,
      netReturn: -teams[0].taxBuyIn
    });
  }

  return userTeams;
}

function parseUserAlias(teams) {
  return teams[0].alias;
}

export function clearDataOnSignout() {
  Data = {};
}

export {
  Data,
  userId,
  leaguesFetched
}