import { User } from './authService';
import { ENDPOINTS } from './constants';
import Axios from 'axios';
import Pubsub from './pubsub';

export function createLeague(name, password, year) {
  let session = User.session.idToken.jwtToken || '';

  let league = {
    name: name,
    password: password,
    year: year
  };
  console.log(session);
  console.log(league);

  Axios({
    method: 'POST',
    url: process.env.REACT_APP_API_URL + ENDPOINTS.NEW_LEAGUE,
    headers: {
      'x-cognito-token': session
    },
    data: league
  }).then(response => {
    console.log(response);
    Pubsub.publish(NOTIF.LEAGUE_JOINED);
  }).catch(error => {
    console.log(error);
  });
}