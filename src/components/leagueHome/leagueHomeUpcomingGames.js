import React, { useState, useEffect } from 'react';

import { Table, Typography } from 'antd';
import 'antd/dist/antd.css';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import { Data } from '../../services/league/endpoints';
import { useAuthState } from '../../context/authContext';
import { teamDisplayName } from '../../utilities/helper';

const { Text } = Typography;

function LeagueHomeUpcomingGames(props) {

  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = useAuthState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.UPCOMING_GAMES_DOWNLOADED, LeagueHomeUpcomingGames, populateUpcomingGames);

    if (Data.upcomingGames?.length > 0) {
      // in case the API call returns before this component has a chance to register as a subscriber
      populateUpcomingGames();
    }

    return (() => {
      Pubsub.unsubscribe(NOTIF.UPCOMING_GAMES_DOWNLOADED, LeagueHomeUpcomingGames);
    });
  }, []);

  const populateUpcomingGames = () => {
    setUpcomingGames(Data.upcomingGames);
    setLoading(false);
  }

  const upcomingColumns = [
    {
      title: 'Upcoming Games',
      dataIndex: 'homeTeamName',
      colSpan: 2,
      align: 'center',
      width: 200,
      render: (text, record) => {
        let teamName = teamDisplayName(record.homeTeamName, record.homeTeamSeed);
  
        if (record.homeTeamOwnerId == userId) {
          return <Text strong>{teamName}</Text>;
        }
        return <Text>{teamName}</Text>;
      }
    },
    {
      title: 'Away',
      dataIndex: 'awayTeamName',
      colSpan: 0,
      align: 'center',
      width: 200,
      render: (text, record) => {
        let teamName = teamDisplayName(record.awayTeamName, record.awayTeamSeed);
  
        if (record.awayTeamOwnerId == userId) {
          return <Text strong>{teamName}</Text>;
        }
        return <Text>{teamName}</Text>;
      }
    },
    {
      title: 'Date',
      dataIndex: 'eventDate',
      align: 'center',
      width: 250,
      render: (text, record) => {
        // return <Text>{formatDateTime(record.eventDate)}</Text>
        return <Text>{text}</Text>
      }
    }
  ];

  return (
    <Table
      columns={upcomingColumns}
      dataSource={upcomingGames}
      size='small'
      pagination={false}
      loading={loading}
      rowKey='gameId'
    />
  );
}

export default LeagueHomeUpcomingGames;