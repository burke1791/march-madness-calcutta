import React, { useState, useEffect } from 'react';

import { Layout, Table, Row, Typography, Col, Tooltip } from 'antd';
import LeagueHomeCards from './leagueHomeCards';
import 'antd/dist/antd.css';
import { Data, getLeagueUserSummaries, getUpcomingGames, getRemainingGamesCount, userId } from '../../utilities/leagueService';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import AuctionChart from '../auctionChart/auctionChart';
import AlivePie from '../alivePie/alivePie';
import { navigate } from '@reach/router';
import { formatMoney, formatDateTime } from '../../utilities/helper';

const { Header, Content } = Layout;
const { Text } = Typography;

const columns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    align: 'center',
    width: 75,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <Text>{text}</Text>
        }
      }
      return <Text>{text}</Text>;
    }
  },
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'center',
    width: 250,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <Text>{text}</Text>
        }
      }
      return <Text>{text}</Text>;
    }
  },
  {
    title: 'Buy In',
    dataIndex: 'buyIn',
    align: 'center',
    width: 150,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <Text>{formatMoney(record.buyIn)}</Text>
        }
      }
      return <Text>{formatMoney(record.buyIn)}</Text>;
    }
  },
  {
    title: 'Current Payout',
    dataIndex: 'payout',
    align: 'center',
    width: 150,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <Text>{formatMoney(record.payout)}</Text>
        }
      }
      return <Text>{formatMoney(record.payout)}</Text>;
    }
  },
  {
    title: 'Net Return',
    dataIndex: 'return',
    align: 'center',
    width: 150,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <Text type={record.return < 0 ? 'danger' : ''}>{formatMoney(record.return)}</Text>
        }
      }
      return <Text type={record.return < 0 ? 'danger' : ''}>{formatMoney(record.return)}</Text>
    }
  },
  {
    dataIndex: 'teamsAlive',
    align: 'center',
    width: 75,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <AlivePie numTeamsAlive={record.numTeamsAlive} numTeams={record.numTeams} />
        }
      }
      return <AlivePie numTeamsAlive={record.numTeamsAlive} numTeams={record.numTeams} />;
    }
  }
];

const upcomingColumns = [
  {
    title: 'Upcoming Games',
    dataIndex: 'homeTeamName',
    colSpan: 2,
    align: 'center',
    width: 200,
    render: (text, record) => {
      let teamName = record.homeTeamName == null ? 'TBD' : `(${record.homeTeamSeed}) ${record.homeTeamName}`;

      if (record.homeTeamOwnerId == userId) {
        return <Text strong>{teamName}</Text>;
      }
      return <Text>{teamName}</Text>;
    }
  },
  {
    title: 'Away',
    dataIndex: 'awayTeamName',
    colSpan: 0,
    align: 'center',
    width: 200,
    render: (text, record) => {
      let teamName = record.awayTeamName == null ? 'TBD' : `(${record.awayTeamSeed}) ${record.awayTeamName}`;

      if (record.awayTeamOwnerId == userId) {
        return <Text strong>{teamName}</Text>;
      }
      return <Text>{teamName}</Text>;
    }
  },
  {
    title: 'Date',
    dataIndex: 'eventDate',
    align: 'center',
    width: 250,
    render: (text, record) => {
      return <Text>{formatDateTime(record.eventDate)}</Text>
    }
  }
]

function LeagueHome(props) {
  
  const [leagueName, setLeagueName] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [userList, setUserList] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [remainingGameCount, setRemainingGameCount] = useState(0)
  const [userCount, setUserCount] = useState(0);
  const [prizepool, setPrizepool] = useState(0);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHome, getLeagueInfo);
    Pubsub.subscribe(NOTIF.UPCOMING_GAMES_DOWNLOADED, LeagueHome, handleUpcomingGames);
    Pubsub.subscribe(NOTIF.REMAINING_GAMES_COUNT_DOWNLOADED, LeagueHome, handleRemainingGameCount);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHome);
      Pubsub.unsubscribe(NOTIF.UPCOMING_GAMES_DOWNLOADED, LeagueHome);
      Pubsub.unsubscribe(NOTIF.REMAINING_GAMES_COUNT_DOWNLOADED, LeagueHome);
    });
  }, []);

  useEffect(() => {
    getLeagueUserSummaries(props.leagueId);
    getUpcomingGames(props.leagueId);
  }, [props.leagueId]);

  useEffect(() => {
    getRemainingGamesCount(props.tournamentId);
  }, [props.tournamentId]);

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

  const handleUpcomingGames = () => {
    setUpcomingGames(Data.upcomingGames);
    setUpcomingLoading(false);
  }

  const handleRemainingGameCount = () => {
    setRemainingGameCount(Data.remainingGames);
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
        <LeagueHomeCards userCount={userCount} prizepool={prizepool} remainingGames={remainingGameCount} />
        <Row type='flex' justify='center' gutter={[12, 8]}>
          <Col md={20} xxl={12}>
            <Table
              columns={columns}
              dataSource={userList}
              rowClassName='pointer'
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
              dataSource={upcomingGames}
              size='middle'
              pagination={false}
              loading={upcomingLoading}
              rowKey='gameId'
            />
          </Col>
        </Row>
        {/* <Row type='flex' justify='center' gutter={[12, 8]}>
          @TODO move this to the auction results page
          <AuctionChart status={status} />
        </Row> */}
      </Content>
    </Layout>
  );
}

export default LeagueHome;