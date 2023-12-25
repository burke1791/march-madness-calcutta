import React, { useState, useEffect } from 'react';

import { Layout, Row, Col } from 'antd';
import LeagueHomeCards from './leagueHomeCards';

import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import LeagueHeader from '../league/leagueHeader';
import LeagueHomeStandings from './leagueHomeStandings';
import LeagueHomeUpcomingGames from './leagueHomeUpcomingGames';

const { Content } = Layout;

function LeagueHome() {

  const [remainingTeamsCount, setRemainingTeamsCount] = useState(0)

  const { leagueId, leagueName, tournamentName, tournamentRegimeName, numUsers, prizepool, myBuyIn, myPayout } = useLeagueState();
  const { authenticated } = useAuthState();

  useEffect(() => {
    if (authenticated) {
      fetchDataOnSignIn();
    }
  }, [authenticated]);

  useEffect(() => {
    if (leagueId) {
      fetchRemainingTeamCount();
    }
  }, [leagueId]);

  const fetchDataOnSignIn = () => {
    if (leagueId) {
      fetchRemainingTeamCount();
    }
  }

  const fetchRemainingTeamCount = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.REMAINING_TEAMS_COUNT, { leagueId }).then(response => {
      if (response.data.length > 0) {
        if (Object.keys(response.data[0])[0] === 'Error') {
          throw new Error(response.data[0].Error);
        }

        setRemainingTeamsCount(response.data[0].NumTeamsRemaining);
      }
    }).catch(error => {
      console.log(error);
    });
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