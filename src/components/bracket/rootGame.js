import React from 'react';
import { useBracketState } from '../../context/bracketContext';
import BracketGame from './bracketGame';

function RootGame(props) {

  const { gameWidth } = useBracketState();

  const getWinnerLogoUrl = () => {
    if (props.game != null) {
      if (props.game.teams[0].score > props.game.teams[1].score) return props.game.teams[0].logoUrl;
      if (props.game.teams[1].score > props.game.teams[0].score) return props.game.teams[0].logoUrl;
      return null;
    }
  }

  const getChampGamePosition = () => {
    if (props.verticalSplit) {
      return {
        x: (props.maxX / 2) - (gameWidth / 2),
        y: props.maxY / 4
      }
    }

    return null;
  }

  if (props.verticalSplit && props.game != null) {
    return (
      <>
        <BracketGame
          team1={props.game.teams[0]}
          team2={props.game.teams[1]}
          anchor='left'
          pos={getChampGamePosition()}
        />
      </>
    );
  } else {
    return null;
  }
}

export default RootGame;