import React, { useState, useEffect } from 'react';

import { Layout, Table, Row, Typography, Col, Tooltip } from 'antd';
import LeagueHomeCards from './leagueHomeCards';
import 'antd/dist/antd.css';
import LeagueService from '../../services/league/league.service';
import { Data, userId } from '../../services/league/endpoints';
import Pubsub from '../../utilities/pubsub';
import { NOTIF, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import AuctionChart from '../auctionChart/auctionChart';
import { navigate } from '@reach/router';
import { useLeagueState } from '../../context/leagueContext';
import { userColumns } from './config/usersTableColumns';
import { upcomingColumns } from './config/upcomingTableColumns';
import { PropertySafetyFilled } from '@ant-design/icons';
import withSubscription from '../../HOC/withSubscription';

const { Header, Content } = Layout;

function LeagueHome(props) {
  
  const [leagueName, setLeagueName] = useState('');
  const [tournamentName, setTournamentName] = useState('');
  const [userList, setUserList] = useState([]);
  const [upcomingGames, setUpcomingGames] = useState([]);
  const [remainingGameCount, setRemainingGameCount] = useState(0)
  const [userCount, setUserCount] = useState(0);
  const [myBuyIn, setMyBuyIn] = useState(0);
  const [myPayout, setMyPayout] = useState(0);
  const [prizepool, setPrizepool] = useState(0);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [upcomingLoading, setUpcomingLoading] = useState(true);

  const { tournamentId, leagueId } = useLeagueState();

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
    if (props.authenticated) {
      fetchDataOnSignIn();
    }
  }, [props.authenticated]);

  useEffect(() => {
    if (leagueId) {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, { leagueId });
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.UPCOMING_GAMES, { leagueId });
    }
  }, [leagueId]);

  useEffect(() => {
    if (tournamentId) {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.REMAINING_GAMES_COUNT, { tournamentId });
    }
  }, [tournamentId]);

  const fetchDataOnSignIn = () => {
    if (leagueId) {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, { leagueId });
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.UPCOMING_GAMES, { leagueId });
    }
    
    if (tournamentId) {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.REMAINING_GAMES_COUNT, { tournamentId });
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
        <LeagueHomeCards userCount={userCount} prizepool={prizepool} remainingGames={remainingGameCount} buyIn={myBuyIn} payout={myPayout} />
        <Row type='flex' justify='center' gutter={[12, 8]}>
          <Col md={20} xxl={12}>
            <Table
              columns={userColumns}
              dataSource={userList}
              rowClassName='pointer'
              size='middle'
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

export default withSubscription(LeagueHome);