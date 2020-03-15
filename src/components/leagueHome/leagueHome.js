import React, { useState, useEffect } from 'react';

import { Layout, Table, Row, Typography } from 'antd';
import 'antd/dist/antd.css';
import { Data, getLeagueUserSummaries } from '../../utilities/leagueService';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import AuctionChart from '../auctionChart/auctionChart';
import { navigate } from '@reach/router';
import { formatMoney } from '../../utilities/helper';

const { Header, Content } = Layout;
const { Text } = Typography;

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
    dataIndex: 'buyIn',
    align: 'center',
    width: 150,
    render: (text, record) => {
      return <Text>{formatMoney(record.buyIn)}</Text>
    }
  },
  {
    title: 'Current Payout',
    dataIndex: 'payout',
    align: 'center',
    width: 150,
    render: (text, record) => {
      return <Text>{formatMoney(record.payout)}</Text>
    }
  },
  {
    title: 'Net Return',
    dataIndex: 'return',
    align: 'center',
    width: 150,
    render: (text, record) => {
      return <Text type={record.return < 0 ? 'danger' : ''}>{formatMoney(record.return)}</Text>
    }
  }
];

function LeagueHome(props) {
  
  const [leagueName, setLeagueName] = useState('');
  const [userList, setUserList] = useState([]);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHome, getLeagueInfo);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHome);
    });
  }, []);

  useEffect(() => {
    getLeagueUserSummaries(props.leagueId);
  }, [props.leagueId]);

  const getLeagueInfo = () => {
    setLeagueName(Data.leagueInfo.name);
    setUserList(Data.leagueInfo.users);
    setStatus(Data.leagueInfo.status);
    setLoading(false);
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
            loading={loading}
            onRow={
              (record, index) => {
                return {
                  onClick: (event) => {
                    navigate(`/leagues/${props.leagueId}/member`, { state: { userId: record.id }});
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