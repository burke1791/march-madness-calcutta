import React, { useEffect, useState } from 'react';

import { Table, Typography } from 'antd';
import 'antd/dist/antd.css';

import AlivePie from '../alivePie/alivePie';

import { navigate } from '@reach/router';
import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';
import { formatMoney } from '../../utilities/helper';
import { useAuthState } from '../../context/authContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { leagueServiceHelper } from '../../services/league/helper';

const { Text } = Typography;

function LeagueHomeStandings(props) {

  const [loading, setLoading] = useState(true);

  const { leagueId, userList } = useLeagueState();
  const { userId, authenticated } = useAuthState();

  const leagueDispatch = useLeagueDispatch();

  useEffect(() => {
    if (authenticated && leagueId) {
      fetchLeagueUserSummaries();
    }
  }, [leagueId, authenticated]);

  const fetchLeagueUserSummaries = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, { leagueId }).then(response => {
      let leagueUsers = leagueServiceHelper.packageLeagueUserInfo(response.data);
      populateStandings(leagueUsers);
    }).catch(error => {
      console.log(error);
    });
  }

  const populateStandings = (leagueUsers) => {
    if (leagueUsers !== undefined && leagueUsers.length > 0) {
      leagueDispatch({ type: 'update', key: 'userList', value: leagueUsers });
      setLoading(false);
    }
  }

  const userColumns = [
    {
      title: 'Rank',
      dataIndex: 'rank',
      align: 'center',
      width: 75,
      render: (text, record) => {
        if (record.id == userId) {
          return {
            props: {
              style: {
                backgroundColor: '#b7daff'
              }
            },
            children: <Text>{text}</Text>
          }
        }
        return <Text>{text}</Text>;
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      width: 250,
      render: (text, record) => {
        if (record.id == userId) {
          return {
            props: {
              style: {
                backgroundColor: '#b7daff'
              }
            },
            children: <Text>{text}</Text>
          }
        }
        return <Text>{text}</Text>;
      }
    },
    {
      title: 'Buy In',
      dataIndex: 'buyIn',
      align: 'center',
      width: 150,
      render: (text, record) => {
        if (record.id == userId) {
          return {
            props: {
              style: {
                backgroundColor: '#b7daff'
              }
            },
            children: <Text>{formatMoney(record.buyIn)}</Text>
          }
        }
        return <Text>{formatMoney(record.buyIn)}</Text>;
      }
    },
    {
      title: 'Current Payout',
      dataIndex: 'payout',
      align: 'center',
      width: 150,
      render: (text, record) => {
        if (record.id == userId) {
          return {
            props: {
              style: {
                backgroundColor: '#b7daff'
              }
            },
            children: <Text>{formatMoney(record.payout)}</Text>
          }
        }
        return <Text>{formatMoney(record.payout)}</Text>;
      }
    },
    {
      title: 'Net Return',
      dataIndex: 'return',
      align: 'center',
      width: 150,
      responsive: ['md'],
      render: (text, record) => {
        if (record.id == userId) {
          return {
            props: {
              style: {
                backgroundColor: '#b7daff'
              }
            },
            children: <Text type={record.return < 0 ? 'danger' : ''}>{formatMoney(record.return)}</Text>
          }
        }
        return <Text type={record.return < 0 ? 'danger' : ''}>{formatMoney(record.return)}</Text>
      }
    },
    {
      dataIndex: 'teamsAlive',
      align: 'center',
      width: 75,
      responsive: ['lg'],
      render: (text, record) => {
        if (record.id == userId) {
          return {
            props: {
              style: {
                backgroundColor: '#b7daff'
              }
            },
            children: <AlivePie numTeamsAlive={record.numTeamsAlive} numTeams={record.numTeams} />
          }
        }
        return <AlivePie numTeamsAlive={record.numTeamsAlive} numTeams={record.numTeams} />;
      }
    }
  ];

  return (
    <Table
      columns={userColumns}
      dataSource={userList}
      rowKey='id'
      rowClassName='pointer'
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
    />
  );
}

export default LeagueHomeStandings;