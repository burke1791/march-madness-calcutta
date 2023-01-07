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

/**
 * @typedef AuctionState
 * @property {Boolean} [connected]
 * @property {Number} [newItemTimestamp] - updated every time a new Item is put up for auction
 * @property {String} [errorMessage] - global error message for the auction
 * @property {Number} auctionInterval - number of seconds to wait for a bid
 * @property {('initial'|'bidding'|'sold'|'confirmed-sold'|'end')} status
 * @property {String} displayName - current auction item's display name
 * @property {Number} currentItemId
 * @property {(1|2|3)} itemTypeId - 1: team | 2: group | 3: slot
 * @property {Number} price
 * @property {Number} winnerId - userId of the current item's high bidder
 * @property {String} winnerAlias - alias of the current item's high bidder
 * @property {Number} lastBid
 * @property {Number} prevUpdate
 * @property {String} teamLogoUrl
 * @property {Boolean} connected
 * @property {Boolean} auctionClosed
 */

/**
 * @function
 * @returns {AuctionState}
 */
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