import React, { createContext, useReducer, useContext } from 'react'
import { calcuttaStore } from '../utilities/helper';

const AuthStateContext = createContext()
const AuthDispatchContext = createContext()

function authReducer(state, action) {
  console.log(action);
  switch (action.type) {
    case 'update': {
      setAuthStorage(state, action);
      return {
        ...state,
        [action.key]: action.value
      }
    }
    case 'clear': {
      clearAuthStorage();
      return {};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

/**
 * Stores context state in localstorage so that important lookup keys can be persisted through refreshes
 * @function setAuthStorage
 * @param {Object} state - authContext's current state object
 * @param {Object} action - contains data for the next state update
 */
function setAuthStorage(state, action) {
  // only store the userId in localstorage, AWS amplify stores the jwtToken separately
  if (action.key === 'userId') {
    let contextState = {
      [action.key]: action.value
    };
  
    calcuttaStore('set', 'authContext', contextState);
  }
}

/**
 * Retrieves auth context data from localstorage to initialize certain component state after a refresh
 * @function getAuthStorage
 */
function getAuthStorage() {
  let contextState = calcuttaStore('get', 'authContext');

  return contextState === null ? {} : contextState;
}

function clearAuthStorage() {
  calcuttaStore('clear', 'authContext');
}

function AuthProvider({children}) {
  console.log(getAuthStorage());

  // initialize state from localstorage
  const [state, dispatch] = useReducer(authReducer, getAuthStorage());

  return (
    <AuthStateContext.Provider value={state}>
      <AuthDispatchContext.Provider value={dispatch}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

function useAuthState() {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be used within a AuthProvider');
  }
  return context;
}

function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthDispatch must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuthState, useAuthDispatch }