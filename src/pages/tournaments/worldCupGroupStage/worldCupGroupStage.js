import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import 'antd/dist/antd.css';
import LeagueHeader from '../../../components/league/leagueHeader';
import { useLeagueState } from '../../../context/leagueContext';
import HighlightDropdown from './highlightDropdown';
import useData from '../../../hooks/useData';
import { API_CONFIG, TOURNAMENT_SERVICE_ENDPOINTS } from '../../../utilities/constants';
import { parseWorldCupTables } from '../../../services/tournament/helper';
import { useAuthState } from '../../../context/authContext';
import WorldCupTable from './worldCupTable';

const { Content } = Layout;

function WorldCupGroupStage(props) {

  const [teamsParsed, setTeamsParsed] = useState(null);
  const [groupA, setGroupA] = useState([]);
  const [groupB, setGroupB] = useState([]);
  const [groupC, setGroupC] = useState([]);
  const [groupD, setGroupD] = useState([]);
  const [groupE, setGroupE] = useState([]);
  const [groupF, setGroupF] = useState([]);
  const [groupG, setGroupG] = useState([]);
  const [groupH, setGroupH] = useState([]);

  const { authenticated } = useAuthState();
  const { leagueId, leagueName } = useLeagueState();

  const [groups, groupsReturnDate, fetchGroups] = useData({
    baseUrl: API_CONFIG.TOURNAMENT_SERVICE_BASE_URL,
    endpoint: `${TOURNAMENT_SERVICE_ENDPOINTS.GET_WORLD_CUP_TABLES}/${leagueId}`,
    method: 'GET',
    processData: parseWorldCupTables,
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (authenticated && leagueId) {
      fetchGroups();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    if (groupsReturnDate) {
      setGroupA(groups.find(group => group.groupName === 'Group A').teams);
      setGroupB(groups.find(group => group.groupName === 'Group B').teams);
      setGroupC(groups.find(group => group.groupName === 'Group C').teams);
      setGroupD(groups.find(group => group.groupName === 'Group D').teams);
      setGroupE(groups.find(group => group.groupName === 'Group E').teams);
      setGroupF(groups.find(group => group.groupName === 'Group F').teams);
      setGroupG(groups.find(group => group.groupName === 'Group G').teams);
      setGroupH(groups.find(group => group.groupName === 'Group H').teams);
      setTeamsParsed(groupsReturnDate);
    }
  }, [groupsReturnDate]);
  
  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <LeagueHeader class='secondary' text='World Cup Tables' />
      <Content style={{ textAlign: 'center', height: 'calc(100vh - 192px)', overflowY: 'scroll' }}>
        <HighlightDropdown
          selectedUserKey='worldCupSelectedUser'
          selectPlaceholder='Highlight Teams'
        />
        <WorldCupTable groupName='Group A' teams={groupA} teamsParsed={teamsParsed} />
        <WorldCupTable groupName='Group B' teams={groupB} teamsParsed={teamsParsed} />
        <WorldCupTable groupName='Group C' teams={groupC} teamsParsed={teamsParsed} />
        <WorldCupTable groupName='Group D' teams={groupD} teamsParsed={teamsParsed} />
        <WorldCupTable groupName='Group E' teams={groupE} teamsParsed={teamsParsed} />
        <WorldCupTable groupName='Group F' teams={groupF} teamsParsed={teamsParsed} />
        <WorldCupTable groupName='Group G' teams={groupG} teamsParsed={teamsParsed} />
        <WorldCupTable groupName='Group H' teams={groupH} teamsParsed={teamsParsed} />
      </Content>
    </Layout>
  )
}

export default WorldCupGroupStage;