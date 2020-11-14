import React, { createContext, useReducer, useContext } from 'react';
import { calcuttaStore } from '../utilities/helper';

/**
 * Extensible skeleton function for use by multiple different contexts
 */
function ContextSkeleton({ name, storageEnabled }) {

  const StateContext = createContext();
  const DispatchContext = createContext();

  const contextName = name;
  const localstorageEnabled = !!storageEnabled;

  function contextReducer(state, action) {
    switch (action.type) {
      case 'update': {
        if (localstorageEnabled) {
          setContextStorage(state, action);
        }

        return {
          ...state,
          [action.key]: action.value
        };
      }
      case 'clear': {
        if (localstorageEnabled) {
          clearContextStorage();
        }

        return {};
      }
      default: {
        throw new Error(`Unhandled action type: ${action.type} in context: ${contextName}`);
      }
    }
  }

  function setContextStorage(state, action) {
    let contextState = {
      ...state,
      [action.key]: action.value
    };

    calcuttaStore('set', contextName, contextState);
  }

  function getContextStorage() {
    let contextState = calcuttaStore('get', contextName);

    return contextState === null ? {} : contextState;
  }

  function clearContextStorage() {
    calcuttaStore('clear', contextName);
  }

  function ContextProvider({ children }) {
    const [state, dispatch] = useReducer(contextReducer, {});
    
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    );
  }
  
  function useContextState() {
    const context = useContext(StateContext);
    if (context === undefined) {
      throw new Error(`useContextState must be used within a Provider. Context name: ${contextName}`);
    }
    return context;
  }
  
  function useContextDispatch() {
    const context = useContext(DispatchContext);
    if (context === undefined) {
      throw new Error(`useContextDispatch must be used within a Provider. ${contextName}`);
    }
    return context;
  }

  return {
    ContextProvider,
    useContextState,
    useContextDispatch
  };
}

export default ContextSkeleton;