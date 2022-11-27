import React, { useState } from 'react';
import { useBracketState } from '../../context/bracketContext';
import Bracket from './bracket';
import RootGame from './rootGame';


const bracketWrapperStyle = {
  // margin: '0 12px',
  height: '100%'
}

/**
 * @typedef BracketFactoryProps
 * @property {Array<Object>} games
 * @property {Boolean} isVerticalSplit
 */

/**
 * @component
 * @param {BracketFactoryProps} props 
 */
function BracketFactory(props) {

  const [verticalSplit, setVerticalSplit] = useState(!!props.isVerticalSplit);
  const [leftGames, setLeftGames] = useState([]);
  const [rightGames, setRightGames] = useState([]);

  const { gameWidth } = useBracketState();

  const getSubBracketGames = (anchor) => {
    if (props.games && props.games.length) {
      let root = findRootGame();
      let leftRootMatchupId = root.parentMatchupIds[0].parentMatchupId;
      let rightRootMatchupId = root.parentMatchupIds[1].parentMatchupId;

      let subTree = [];

      if (anchor == 'left') {
        subTree = constructBinarySubTree(leftRootMatchupId, props.games);
      } else if (anchor == 'right') {
        subTree = constructBinarySubTree(rightRootMatchupId, props.games);
      }

      return subTree;
    }

    return [];
  }

  const findRootGame = () => {
    if (props.games && props.games.length) {
      return props.games.find(game => game.childMatchupId == null);
    }

    return null;
  }

  const constructBinarySubTree = (rootMatchupId, games) => {
    return games.filter(game => {
      return isPartOfSubTree(rootMatchupId, game, games);
    });
  }

  const isPartOfSubTree = (rootMatchupId, game, games) => {
    if (game.childMatchupId == rootMatchupId || game.matchupId == rootMatchupId) {
      return true;
    } else if (game.childMatchupId == null && game.matchupId != rootMatchupId) {
      return false;
    } else {
      let child = games.find(gameObj => gameObj.matchupId == game.childMatchupId);
      return isPartOfSubTree(rootMatchupId, child, games);
    }
  }

  // assumes the first round will have the most games
  const getVerticalSize = (games) => {
    if (!games || !games.length) return 0;

    let numGames = 0;

    games.forEach(game => {
      if (game.roundNum == 1) numGames += 1;
    });

    // if we split the bracket vertically, the vertical height is half
    return (verticalSplit ? numGames / 2 : numGames) * 45;
  }

  const getHorizontalSize = (games) => {
    let numGames = 0;
    let round = 0;

    games.forEach(game => {
      if (game.roundNum > round) round = game.roundNum;
    });

    // if we split the bracket vertically, the horizontal size is doubled minus one (final game is shared with both halves)
    return (verticalSplit ? round * 2 - 2 : round) * (gameWidth + 14);
  }

  return (
    <div style={bracketWrapperStyle}>
      <svg
        height={getVerticalSize(props.games)}
        width={getHorizontalSize(props.games)}
        style={{ margin: '0 36px' }}
      >
        {verticalSplit ? (
          <>
            <RootGame
              game={findRootGame()}
              verticalSplit={true}
              maxX={getHorizontalSize(props.games)}
              maxY={getVerticalSize(props.games)}
            />
            <Bracket
              anchor='left'
              games={getSubBracketGames('left')}
              maxX={getHorizontalSize(props.games)}
              maxY={getVerticalSize(props.games)}
            />
            <Bracket
              anchor='right'
              games={getSubBracketGames('right')}
              maxX={getHorizontalSize(props.games)}
              maxY={getVerticalSize(props.games)}
            />
          </>
        ) : (
          <Bracket
            anchor='left'
            games={props.games}
            maxX={getHorizontalSize(props.games)}
            maxY={getVerticalSize(props.games)}
          />
        )}
      </svg>
    </div>
  );
}

export default BracketFactory;