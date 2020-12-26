import React, { useState, useEffect } from 'react';

import { Layout, Row, Col } from 'antd';
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

const { Content } = Layout;

function LeagueHome() {

  const [remainingTeamsCount, setRemainingTeamsCount] = useState(0)
  const [userCount, setUserCount] = useState(0);
  const [myBuyIn, setMyBuyIn] = useState(0);
  const [myPayout, setMyPayout] = useState(0);
  const [prizepool, setPrizepool] = useState(0);

  const { leagueId, leagueName, tournamentName, tournamentRegimeName } = useLeagueState();
  const { userId, authenticated } = useAuthState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHome, getLeagueInfo);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHome);

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

      fetchRemainingTeamCount();
    }
  }, [leagueId]);

  const fetchDataOnSignIn = () => {
    if (leagueId) {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, { leagueId });
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.UPCOMING_GAMES, { leagueId });

      fetchRemainingTeamCount();
    }
  }

  const fetchRemainingTeamCount = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.REMAINING_TEAMS_COUNT, { leagueId }).then(response => {

      if (Object.keys(response.data[0])[0] === 'Error') {
        throw new Error(response.data[0].Error);
      }

      setRemainingTeamsCount(response.data[0].NumTeamsRemaining);
    }).catch(error => {
      console.log(error);
    })
  }

  const getLeagueInfo = () => {
    setUserCount(Data.leagueInfo.users.length);

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

  const secondaryHeaderText = () => {
    let text = tournamentName;

    if (tournamentRegimeName != null) {
      text += ' - ' + tournamentRegimeName;
    }

    return text;
  }

  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <LeagueHeader class='secondary' text={secondaryHeaderText()} />
      <Content>
        <LeagueHomeCards userCount={userCount} prizepool={prizepool} remainingTeams={remainingTeamsCount} buyIn={myBuyIn} payout={myPayout} />
        <Row type='flex' justify='center' gutter={[12, 8]}>
          <Col md={20} xxl={12}>
            <LeagueHomeStandings />
          </Col>
        </Row>
        <Row type='flex' justify='center' gutter={[12, 8]}>
          <Col md={20} xxl={12}>
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