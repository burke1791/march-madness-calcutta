import React, { useState, useEffect, useRef } from 'react';
import './auctionTeams.css';

import { Row, List } from 'antd';
import 'antd/dist/antd.css';
import { formatMoney } from '../../utilities/helper';
import Team from '../team/team';

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
        <AuctionTeamsList
          teams={props.teams}
          loading={props.loading}
        />
      </Row>
    </div>
  );
}

function AuctionTeamsList(props) {

  const teamsRef = useRef([]);

  useEffect(() => {
    teamsRef.current = parseTeams();
  }, [JSON.stringify(props.teams)]);

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

  const parseTeams = () => {
    const teams = props.teams.map(team => {
      return {
        ...team,
        ...getDisplayType(team.isComplete, team.price)
      }
    });

    teams.sort((a, b) => a.displayOrder - b.displayOrder);

    console.log(teams);

    return teams;
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
      dataSource={teamsRef.current}
      loading={props.loading}
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