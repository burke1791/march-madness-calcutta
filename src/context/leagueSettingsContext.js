import ContextSkeleton from './skeleton';

const settingsContext = new ContextSkeleton('settingsContext', false);


function SettingsProvider(children) {
  return settingsContext.ContextProvider(children);
}

function useSettingsState() {
  return settingsContext.useContextState;
}

function useSettingsDispatch() {
  return settingsContext.useContextDispatch;
}

export { SettingsProvider, useSettingsState, useSettingsDispatch };