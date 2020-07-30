import React from 'react';
import { SERVICES } from '../utilities/constants';
import LeagueService from '../services/league/league.service';
import { useAuthState } from '../context/authContext';

/**
 * HOC for calling an API endpoint
 * @function withData
 * @param {Component} WrappedComponent
 */
function withData(WrappedComponent) {
  return function(props) {

    const { token } = useAuthState();

    const callApi = (serviceName, endpoint, params) => {
      switch (serviceName) {
        case SERVICES.LEAGUE_SERVICE: {
          LeagueService.callApi(endpoint, token, params);
        }
      }
    }

    return (
      <WrappedComponent {...props} callApi={callApi} />
    );
  }
}

export default withData;