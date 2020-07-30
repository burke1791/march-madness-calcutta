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

function withWebSocket(WrappedComponent, config) {
  return function(props) {
    const { authenticated, token, userId } = useAuthDispatch();
    const { leagueId } = useLeagueState();

    const [socket, setSocket] = useState(null);

    useEffect(() => {
      if (authenticated && leagueId && socket === null) {
        connect();
      }

      return(() => {
        if (socket !== null) {
          socket.close();
        }
      });
    }, [authenticated, leagueId]);

    const connect = () => {
      let client = new WebSocket(`${config.socketService}?Authorizer=${token}&leagueId=${leagueId}`)

      /**
       * @todo send feedback to the user
       */
      client.onopen = function(event) {
        console.log(event);
      }

      /**
       * @todo send feedback to the user
       */
      client.onerror = function(error) {
        console.log(error)
      }

      // client.onmessage = function
      
      setSocket(client);
    }
  }
}