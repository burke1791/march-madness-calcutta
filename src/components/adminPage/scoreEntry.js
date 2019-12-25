import React, { useState, useEffect } from 'react';

import { List } from 'antd';
import 'antd/dist/antd.css';

import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import AdminService from '../../utilities/adminService';

import WrappedScoreEntryForm from './scoreEntryForm';

function ScoreEntry(props) {

  const [teams, setTeams] = useState([]);
  const [buttons, setButtons] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    handleMarchMadnessResults();
    Pubsub.subscribe(NOTIF.MM_RESULTS_DOWNLOADED, ScoreEntry, handleMarchMadnessResults);
    Pubsub.subscribe(NOTIF.MM_SCORE_SET, ScoreEntry, handleScoreSet);
    Pubsub.subscribe(NOTIF.MM_SCORE_SET_ERR, ScoreEntry, handleScoreSetErr);

    return (() => {
      Pubsub.unsubscribe(NOTIF.MM_RESULTS_DOWNLOADED, ScoreEntry);
      Pubsub.unsubscribe(NOTIF.MM_SCORE_SET, ScoreEntry);
      Pubsub.unsubscribe(NOTIF.MM_SCORE_SET_ERR, ScoreEntry);
    });
  }, []);

  const handleMarchMadnessResults = () => {
    console.log('handling results');
    setTeams(AdminService.marchMadnessResults);

    if (AdminService.marchMadnessResults && AdminService.marchMadnessResults.length) {
      let loadingObj = {};
      for (let game of AdminService.marchMadnessResults) {
        let gameCode = 'R' + game.round + game.gameId;
        loadingObj[gameCode] = false;
      }

      setLoading(loadingObj);
    }
  }

  const handleScoreSetErr = (errorObj) => {
    console.log('handling error');
    setButtons({...buttons, [errorObj.gameCode]: 'danger'});
    setLoading({...loading, [errorObj.gameCode]: false});
  }

  const handleScoreSet = (gameCode) => {
    setButtons({...buttons, [gameCode]: 'primary'});
    setLoading({...loading, [gameCode]: false});
  }

  const setSingleGameScore = (scoreObj, round, gameId) => {
    let gameCode = 'R' + round + gameId;
    setLoading({...loading, [gameCode]: true});
    setButtons({...buttons, [gameCode]: null});

    AdminService.sendGameResult(props.year, round, gameId, scoreObj);
  }

  return (
    <List
      size="small"
      dataSource={!!teams && teams.length ? teams : []}
      renderItem={game => {
        let gameCode = 'R' + game.round + game.gameId;
        return (<WrappedScoreEntryForm gameCode={gameCode} round={game.round} gameId={game.gameId} team1={game.team1} team2={game.team2} loading={loading[gameCode]} setScore={setSingleGameScore} button={buttons[gameCode]} />);
      }}
    />
  );
}

export default ScoreEntry;