import React, { useState, useEffect } from 'react';

import { Table, Typography } from 'antd';

import { useAuthState } from '../../context/authContext';
import { teamDisplayName } from '../../utilities/helper';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import useData from '../../hooks/useData';

const { Text } = Typography;

function LeagueHomeUpcomingGames(props) {

  const [loading, setLoading] = useState(true);

  const { userId, authenticated } = useAuthState();
  const { leagueId } = useLeagueState();

  const [upcomingGames, upcomingGamesReturnDate, fetchUpcomingGames] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.UPCOMING_GAMES}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (leagueId && authenticated) {
      fetchUpcomingGames();
    }
  }, [leagueId, authenticated]);

  useEffect(() => {
    if (upcomingGames && upcomingGamesReturnDate) {
      setLoading(false);
    }
  }, [upcomingGames, upcomingGamesReturnDate]);

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