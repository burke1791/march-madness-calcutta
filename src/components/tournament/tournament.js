import React, { useState, useEffect } from 'react';

import { Button, Layout, message, Row, Select } from 'antd'
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
  const [selectedUser, setSelectedUser] = useState(null);

  const { leagueId, leagueName, tournamentName, tournamentRegimeName } = useLeagueState();
  const tournamentDispatch = useTournamentDispatch();

  useEffect(() => {
    if (leagueId && tournamentName == '2021 March Madness') {
      fetchTournamentTree();
      fetchLeagueUsers();
    }
  }, [leagueId, tournamentName]);

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
      let games = tournamentServiceHelper.packageTournamentTree(response.data);
      console.log(games);
      setGames(games);
    }).catch(error => {
      console.log(error);
      message.error('Error downloading bracket');
    });
  }

  const fetchLeagueUsers = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, { leagueId }).then(response => {
      let leagueUsers = leagueServiceHelper.packageLeagueUserInfo(response.data, true);
      setUsers(leagueUsers);
    }).catch(error => {
      console.log(error);
    });
  }

  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <LeagueHeader class='secondary' text={secondaryHeaderText()} />
      <Content style={{ textAlign: 'center', minHeight: 'calc(100vh - 192px)', height: '100%', overflow: 'auto' }}>
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
        <BracketFactory games={games} />
      </Content>
    </Layout>
  );
}

export default Tournament;

/*

<Select
    showSearch
    style={{ width: 200 }}
    placeholder="Select a person"
    optionFilterProp="children"
    onChange={onChange}
    onFocus={onFocus}
    onBlur={onBlur}
    onSearch={onSearch}
    filterOption={(input, option) =>
      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  >
    <Option value="jack">Jack</Option>
    <Option value="lucy">Lucy</Option>
    <Option value="tom">Tom</Option>
  </Select>
*/