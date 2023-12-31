import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Amplify } from 'aws-amplify';
import amplifyConfig from './utilities/amplifyConfig';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: amplifyConfig.cognito.USER_POOL_ID,
      userPoolClientId: amplifyConfig.cognito.APP_CLIENT_ID,
      signUpVerificationMethod: 'link'
    }
  }
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
