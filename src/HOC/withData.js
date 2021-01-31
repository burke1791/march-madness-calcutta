import React, { useState, useEffect } from 'react';
import { SERVICES } from '../utilities/constants';
import LeagueService from '../services/league/league.service';
import { useAuthState, useAuthDispatch } from '../context/authContext';
import AuctionService from '../services/autction/auction.service';
import { useLeagueState } from '../context/leagueContext';

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
        case SERVICES.AUCTION_SERVICE: {
          AuctionService.callApi(endpoint, token, params);
        }
      }
    }

    return (
      <WrappedComponent {...props} callApi={callApi} />
    );
  }
}

export default withData;

function withService(WrappedComponent) {
  return function(props) {
    const { authenticated, token, userId } = useAuthState();
  }
}
