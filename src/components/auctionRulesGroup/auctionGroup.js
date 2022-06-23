import React from 'react';
import { useLeagueState } from '../../context/leagueContext';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import AuctionRules from '../auctionRules/auctionRules';

function AuctionGroup() {

  const { leagueId } = useLeagueState();

  return (
    <AuctionRules
      getEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SEED_GROUPS}/${leagueId}`}
      postEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.NEW_LEAGUE_SEED_GROUP}`}
    >

    </AuctionRules>
  )
}

export default AuctionGroup;