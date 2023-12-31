import React, { useState, useEffect } from 'react';

import { Layout, Row, Col } from 'antd';
import LeagueHomeCards from './leagueHomeCards';

import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import LeagueHeader from '../league/leagueHeader';
import LeagueHomeStandings from './leagueHomeStandings';
import LeagueHomeUpcomingGames from './leagueHomeUpcomingGames';
import useData from '../../hooks/useData';

const { Content } = Layout;

function LeagueHome() {

  const [remainingTeamsCount, setRemainingTeamsCount] = useState(0)

  const { leagueId, leagueName, tournamentName, tournamentRegimeName, numUsers, prizepool, myBuyIn, myPayout } = useLeagueState();
  const { authenticated } = useAuthState();

  const [remainingTeams, remainingTeamsReturnDate, fetchRemainingTeamCount] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.REMAINING_TEAMS_COUNT}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (leagueId && authenticated) {
      fetchDataOnSignIn();
    }
  }, [leagueId, authenticated]);

  useEffect(() => {
    if (remainingTeams && remainingTeamsReturnDate) {
      console.log(remainingTeams);
      setRemainingTeamsCount(remainingTeams.numTeamsRemaining);
    }
  }, [remainingTeams, remainingTeamsReturnDate])

  const fetchDataOnSignIn = () => {
    fetchRemainingTeamCount();
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
      <Content style={{ overflowX: 'hidden' }}>
        <LeagueHomeCards userCount={numUsers} prizepool={prizepool} remainingTeams={remainingTeamsCount} buyIn={myBuyIn} payout={myPayout} />
        <Row type='flex' justify='center' gutter={[12, 8]} style={{ marginTop: 16 }}>
          <Col md={20} xxl={16}>
            <LeagueHomeStandings />
          </Col>
        </Row>
        <Row type='flex' justify='center' gutter={[12, 8]} style={{ marginTop: 16 }}>
          <Col md={20} xxl={16}>
            <LeagueHomeUpcomingGames />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default LeagueHome;