import { CancelToken } from 'axios';
import { User } from '../utilities/authService';

export function authInterceptor(config) {
  if (User.session == undefined || !User.session) {
    console.log('user not signed in, cancel request: ' + config.url);

    return {
      ...config,
      cancelToken: new CancelToken((cancel) => cancel(`Cancel request to: ${config.url} - user not authenticated`))
    };
  } else {
    console.log('user signed in, send on api request: ' + config.url);

    return {
      ...config,
      headers: {
        'x-cognito-token': User.session.idToken.jwtToken
      }
    };
  }
}