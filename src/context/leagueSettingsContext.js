import React, { createContext, useReducer, useContext } from 'react';
import ContextSkeleton from './skeleton';

const settingsContext = new ContextSkeleton('settingsContext', false);

const StateContext = createContext();
const DispatchContext = createContext();

function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(settingsContext.contextReducer, {});

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

function useSettingsState() {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(`useSettingsState must be used within a SettingsProvider`);
  }
  return context;
}

function useSettingsDispatch() {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error(`useSettingsDispatch must be used within a SettingsProvider`);
  }
  return context;
}

export { SettingsProvider, useSettingsState, useSettingsDispatch };