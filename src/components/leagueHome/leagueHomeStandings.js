import React, { useEffect, useState } from 'react';

import { message, Table, Typography } from 'antd';
import 'antd/dist/antd.css';
import './leagueHome.css';

import AlivePie from '../alivePie/alivePie';
import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';
import { formatMoney } from '../../utilities/helper';
import { useAuthState } from '../../context/authContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { leagueServiceHelper } from '../../services/league/helper';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;
const { Column } = Table;

function LeagueHomeStandings(props) {

  const [loading, setLoading] = useState(true);

  const { leagueId, userList } = useLeagueState();
  const { userId, authenticated } = useAuthState();

  const leagueDispatch = useLeagueDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated && leagueId) {
      fetchLeagueUserSummaries();
    }
  }, [leagueId, authenticated]);

  const fetchLeagueUserSummaries = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, { leagueId }).then(response => {
      let leagueUsers = leagueServiceHelper.packageLeagueUserInfo(response.data, true);
      populateStandings(leagueUsers);
    }).catch(error => {
      message.error('Error downloading league standings, please try again later');
      setLoading(false);
      console.log(error);
    });
  }

  const populateStandings = (leagueUsers) => {
    if (leagueUsers !== undefined && leagueUsers.length > 0) {
      leagueDispatch({ type: 'update', key: 'userList', value: leagueUsers });
      setLoading(false);
    }
  }

  const getRowClassName = (record) => {
    if (record.id == userId) return 'pointer current-user-row';
    return 'pointer';
  }

  return (
    <Table
      // columns={userColumns}
      dataSource={userList}
      rowKey='id'
      rowClassName={getRowClassName}
      size='small'
      pagination={false}
      loading={loading}
      onRow={
        (record, index) => {
          return {
            onClick: (event) => {
              if (leagueId) {
                navigate(`/leagues/${leagueId}/member/${record.id}`, { state: { userId: record.id }});
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