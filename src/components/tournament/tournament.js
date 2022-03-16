import React, { useState, useEffect } from 'react';

import { Button, Col, Layout, message, Row, Select, Skeleton } from 'antd'
import 'antd/dist/antd.css';

import LeagueHeader from '../league/leagueHeader';
import { useLeagueState } from '../../context/leagueContext';
import TournamentService from '../../services/tournament/tournament.service';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS, TOURNAMENT_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { tournamentServiceHelper } from '../../services/tournament/helper';
import BracketFactory from '../bracket/bracket';
import { leagueServiceHelper } from '../../services/league/helper';
import { useTournamentDispatch } from '../../context/tournamentContext';

const { Content } = Layout;
const { Option } = Select;

function Tournament() {

  const [games, setGames] = useState([]);
  const [users, setUsers] = useState();
  const [gamesLoading, setGamesLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const { leagueId, leagueName, tournamentName, tournamentRegimeName } = useLeagueState();
  const tournamentDispatch = useTournamentDispatch();

  useEffect(() => {
    if (leagueId) {
      fetchTournamentTree();
      fetchLeagueUsers();
    }
  }, [leagueId]);

  const secondaryHeaderText = () => {
    let text = tournamentName;

    if (tournamentRegimeName != null) {
      text += ' - ' + tournamentRegimeName;
    }

    return text;
  }

  const getLeagueUserOptions = () => {
    if (users && users.length) {
      return users.map(user => {
        return (
          <Option key={user.id} value={user.id}>{user.name}</Option>
        );
      });
    }

    return null;
  }

  const userSelected = (value, option) => {
    setSelectedUser(value);
    tournamentDispatch({ type: 'update', key: 'bracketUserSelected', value: value });
  }

  const deselectBracketUser = () => {
    setSelectedUser(null);
    tournamentDispatch({ type: 'update', key: 'bracketUserSelected', value: null });
  }

  const fetchTournamentTree = () => {
    TournamentService.callApiWithPromise(TOURNAMENT_SERVICE_ENDPOINTS.GET_TOURNAMENT_TREE, { leagueId }).then(response => {
      console.log(response.data);
      setGames(response.data.bracket);
      setGamesLoading(false);
      // let games = tournamentServiceHelper.packageTournamentTree(response.data);
      // setGames(games);
    }).catch(error => {
      console.log(error);
      message.error('Error downloading bracket');
    });
  }

  const fetchLeagueUsers = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, { leagueId }).then(response => {
      let leagueUsers = leagueServiceHelper.packageLeagueUserInfo(response.data, true);
      // sort users alphabetically
      leagueUsers.sort(function(a, b) {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });
      setUsers(leagueUsers);
    }).catch(error => {
      console.log(error);
    });
  }

  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <LeagueHeader class='secondary' text={secondaryHeaderText()} />
      <Content style={{ textAlign: 'center', minHeight: 'calc(100vh - 192px)', height: '100%' }}>
        <Row justify='center'>
          <Select
            style={{ width: 200 }}
            placeholder='Highlight Teams'
            value={selectedUser}
            onSelect={userSelected}
          >
            {getLeagueUserOptions()}
          </Select>
          <Button
            type='primary'
            onClick={deselectBracketUser}
          >
            Clear
          </Button>
        </Row>
        <Row justify='center'>
          <Col style={{ overflow: 'auto' }}>
            {gamesLoading ? <Skeleton active style={{ marginLeft: 12, marginRight: 12 }} /> : <BracketFactory games={games} />}
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default Tournament;