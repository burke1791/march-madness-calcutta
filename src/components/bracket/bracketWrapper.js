import React from 'react';
import { BracketProvider } from '../../context/bracketContext';
import BracketFactory from './bracketFactory';
import { GAME_WIDTH, SCORE_WIDTH } from './constants';

/**
 * @typedef BracketWrapperProps
 * @property {Array<Object>} games
 * @property {Boolean} isVerticalSplit
 */

/**
 * @component
 * @param {BracketWrapperProps} props 
 */
function BracketWrapper(props) {

  return (
    <BracketProvider initialState={{ gameWidth: GAME_WIDTH, scoreWidth: SCORE_WIDTH }}>
      <BracketFactory
        games={props.games}
        isVerticalSplit={props.isVerticalSplit}
      />
    </BracketProvider>
  );
}

export default BracketWrapper;