import { User } from './authService';
import { ENDPOINTS, NOTIF } from './constants';
import Axios from 'axios';
import Pubsub from './pubsub';

let Data = {};

export function createLeague(name, password, year) {
  let league = {
    name: name,
    password: password,
    year: year
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
    Pubsub.publish(NOTIF.LEAGUE_SUMMARIES_FETCHED, null);
  }).catch(error => {
    console.log(error);
  });
}


function packageLeagueSummaries(data) {
  let leagues = data.map(league => {
    let leagueObj = {
      id: league.leagueId,
      name: league.name,
      buyIn: league.naturalBuyIn + league.taxBuyIn,
      payout: league.return,
      role: league.role,
      auctionId: league.auctionId
    };

    return leagueObj;
  });

  return leagues;
}

export function clearDataOnSignout() {
  Data = {};
}

export {
  Data
}