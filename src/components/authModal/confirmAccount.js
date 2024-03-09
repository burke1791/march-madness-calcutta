import React from 'react';

import { Button } from 'antd';
import { AUTH_FORM_TYPE } from '../../utilities/constants';
import withAuth from '../../HOC/withAuth';
import { useAuthState } from '../../context/authContext';

function ConfirmAccount(props) {

  const { email, password } = useAuthState();

  const attemptSignin = async () => {
    if (!email || !password) {
      props.toggleAuthForm(AUTH_FORM_TYPE.SIGN_IN);
    } else {
      props.toggleLoading(true);
      await props.signIn(email, password);
      props.dismiss();
    }
  }

  return (
    <div>
      <h3>Please check your email and confirm your account, then come back and sign in</h3>
      <Button type='primary' loading={props.loading} onClick={attemptSignin}>Sign In</Button>
    </div>
  )
}

export default withAuth(ConfirmAccount);