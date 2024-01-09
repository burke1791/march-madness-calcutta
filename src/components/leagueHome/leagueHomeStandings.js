import React, { useEffect, useState } from 'react';

import { Table, Typography } from 'antd';

import './leagueHome.css';

import AlivePie from '../alivePie/alivePie';
import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';
import { formatMoney } from '../../utilities/helper';
import { useAuthState } from '../../context/authContext';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useNavigate } from 'react-router-dom';
import useData from '../../hooks/useData';
import { parseLeagueUserSummaries } from '../../parsers/league';

const { Text } = Typography;
const { Column } = Table;

function LeagueHomeStandings(props) {

  const [loading, setLoading] = useState(true);

  const { leagueId, userList } = useLeagueState();
  const { userId, authenticated } = useAuthState();

  const leagueDispatch = useLeagueDispatch();
  const navigate = useNavigate();

  const [leagueUserSummaries, leagueUserSummariesReturnDate, fetchLeagueUserSummaries] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES}/${leagueId}`,
    method: 'GET',
    processData: parseLeagueUserSummaries,
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (authenticated && leagueId) {
      fetchLeagueUserSummaries();
    }
  }, [leagueId, authenticated]);

  useEffect(() => {
    if (leagueUserSummaries && leagueUserSummariesReturnDate) {
      populateStandings(leagueUserSummaries);
    }
  }, [leagueUserSummaries, leagueUserSummariesReturnDate]);

  const populateStandings = (leagueUsers) => {
    if (leagueUsers !== undefined && leagueUsers.length > 0) {
      leagueDispatch({ type: 'update', key: 'userList', value: leagueUsers });
      setLoading(false);
    }
  }

  const getRowClassName = (record) => {
    if (+record.userId === +userId) return 'pointer current-user-row';
    return 'pointer';
  }

  return (
    <Table
      dataSource={userList}
      rowKey='userId'
      rowClassName={getRowClassName}
      size='small'
      pagination={false}
      loading={loading}
      onRow={
        (record, index) => {
          return {
            onClick: (event) => {
              if (leagueId) {
                navigate(`/leagues/${leagueId}/member/${record.userId}`, { state: { userId: record.userId }});
              } else {
                console.log('leagueId is falsy');
              }
            }
          };
        }
      }
    >
      <Column
        title='Rank'
        dataIndex='rank'
        align='center'
        width={75}
      />
      <Column
        title='Name'
        dataIndex='name'
        align='center'
        width={250}
      />
      <Column
        title='Buy In'
        dataIndex='buyIn'
        align='center'
        width={150}
        render={(text) => formatMoney(text)}
      />
      <Column
        title='CurrentPayout'
        dataIndex='payout'
        align='center'
        width={150}
        render={(text) => formatMoney(text)}
      />
      <Column
        title='Net Return'
        dataIndex='return'
        align='center'
        width={150}
        responsive={['xl']}
        render={(text, record) => {
          return (
            <Text
              type={record.return < 0 ? 'danger' : ''}
            >
              {formatMoney(record.return)}
            </Text>
          );
        }}
      />
      <Column
        dataIndex='teamsAlive'
        align='center'
        width={75}
        responsive={['xxl']}
        render={(text, record) => {
          return (
            <AlivePie
              numTeamsAlive={record.numTeamsAlive}
              numTeams={record.numTeams}
            />
          );
        }}
      />
    </Table>
  );
}

export default LeagueHomeStandings;