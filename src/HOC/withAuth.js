import React from 'react';
import { useAuthState } from '../context/authContext';

function withAuth(WrappedComponent) {
  
  return function(props) {

    const { authenticated, userId } = useAuthState();

    return (
      <WrappedComponent {...props} authenticated={authenticated} userId={userId} />
    );
  }
}

export default withAuth;