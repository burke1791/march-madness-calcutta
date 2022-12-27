import React, { useState, useEffect } from 'react';
import './auctionTeams.css';

import { Row, List } from 'antd';
import 'antd/dist/antd.css';
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
function AuctionTeams(props) {

  return (
    <div style={{ padding: '0 6px' }}>
      <Row type='flex' justify='space-between' style={{ padding: '6px 10px' }}>
        <h3>Auction Items</h3>
        <h3>
          Prizepool: {props.prizepool ? formatMoney(props.prizepool) : '$0.00'}
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
  const [teamsList, setTeamsList] = useState([]);

  const { teams, teamsDownloadedDate } = useAuctionState();

  useEffect(() => {
    if (teamsDownloadedDate && teams.length) {
      setTeamsList(parseTeams(teams));
      setLoading(false);
    }
  }, [teamsDownloadedDate])

  const getDisplayType = (isComplete, price) => {
    let displayClass = 'active';
    let displayOrder = 1;

    if (isComplete && price == 0) {
      displayClass = 'no-sell';
      displayOrder = 3;
    } else if (isComplete && price > 0) {
      displayClass = 'purchased';
      displayOrder = 2;
    }

    return {
      displayClass: displayClass,
      displayOrder: displayOrder
    };
  }

  const parseTeams = (teams) => {
    const auctionTeams = teams.map(team => {
      return {
        ...team,
        ...getDisplayType(team.isComplete, team.price)
      }
    });

    auctionTeams.sort((a, b) => a.displayOrder - b.displayOrder);

    return auctionTeams
  }

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
      dataSource={teamsList}
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