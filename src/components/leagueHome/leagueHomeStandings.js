import React, { useEffect, useState } from 'react';

import { Table, Typography } from 'antd';
import 'antd/dist/antd.css';

import AlivePie from '../alivePie/alivePie';

import { navigate } from '@reach/router';
import { Data } from '../../services/league/endpoints';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { formatMoney } from '../../utilities/helper';
import { useAuthState } from '../../context/authContext';

const { Text } = Typography;

function LeagueHomeStandings(props) {

  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { leagueId } = useLeagueState();
  const { userId } = useAuthState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHomeStandings, populateStandings);

    if (Data.leagueInfo?.users.length > 0) {
      // in case the API call returns before this component has a chance to register as a subscriber
      populateStandings();
    }

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_USER_SUMMARIES_FETCHED, LeagueHomeStandings);
    });
  }, []);

  const populateStandings = () => {
    setUserList(Data.leagueInfo.users);
    setLoading(false);
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
      rowClassName='pointer'
      size='small'
      pagination={false}
      loading={loading}
      onRow={
        (record, index) => {
          return {
            onClick: (event) => {
              if (leagueId) {
                navigate(`/leagues/${leagueId}/member`, { state: { userId: record.id }});
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