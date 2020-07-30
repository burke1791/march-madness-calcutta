import React, { useState, useEffect } from 'react';

import { Row } from 'antd'
import 'antd/dist/antd.css';

import Bracket from '../bracket/bracket';
import Pubsub from '../../utilities/pubsub';
import { NOTIF, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import LeagueService from '../../services/league/league.service';

function Tournament(props) {

  const [games, setGames] = useState([]);

  const { leagueId } = useLeagueState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.TOURNAMENT_BRACKET_GAMES, Tournament, handleGames);

    LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.TOURNAMENT_BRACKET_GAMES, { leagueId });

    return (() => {
      Pubsub.unsubscribe(NOTIF.TOURNAMENT_BRACKET_GAMES, Tournament);
    });
  }, [leagueId]);

  const handleGames = (games) => {
    setGames(games);
  }

  return (
    <Bracket games={games} />
  );
}

export default Tournament;