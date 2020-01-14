import React, { useState } from 'react';

import { Button } from 'antd';
import 'antd/dist/antd.css';

import { signIn, User } from '../../utilities/authService';
import { AUTH_FORM_TYPE } from '../../utilities/constants';

function ConfirmAccount(props) {

  const attemptSignin = () => {
    if (User.email == null || User.password == null) {
      props.toggleAuthForm(AUTH_FORM_TYPE.SIGN_IN);
    } else {
      props.toggleLoading();
      signIn(User.email, User.password);
    }
  }

  return (
    <div>
      <h3>Please check your email and confirm your account, then come back and sign in</h3>
      <Button type='primary' loading={props.loading} onClick={attemptSignin}>Sign In</Button>
    </div>
  )
}

export default ConfirmAccount;