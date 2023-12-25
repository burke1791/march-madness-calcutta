import React, { useState, useEffect } from 'react';

import { message, Table, Typography } from 'antd';

import { useAuthState } from '../../context/authContext';
import { teamDisplayName } from '../../utilities/helper';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { leagueServiceHelper } from '../../services/league/helper';
import { useLeagueState } from '../../context/leagueContext';

const { Text } = Typography;

function LeagueHomeUpcomingGames(props) {

  const [upcomingGames, setUpcomingGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId, authenticated } = useAuthState();
  const { leagueId } = useLeagueState();

  useEffect(() => {
    if (leagueId !== undefined && authenticated) {
      fetchUpcomingGames();
    }
  }, [leagueId, authenticated]);

  const fetchUpcomingGames = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.UPCOMING_GAMES, { leagueId }).then(response => {
      let games = leagueServiceHelper.packageUpcomingGames(response.data);
      populateUpcomingGames(games);
    }).catch(error => {
      message.error('Unable to get upcoming games, please try again later.');
      setLoading(false);
      console.log(error);
    });
  }

  const populateUpcomingGames = (games) => {
    setUpcomingGames(games);
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