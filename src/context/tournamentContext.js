import React, { createContext, useReducer, useContext } from 'react';
import ContextSkeleton from './skeleton';

const tournamentContext = new ContextSkeleton('tournamentContext', false);

const StateContext = createContext();
const DispatchContext = createContext();

function TournamentProvider({ children }) {
  const [state, dispatch] = useReducer(tournamentContext.contextReducer, {});

  return(
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useTournamentState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useTournamentState must be used within a TournamentProvider');
  }
  return context;
}

function useTournamentDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useTournamentDispatch must be used within a TournamentProvider');
  }
  return context;
}

export { TournamentProvider, useTournamentState, useTournamentDispatch };