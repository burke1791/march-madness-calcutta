import React from 'react';
import { useLeagueState } from '../../context/leagueContext';
import { leagueServiceHelper } from '../../services/league/helper';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';

function AuctionGroup() {

  const { leagueId } = useLeagueState();

  return (
    <AuctionRules
      getEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SEED_GROUPS}/${leagueId}`}
      getPostProcess={leagueServiceHelper.packageLeagueSeedGroups}
      postEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.NEW_LEAGUE_SEED_GROUP}`}
      ruleKey='groupId'
    >

    </AuctionRules>
  )
}

export default AuctionGroup;