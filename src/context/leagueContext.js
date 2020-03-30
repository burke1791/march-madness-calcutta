import React, { createContext, useReducer, useContext } from 'react'

const LeagueStateContext = createContext()
const LeagueDispatchContext = createContext()

function leagueReducer(state, action) {
  console.log(action);
  switch (action.type) {
    case 'setTournamentId': {
      return { 
        ...state,
        tournamentId: action.tournamentId
      };
    }
    case 'setLeagueId': {
      return {
        ...state,
        leagueId: action.leagueId
      }
    }
    case 'clear': {
      return { 
        leagueId: null,
        tournamentId: null
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    } 
  }
}

function LeagueProvider({children}) {
  const [state, dispatch] = useReducer(leagueReducer, { tournamentId: null });
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