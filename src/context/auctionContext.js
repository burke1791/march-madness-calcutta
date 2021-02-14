import React, { createContext, useReducer, useContext } from 'react'

const AuctionStateContext = createContext()
const AuctionDispatchContext = createContext()

function auctionReducer(state, action) {
  switch (action.type) {
    case 'update': {
      return {
        ...state,
        [action.key]: action.value
      }
    }
    case 'clear': {
      return {};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AuctionProvider({children}) {
  const [state, dispatch] = useReducer(auctionReducer, {});

  return (
    <AuctionStateContext.Provider value={state}>
      <AuctionDispatchContext.Provider value={dispatch}>
        {children}
      </AuctionDispatchContext.Provider>
    </AuctionStateContext.Provider>
  );
}

function useAuctionState() {
  const context = useContext(AuctionStateContext);
  if (context === undefined) {
    throw new Error('useAuctionState must be used within a AuctionProvider');
  }
  return context;
}

function useAuctionDispatch() {
  const context = useContext(AuctionDispatchContext);
  if (context === undefined) {
    throw new Error('useAuctionDispatch must be used within a AuctionProvider');
  }
  return context;
}

export { AuctionProvider, useAuctionState, useAuctionDispatch }