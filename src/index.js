import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import Amplify from 'aws-amplify';
import amplifyConfig from './utilities/amplifyConfig';

Amplify.configure({
  Auth: {
    mandatorySignIn: true,
    region: amplifyConfig.cognito.REGION,
    userPoolId: amplifyConfig.cognito.USER_POOL_ID,
    identityPoolId: amplifyConfig.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: amplifyConfig.cognito.APP_CLIENT_ID
  }
});

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
