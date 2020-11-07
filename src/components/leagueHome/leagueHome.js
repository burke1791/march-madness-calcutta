import React, { useState, useEffect } from 'react';

import { Layout, Row, Typography, Col } from 'antd';
import LeagueHomeCards from './leagueHomeCards';
import 'antd/dist/antd.css';
import LeagueService from '../../services/league/league.service';
import { cleanupLeagueHomeData, Data } from '../../services/league/endpoints';
import Pubsub from '../../utilities/pubsub';
import { NOTIF, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import LeagueHeader from '../league/leagueHeader';
import LeagueHomeStandings from './leagueHomeStandings';
import LeagueHomeUpcomingGames from './leagueHomeUpcomingGames';

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

      cleanupLeagueHomeData();
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

  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <LeagueHeader class='secondary' text={tournamentName} />
      <Content>
        <LeagueHomeCards userCount={userCount} prizepool={prizepool} remainingTeams={remainingTeamsCount} buyIn={myBuyIn} payout={myPayout} />
        <Row type='flex' justify='center' gutter={[12, 8]}>
          <Col md={20} xxl={12}>
            <LeagueHomeStandings />
          </Col>
        </Row>
        <Row type='flex' justify='center' gutter={[12, 8]}>
          <Col md={20} xxl={12}>
            {/* <Table
              columns={upcomingColumns}
              dataSource={upcomingGames}
              size='small'
              pagination={false}
              loading={upcomingLoading}
              rowKey='gameId'
            /> */}
            <LeagueHomeUpcomingGames />
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