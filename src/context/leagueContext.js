import React, { createContext, useReducer, useContext } from 'react'
import { calcuttaStore } from '../utilities/helper';

const LeagueStateContext = createContext()
const LeagueDispatchContext = createContext()

function leagueReducer(state, action) {
  console.log(action);
  switch (action.type) {
    case 'update': {
      setLeagueStorage(state, action);
      return {
        ...state,
        [action.key]: action.value
      }
    }
    case 'clear': {
      clearLeagueStorage();
      return {};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

/**
 * Stores context state in localstorage so that important lookup keys can be persisted through refreshes
 * @function setLeagueStorage
 * @param {Object} state - leagueContext's current state object
 * @param {Object} action - contains data for the next state update
 */
function setLeagueStorage(state, action) {
  let contextState = {
    ...state,
    [action.key]: action.value
  };

  calcuttaStore('set', 'leagueContext', contextState);
}

/**
 * Retrieves league context data from localstorage to initialize certain component state after a refresh
 * @function getLeagueStorage
 */
function getLeagueStorage() {
  let contextState = calcuttaStore('get', 'leagueContext');

  return contextState === null ? {} : contextState;
}

function clearLeagueStorage() {
  calcuttaStore('clear', 'leagueContext');
}

function LeagueProvider({children}) {
  console.log(getLeagueStorage());

  // initialize state from localstorage
  const [state, dispatch] = useReducer(leagueReducer, getLeagueStorage());

  return (
    <LeagueStateContext.Provider value={state}>
      <LeagueDispatchContext.Provider value={dispatch}>
        {children}
      </LeagueDispatchContext.Provider>
    </LeagueStateContext.Provider>
  );
}

function useLeagueState() {
  const context = useContext(LeagueStateContext);
  if (context === undefined) {
    throw new Error('useLeagueState must be used within a LeagueProvider');
  }
  return context;
}

function useLeagueDispatch() {
  const context = useContext(LeagueDispatchContext);
  if (context === undefined) {
    throw new Error('useLeagueDispatch must be used within a LeagueProvider');
  }
  return context;
}

export { LeagueProvider, useLeagueState, useLeagueDispatch }