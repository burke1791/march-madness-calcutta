// import React, { createContext, useReducer, useContext } from 'react';
import { calcuttaStore } from '../utilities/helper';

/**
 * Extensible skeleton function for use by multiple different contexts
 */
function ContextSkeleton({ name, storageEnabled }) {

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

  return {
    contextReducer
  };
}

export default ContextSkeleton;