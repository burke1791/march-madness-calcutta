import React, { useState, useEffect } from 'react';

import { Layout, Table, Row } from 'antd';
import 'antd/dist/antd.css';
import DataService, { Data } from '../../utilities/data';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import AuctionChart from '../auctionChart/auctionChart';

const { Header, Content } = Layout;

const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    align: 'center',
    width: 75
  },
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'center',
    width: 250
  },
  {
    title: 'Buy In',
    dataIndex: 'buyInFormatted',
    align: 'center',
    width: 150
  },
  {
    title: 'Current Payout',
    dataIndex: 'payoutFormatted',
    align: 'center',
    width: 150
  },
  {
    title: 'Net Return',
    dataIndex: 'returnFormatted',
    align: 'center',
    width: 150
  }
];

function LeagueHome(props) {
  
  const [leagueName, setLeagueName] = useState('test league name');
  const [userList, setUserList] = useState([]);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHome, getLeagueInfo);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHome);
    });
  }, []);

  useEffect(() => {
    console.log('leagueId: ' + props.leagueId);
    DataService.getLeagueUserSummaries(props.leagueId);
  }, [props.leagueId]);

  const getLeagueInfo = () => {
    setLeagueName(Data.leagueInfo.name);
    setUserList(Data.leagueInfo.users);
    setStatus(Data.leagueInfo.status);
  }

  return (
    <Layout>
      <Header style={{ background: 'none', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px' }}>{leagueName}</h1>
      </Header>
      <Content>
        <Row type='flex' justify='center'>
          <Table
            columns={columns}
            dataSource={userList}
            size='middle'
            pagination={false}
            onRow={
              (record, index) => {
                return {
                  onClick: (event) => {
                    console.log('user page coming soon');
                  }
                };
              }
            }
          />
        </Row>
        <Row type='flex' justify='center'>
          <AuctionChart status={status} />
        </Row>
      </Content>
    </Layout>
  );
}

export default LeagueHome;