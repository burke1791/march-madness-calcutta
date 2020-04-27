import React, { useState, useEffect } from 'react';

import { Row } from 'antd'
import 'antd/dist/antd.css';

import Bracket from '../bracket/bracket';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { getTournamentGamesForBracket } from '../../utilities/leagueService';

function Tournament(props) {

  const [games, setGames] = useState([]);

  const { leagueId } = useLeagueState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.TOURNAMENT_BRACKET_GAMES, Tournament, handleGames);

    getTournamentGamesForBracket(leagueId);

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