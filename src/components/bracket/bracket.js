import React, { Fragment } from 'react';
import { useBracketState } from '../../context/bracketContext';
import BracketGame from './bracketGame';

/**
 * @typedef BracketProps
 * @property {('left'|'right')} anchor
 * @property {Array<Object>} games
 * @property {Number} maxX
 * @property {Number} maxY
 */

/**
 * @component
 * @param {BracketProps} props 
 */
function Bracket(props) {

  const { gameWidth } = useBracketState();

  const getBracketGamePosition = (matchupId, roundNum) => {
    let gameNum = getGameNum(matchupId);

    return {
      x: getX(roundNum),
      y: getY(roundNum, gameNum) 
    };
  }

  const getX = (round) => {
    if (props.anchor == 'left') {
      return (round - 1) * (gameWidth + 14);
    } else if (props.anchor == 'right') {
      return props.maxX - (round - 1) * (gameWidth + 14) - gameWidth;
    }
  }

  const getY = (round, game) => {
    if (round == 1) {
      return (game - 1) * 45;
    } else {
      return (getY(round - 1, game * 2) + getY(round - 1, game * 2 - 1)) / 2;
    }
  }

  const getGameNum = (matchupId) => {
    if (!matchupId) return null;

    let currentGame = props.games.find(game => game.matchupId == matchupId);

    let matchupNums = props.games.filter(game => game.roundNum == currentGame.roundNum).map(game => game.matchupNum);
    matchupNums.sort((a, b) => a - b);

    let gameNum = matchupNums.indexOf(currentGame.matchupNum) + 1;

    return gameNum;
  }

  const getVerticalDistanceForNextGamePath = (round) => {
    // vertical distance between games in the current round
    let dy = getY(round, 2) - getY(round, 1);

    // 26 is a hard-coded value for now - can change when we refactor to adjustable bracket sizes
    return Math.ceil((dy - 26) / 2);
  }

  const drawLineToNextGame = (matchupId, nextGameId, roundNum) => {
    if (nextGameId == null || nextGameId == undefined || props.games.find(game => game.matchupId == nextGameId) == undefined) return null;

    let gameNum = getGameNum(matchupId);
    let x = props.anchor == 'left' ? getX(roundNum + 1) - 12 : getX(roundNum + 1) + gameWidth + 12;
    let y = getY(roundNum, gameNum) + 23;
    let v = getVerticalDistanceForNextGamePath(roundNum);

    if (props.anchor == 'left') {
      if (gameNum % 2 == 0) {
        // path curving upward for even numbered games
        return (
          <path d={`m${x},${y} h3 a2,2 0 0 0 2,-2 v-${v} a2,2 0 0 1 2,-2 h3`} fill='transparent' stroke='#000' />
        )
      } else {
        // path curving downward for odd numbered games
        return (
          <path d={`m${x},${y} h3 a2,2 0 0 1 2,2 v${v} a2,2 0 0 0 2,2 h3`} fill='transparent' stroke='#000' />
        )
      }
    } else if (props.anchor == 'right') {
      if (gameNum % 2 == 0) {
        // path curving upward for even numbered games
        return (
          <path d={`m${x},${y} h-3 a2,2 0 0 1 -2,-2 v-${v} a2,2 0 0 0 -2,-2 h-3`} fill='transparent' stroke='#000' />
        )
      } else {
        // path curving downward for odd numbered games
        return (
          <path d={`m${x},${y} h-3 a2,2 0 0 0 -2,2 v${v} a2,2 0 0 1 -2,2 h-3`} fill='transparent' stroke='#000' />
        )
      }
    }
  }

  // I hate this
  const getTeamsInDisplayOrder = (game) => {
    // lower seed goes on top
    if (game.roundNum == 1) {
      return game.teams[0].seed < game.teams[1].seed ? [game.teams[0], game.teams[1]] : [game.teams[1], game.teams[0]];
    } else if (game.parentMatchupIds.length == 2) {
      let parentGame1 = props.games.find(gameObj => gameObj.matchupId == game.parentMatchupIds[0].parentMatchupId);
      let parentGame2 = props.games.find(gameObj => gameObj.matchupId == game.parentMatchupIds[1].parentMatchupId);
      let parentGame1GameNum = getGameNum(parentGame1?.matchupId);
      let parentGame2GameNum = getGameNum(parentGame2?.matchupId);

      if (parentGame1GameNum == null && parentGame2GameNum == null) {
        // lower seed goes on top
        return game.teams[0].seed < game.teams[1].seed ? [game.teams[0], game.teams[1]] : [game.teams[1], game.teams[0]];
      } else if (parentGame1GameNum == null) {
        if (parentGame2.teams[0].teamId == game.teams[0].teamId || parentGame2.teams[1].teamId == game.teams[0].teamId) {
          return [game.teams[0], game.teams[1]];
        } else {
          return [game.teams[1], game.teams[0]];
        }
      } else if (parentGame2GameNum == null) {
        if (parentGame1.teams[0].teamId == game.teams[0].teamId || parentGame1.teams[1].teamId == game.teams[0].teamId) {
          return [game.teams[0], game.teams[1]];
        } else {
          return [game.teams[1], game.teams[0]];
        }
      } else if (parentGame1GameNum < parentGame2GameNum) {
        if (parentGame1.teams[0].teamId == game.teams[0].teamId || parentGame1.teams[1].teamId == game.teams[0].teamId) {
          return [game.teams[0], game.teams[1]];
        } else {
          return [game.teams[1], game.teams[0]];
        }
      } else {
        if (parentGame1.teams[0].teamId == game.teams[0].teamId || parentGame1.teams[1].teamId == game.teams[0].teamId) {
          return [game.teams[1], game.teams[0]];
        } else {
          return [game.teams[0], game.teams[1]];
        }
      }
    }
  }

  const generateBracket = () => {
    if (props.games && props.games.length) {
      let numGames = props.games.length;
      let rounds = logBase(numGames + 1, 2);

      // if (rounds !== Math.floor(rounds)) {
      //   console.error('Number of games not consistent with a symmetric bracket');
      //   return null;
      // }

      return props.games.map(game => {
        let [team1, team2] = getTeamsInDisplayOrder(game);

        return (
          <Fragment key={game.matchupId}>
            <BracketGame
              team1={team1}
              team2={team2}
              anchor={props.anchor}
              pos={getBracketGamePosition(game.matchupId, game.roundNum)}
            />
            {drawLineToNextGame(game.matchupId, game.childMatchupId, game.roundNum)}
          </Fragment>
        );
      });
    }

    return null;
  }

  return (
    <>
      {generateBracket()}
    </>
  );
}

function logBase(val, base) {
  return Math.log(val) / Math.log(base);
}

export default Bracket;