import Axios from 'axios';
import { CancelToken } from 'axios';
import { User } from '../utilities/authService';

function ApiService(baseUrl) {
  this.service = Axios.create({
    baseURL: baseUrl
  });
  this.service.interceptors.request.use(authInterceptor);
  this.endpoints = [];

  this.newEndpoint = function(name, ref) {
    for (var endpoint of this.endpoints) {
      if (endpoint.name === name) {
        // console.log('endpoint already exists');
        return;
      }
    }

    this.endpoints.push({
      name: name,
      func: ref
    });
  }

  this.removeEndpoint = function(name) {
    for (var i in this.endpoints) {
      if (this.endpoints[i].name === name) {
        this.endpoints.splice(i, 1);
      }
    }
  }

  this.callApi = function(name, params) {
    if (User.authenticated) {
      // send on api call
      // console.log('send on api call: ' + name);
      let func = this.endpoints.find(endpoint => endpoint.name === name).func

      func(this.service, params);
    } else {
      // console.log('not authenticated, do not send on: ' + name);
      return false;
    }
  }

  this.callApiWithPromise = function(name, params) {
    if (User.authenticated) {
      let func = this.endpoints.find(endpoint => endpoint.name === name).func

      return new Promise((resolve, reject) => {
        func(this.service, params).then(data => {
          resolve(data);
        });
        /** @todo add error handling */
      });
    }
  }
}

function authInterceptor(config) {
  if (User.session == undefined || !User.session) {
    // console.log('user not signed in, cancel request: ' + config.url);

    return {
      ...config,
      cancelToken: new CancelToken((cancel) => cancel(`Cancel request to: ${config.url} - user not authenticated`))
    };
  } else {
    // console.log('user signed in, send on api request: ' + config.url);

    return {
      ...config,
      headers: {
        'x-cognito-token': User.session.idToken.jwtToken
      }
    };
  }
}

export default ApiService;