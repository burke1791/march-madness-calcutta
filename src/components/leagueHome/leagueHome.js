import React, { useState, useEffect } from 'react';

import { Layout, Table, Row, Typography, Card, Avatar } from 'antd';
import { UserOutline } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { Data, getLeagueUserSummaries } from '../../utilities/leagueService';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import AuctionChart from '../auctionChart/auctionChart';
import { navigate } from '@reach/router';
import { formatMoney } from '../../utilities/helper';

const { Header, Content } = Layout;
const { Text } = Typography;
const { Meta } = Card;

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
  const [tournamentName, setTournamentName] = useState('');
  const [userList, setUserList] = useState([]);
  const [userCount, setUserCount] = useState(0);
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
    setTournamentName(Data.leagueInfo.tournamentName);
    setUserList(Data.leagueInfo.users);
    setUserCount(Data.leagueInfo.users.length);
    setStatus(Data.leagueInfo.status);
    setLoading(false);
  }

  return (
    <Layout>
      <Header style={{ background: 'none', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', margin: '0' }}>{leagueName}</h1>
      </Header>
      <Header style={{ background: 'none', textAlign: 'center', height: '48px' }}>
        <h2 style={{ lineHeight: '32px', fontWeight: '400', margin: '0'}}>{tournamentName}</h2>
      </Header>
      <Content>
        <Row type='flex' justify='center'>
          <Card title='Users'>
            <Meta
              avatar={<Avatar icon={<UserOutline />} />}
              title={`${userCount} Users`}
            />
          </Card>
        </Row>
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