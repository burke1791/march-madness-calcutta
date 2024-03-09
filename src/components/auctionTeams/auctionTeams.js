import React, { useState, useEffect } from 'react';
import './auctionTeams.css';

import { Row, List } from 'antd';

import { formatMoney } from '../../utilities/helper';
import Team from '../team/team';
import { useAuctionState } from '../../context/auctionContext';

/**
 * @typedef AuctionTeamsProps
 * @property {Number} prizepool
 */

/**
 * @component
 * @param {AuctionTeamsProps} props 
 */
function AuctionTeams() {

  const { prizepool, numLotsRemaining } = useAuctionState();

  return (
    <div style={{ padding: '0 6px' }}>
      <Row type='flex' justify='space-between' style={{ padding: '6px 10px' }}>
        <h3>Auction Items{numLotsRemaining != undefined ? ` (${numLotsRemaining} remaining)` : null}</h3>
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

  const { teams, teamsDownloadedDate, confirmedSoldTimestamp } = useAuctionState();

  useEffect(() => {
    if (teamsDownloadedDate) setLoading(false);
  }, [teamsDownloadedDate]);

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
      itemLayout='vertical'
      dataSource={teams || []}
      loading={loading}
      size='small'
      style={{ padding: '6px 10px', maxHeight: 'calc(100vh - 160px)', overflow: 'auto', width: '100%' }}
      renderItem={team => (
        <List.Item
          className={team.displayClass}
          extra={<h4>{getStatusText(team.displayClass, team.price)}</h4>}
        >
          <Team name={team.displayName} style={{ fontSize: 18, textAlign: 'left' }} imageSrc={team.teamLogoUrl} imgStyle={{ maxHeight: 25, maxWidth: 25 }} />
          {
            team.ownerAlias ?
            <span style={{ fontSize: 16, fontWeight: 500, marginLeft: 8 }}>{team.ownerAlias}</span>
            :
            null
          }
        </List.Item>
      )}
    />
  );
}

export default AuctionTeams;