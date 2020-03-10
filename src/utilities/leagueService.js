import { User } from './authService';
import { ENDPOINTS, NOTIF } from './constants';
import Axios from 'axios';
import Pubsub from './pubsub';
import { formatMoney } from './helper';

let Data = {};

// @TODO this is temporary - eventually query for user meta data upon sign-in
var userId = null;

export function fetchTournamentOptions() {
  Axios({
    method: 'GET',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.TOURNAMENT_OPTIONS,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    Data.tournaments = response.data;
    Pubsub.publish(NOTIF.TOURNAMENT_OPTIONS_DOWNLOADED, null);
  }).catch(error => {
    console.log(error);
  })
}

export function getLeagueSummaries() {
  Axios({
    method: 'GET',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.LEAGUE_SUMMARIES,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    console.log(response);
    Data.leagues = packageLeagueSummaries(response.data);
    if (Data.leagues != null && Data.leagues.length) {
      Pubsub.publish(NOTIF.LEAGUE_SUMMARIES_FETCHED, null);
    }
  }).catch(error => {
    console.log(error);
  });
}

export function createLeague(name, password, tournamentId) {
  let league = {
    name: name,
    password: password,
    tournamentId: tournamentId
  };

  Axios({
    method: 'POST',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.NEW_LEAGUE,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    },
    data: league
  }).then(response => {
    console.log(response);
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
    url: process.env.REACT_APP_API_URL + ENDPOINTS.JOIN_LEAGUE,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    },
    data: league
  }).then(response => {
    console.log(response);
    Pubsub.publish(NOTIF.LEAGUE_JOINED);
  }).catch(error => {
    console.log(error);
  });
}

export function getLeagueUserSummaries(leagueId) {
  Axios({
    method: 'GET',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.LEAGUE_USER_SUMMARIES + `/${leagueId}`,
    headers: {
      'x-cognito-token': User.session.idToken.jwtToken || ''
    }
  }).then(response => {
    console.log(response);
    Data.leagueInfo = packageLeagueInfo(response.data);
    Pubsub.publish(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED);
  }).catch(error => {
    console.log(error);
  });
}

function packageLeagueSummaries(data) {
  if (data != null && data.length) {
    let leagues = data.map(league => {
      let leagueObj = {
        id: league.leagueId,
        name: league.name,
        buyIn: league.naturalBuyIn + league.taxBuyIn,
        payout: league.return,
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
        return: user.totalReturn - user.naturalBuyIn - user.taxBuyIn
      };
    });

    // sorts the users in descending order by their net return
    leagueInfo.users.sort(function (a, b) { return b.return - a.return });

    // adds a rank property to each user after being sorted
    // and formats the money value into a friendlier string representation
    leagueInfo.users.forEach((user, index) => {
      user.rank = index + 1;
      user.buyInFormatted = formatMoney(user.buyIn || 0);
      user.payoutFormatted = formatMoney(user.payout || 0);
      user.returnFormatted = formatMoney(user.return || 0);
    });

    return leagueInfo;
  }
  return null;
}

export function clearDataOnSignout() {
  Data = {};
}

export {
  Data,
  userId
}