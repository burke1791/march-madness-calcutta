import React, { useState, useEffect } from 'react';
import './auctionTeams.css';

import { Row, List } from 'antd';
import 'antd/dist/antd.css';
import { formatMoney } from '../../utilities/helper';
import Team from '../team/team';
import { useAuctionDispatch, useAuctionState } from '../../context/auctionContext';
import useData from '../../hooks/useData';
import { API_CONFIG, AUCTION_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import { parseAuctionTeams } from '../../parsers/auction';

/**
 * @typedef AuctionTeamsProps
 * @property {Number} prizepool
 */

/**
 * @component
 * @param {AuctionTeamsProps} props 
 */
function AuctionTeams() {

  const { prizepool } = useAuctionState();

  return (
    <div style={{ padding: '0 6px' }}>
      <Row type='flex' justify='space-between' style={{ padding: '6px 10px' }}>
        <h3>Auction Items</h3>
        <h3>
          Prizepool: {formatMoney(prizepool || 0)}
        </h3>
      </Row>
      <Row>
        <AuctionTeamsList />
      </Row>
    </div>
  );
}

function AuctionTeamsList() {

  const [loading, setLoading] = useState(true);

  const { authenticated } = useAuthState()
  const { leagueId } = useLeagueState();
  const { connected, newItemTimestamp } = useAuctionState();

  const autctionDispatch = useAuctionDispatch();

  const [teams, teamsReturnDate, fetchTeams] = useData({
    baseUrl: API_CONFIG.AUCTION_SERVICE_BASE_URL,
    endpoint: `${AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_TEAMS}/${leagueId}`,
    method: 'GET',
    processData: parseAuctionTeams,
    conditions: [authenticated, leagueId, connected]
  });

  useEffect(() => {
    if (authenticated && leagueId && connected) {
      fetchTeams();
    }
  }, [authenticated, leagueId, connected]);

  useEffect(() => {
    if (leagueId && newItemTimestamp) {
      fetchTeams();
    }
  }, [newItemTimestamp])

  useEffect(() => {
    if (teamsReturnDate) {
      setLoading(false);
      autctionDispatch({ type: 'update', key: 'teamsDownloadedDate', value: new Date().valueOf() });
    }
  }, [teamsReturnDate]);

  const getStatusText = (displayClass, price) => {
    if (displayClass === 'no-sell') {
      return 'undrafted';
    }

    if (displayClass === 'purchased') {
      return formatMoney(price);
    }

    return null;
  }

  return (
    <List
      bordered={true}
      itemLayout='horizontal'
      dataSource={teams || []}
      loading={loading}
      size='small'
      style={{ padding: '6px 10px', maxHeight: 'calc(100vh - 160px)', overflow: 'auto', width: '100%' }}
      renderItem={team => (
        <List.Item className={team.displayClass} style={{ justifyContent: 'space-between' }}>
          <Team name={team.displayName} style={{ fontSize: 18 }} imageSrc={team.teamLogoUrl} imgStyle={{ maxHeight: 25, maxWidth: 25 }} />
          <h4>{getStatusText(team.displayClass, team.price)}</h4>
        </List.Item>
      )}
    />
  );
}

export default AuctionTeams;