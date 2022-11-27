import React, { createContext, useReducer, useContext } from 'react';
import ContextSkeleton from './skeleton';

const bracketContext = new ContextSkeleton('bracketContext', false);

const StateContext = createContext();
const DispatchContext = createContext();

function BracketProvider({ children, initialState }) {
  const [state, dispatch] = useReducer(bracketContext.contextReducer, initialState || {});

  return(
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useBracketState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useBracketState must be used within a BracketProvider');
  }
  return context;
}

function useBracketDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useBracketDispatch must be used within a BracketProvider');
  }
  return context;
}

export { BracketProvider, useBracketState, useBracketDispatch };