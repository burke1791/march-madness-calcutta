import React, { useState, useEffect } from 'react';

import { Layout, Table, Row, Typography, Col, Tooltip } from 'antd';
import LeagueHomeCards from './leagueHomeCards';
import AlivePie from '../alivePie/alivePie';
import 'antd/dist/antd.css';
import LeagueService from '../../services/league/league.service';
import { Data } from '../../services/league/endpoints';
import Pubsub from '../../utilities/pubsub';
import { NOTIF, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import AuctionChart from '../auctionChart/auctionChart';
import { navigate } from '@reach/router';
import { useLeagueState } from '../../context/leagueContext';
import { formatMoney, formatDateTime, teamDisplayName } from '../../utilities/helper';
import withAuth from '../../HOC/withAuth';
import { useAuthState } from '../../context/authContext';
import LeagueHeader from '../league/leagueHeader';

const { Header, Content } = Layout;
const { Text, Title } = Typography;

function LeagueHome() {
  
  const [leagueName, setLeagueName] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [userList, setUserList] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [remainingTeamsCount, setRemainingTeamsCount] = useState(0)
  const [userCount, setUserCount] = useState(0);
  const [myBuyIn, setMyBuyIn] = useState(0);
  const [myPayout, setMyPayout] = useState(0);
  const [prizepool, setPrizepool] = useState(0);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);

  const { tournamentId, leagueId } = useLeagueState();
  const { userId, authenticated } = useAuthState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHome, getLeagueInfo);
    Pubsub.subscribe(NOTIF.UPCOMING_GAMES_DOWNLOADED, LeagueHome, handleUpcomingGames);
    Pubsub.subscribe(NOTIF.REMAINING_TEAMS_COUNT_DOWNLOADED, LeagueHome, handleRemainingGameCount);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHome);
      Pubsub.unsubscribe(NOTIF.UPCOMING_GAMES_DOWNLOADED, LeagueHome);
      Pubsub.unsubscribe(NOTIF.REMAINING_TEAMS_COUNT_DOWNLOADED, LeagueHome);
    });
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchDataOnSignIn();
    }
  }, [authenticated]);

  useEffect(() => {
    if (leagueId) {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, { leagueId });
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.UPCOMING_GAMES, { leagueId });
    }
  }, [leagueId]);

  useEffect(() => {
    if (tournamentId) {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.REMAINING_TEAMS_COUNT, { tournamentId });
    }
  }, [tournamentId]);

  const fetchDataOnSignIn = () => {
    if (leagueId) {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, { leagueId });
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.UPCOMING_GAMES, { leagueId });
    }
    
    if (tournamentId) {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.REMAINING_TEAMS_COUNT, { tournamentId });
    }
  }

  const getLeagueInfo = () => {
    setLeagueName(Data.leagueInfo.name);
    setTournamentName(Data.leagueInfo.tournamentName);
    setUserList(Data.leagueInfo.users);
    setUserCount(Data.leagueInfo.users.length);
    setStatus(Data.leagueInfo.status);
    setLoading(false);

    let prizepool = 0;

    Data.leagueInfo.users.forEach(user => {
      if (user.id == userId) {
        setMyBuyIn(user.buyIn);
        setMyPayout(user.payout);
      }

      prizepool += user.buyIn
    });

    setPrizepool(prizepool);
  }

  const handleUpcomingGames = () => {
    setUpcomingGames(Data.upcomingGames);
    setUpcomingLoading(false);
  }

  const handleRemainingGameCount = () => {
    setRemainingTeamsCount(Data.remainingTeams);
  }

  const userColumns = [
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
      responsive: ['md'],
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
      responsive: ['lg'],
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
        let teamName = teamDisplayName(record.homeTeamName, record.homeTeamSeed);
  
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
        let teamName = teamDisplayName(record.awayTeamName, record.awayTeamSeed);
  
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
        // return <Text>{formatDateTime(record.eventDate)}</Text>
        return <Text>{text}</Text>
      }
    }
  ]

  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <LeagueHeader class='secondary' text={tournamentName} />
      <Content>
        <LeagueHomeCards userCount={userCount} prizepool={prizepool} remainingTeams={remainingTeamsCount} buyIn={myBuyIn} payout={myPayout} />
        <Row type='flex' justify='center' gutter={[12, 8]}>
          <Col md={20} xxl={12}>
            <Table
              columns={userColumns}
              dataSource={userList}
              rowClassName='pointer'
              size='small'
              pagination={false}
              loading={loading}
              onRow={
                (record, index) => {
                  return {
                    onClick: (event) => {
                      if (leagueId) {
                        navigate(`/leagues/${leagueId}/member`, { state: { userId: record.id }});
                      } else {
                        console.log('leagueId is falsy');
                      }
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
              size='small'
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