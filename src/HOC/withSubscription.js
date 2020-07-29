import React, { useState, useEffect } from 'react';
import { User } from '../utilities/authService';
import Pubsub from '../utilities/pubsub';
import { NOTIF } from '../utilities/constants';

function withSubscription(WrappedComponent, config) {
  
  return function(props) {
    const [authenticated, setAuthenticated] = useState(!!User.session);

    useEffect(() => {
      Pubsub.subscribe(NOTIF.AUTH, withSubscription, handleAuthChange);
  
      return (() => {
        Pubsub.unsubscribe(NOTIF.AUTH, withSubscription);
      });
    }, []);

    const handleAuthChange = (authenticated) => {
      setAuthenticated(authenticated);
    }

    return (
      <WrappedComponent {...props} authenticated={authenticated} />
    );
  }
}

export default withSubscription;