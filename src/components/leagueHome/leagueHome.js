import React, { useState, useEffect } from 'react';

import { Layout, Table, Row, Typography, Col } from 'antd';
import LeagueHomeCards from './leagueHomeCards';
import 'antd/dist/antd.css';
import { Data, getLeagueUserSummaries, userId } from '../../utilities/leagueService';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import AuctionChart from '../auctionChart/auctionChart';
import AlivePie from '../alivePie/alivePie';
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
  },
  {
    dataIndex: 'teamsAlive',
    align: 'center',
    width: 75,
    render: (text, record) => {
      return <AlivePie percent={0.69} />
    }
  }
];

const upcomingColumns = [
  {
    title: 'Home',
    dataIndex: 'homeTeamName',
    align: 'center',
    width: 200
  },
  {
    title: 'Away',
    dataIndex: 'awayTeamName',
    align: 'center',
    width: 200
  },
  {
    title: 'Region',
    dataIndex: 'region',
    align: 'center',
    width: 150
  },
  {
    title: 'Date',
    dataIndex: 'datetime',
    align: 'center',
    width: 250
  }
]

function LeagueHome(props) {
  
  const [leagueName, setLeagueName] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [userList, setUserList] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [prizepool, setPrizepool] = useState(0);
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

    let prizepool = 0;

    Data.leagueInfo.users.forEach(user => {
      prizepool += user.buyIn
    });

    setPrizepool(prizepool);
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
        <LeagueHomeCards userCount={userCount} prizepool={prizepool} />
        <Row type='flex' justify='center' gutter={[12, 8]}>
          <Col md={20} xxl={12}>
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
          </Col>
        </Row>
        <Row type='flex' justify='center' gutter={[12, 8]}>
          <Col md={20} xxl={12}>
            <Table
              columns={upcomingColumns}
              size='middle'
              pagination={false}
              
            />
          </Col>
        </Row>
        <Row type='flex' justify='center'>
          {/* @TODO move this to the auction results page */}
          <AuctionChart status={status} />
        </Row>
      </Content>
    </Layout>
  );
}

export default LeagueHome;