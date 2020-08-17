import React, { createContext, useReducer, useContext } from 'react'

const AuctionStateContext = createContext()
const AuctionDispatchContext = createContext()

function auctionReducer(state, action) {
  switch (action.type) {
    case 'update': {
      setAuctionStorage(state, action);
      return {
        ...state,
        [action.key]: action.value
      }
    }
    case 'clear': {
      clearAuctionStorage();
      return {};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

/**
 * Stores context state in localstorage so that important lookup keys can be persisted through refreshes
 * @function setAuctionStorage
 * @param {Object} state - auctionContext's current state object
 * @param {Object} action - contains data for the next state update
 */
// function setAuctionStorage(state, action) {
//   let contextState = {
//     ...state,
//     [action.key]: action.value
//   };

//   calcuttaStore('set', 'auctionContext', contextState);
// }

/**
 * Retrieves auction context data from localstorage to initialize certain component state after a refresh
 * @function getAuctionStorage
 */
// function getAuctionStorage() {
//   let contextState = calcuttaStore('get', 'auctionContext');

//   return contextState === null ? {} : contextState;
// }

// function clearAuctionStorage() {
//   calcuttaStore('clear', 'auctionContext');
// }

function AuctionProvider({children}) {
  // initialize state from localstorage
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