import React, { useState, useEffect } from 'react';

import { Modal, Button } from 'antd';

import { AUTH_FORM_TYPE, NOTIF } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import WrappedSigninForm from '../forms/signinForm';
import WrappedSignupForm from '../forms/signupForm';
import ConfirmAccount from './confirmAccount';
import PasswordReset from '../forms/passwordReset';
import WrappedForgotPassword from '../forms/forgotPassword';

function AuthModal() {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState(AUTH_FORM_TYPE.SIGN_IN);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.AUTH_MODAL_SHOW, AuthModal, showModal);
    Pubsub.subscribe(NOTIF.AUTH_MODAL_DISMISS, AuthModal, handleCancel);
    Pubsub.subscribe(NOTIF.SIGN_IN, AuthModal, handleCancel);
    Pubsub.subscribe(NOTIF.SIGN_UP_PLEASE_CONFIRM, AuthModal, handleConfirm);

    return (() => {
      Pubsub.unsubscribe(NOTIF.AUTH_MODAL_SHOW, AuthModal);
      Pubsub.unsubscribe(NOTIF.AUTH_MODAL_DISMISS, AuthModal);
      Pubsub.unsubscribe(NOTIF.SIGN_IN, AuthModal);
      Pubsub.unsubscribe(NOTIF.SIGN_UP_PLEASE_CONFIRM, AuthModal);
    });
  }, []);

  const showModal = (type) => {
    if (type) {
      setFormType(type);
    }
    setVisible(true);
  }

  const handleFormToggle = (type) => {
    setFormType(type);
  }

  const handleConfirm = () => {
    setLoading(false);
    setFormType(AUTH_FORM_TYPE.CONFIRM);
  }

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  }

  const toggleLoading = (state) => {
    if (state == undefined) {
      setLoading(!loading);
    } else {
      setLoading(state);
    }
  }

  const generateForm = () => {
    if (formType === AUTH_FORM_TYPE.SIGN_IN) {
      return (
        <WrappedSigninForm loading={loading} toggleLoading={toggleLoading} toggleAuthForm={handleFormToggle} />
      );
    } else if (formType === AUTH_FORM_TYPE.SIGN_UP) {
      return (
        <WrappedSignupForm loading={loading} toggleLoading={toggleLoading} toggleAuthForm={handleFormToggle} />
      );
    } else if (formType === AUTH_FORM_TYPE.CONFIRM) {
      return (
        <ConfirmAccount loading={loading} toggleLoading={toggleLoading} toggleAuthForm={handleFormToggle} />
      )
    } else if (formType === AUTH_FORM_TYPE.PASSWORD_RESET) {
      return (
        <PasswordReset loading={loading} toggleLoading={toggleLoading} dismiss={handleCancel} />
      )
    } else if (formType === AUTH_FORM_TYPE.FORGOT_PASSWORD) {
      return (
        <WrappedForgotPassword loading={loading} toggleLoading={toggleLoading} dismiss={handleCancel} formType='email' />
      )
    }
  }

  return (
    <Modal
      title={formType}
      open={visible}
      onCancel={handleCancel}
      style={{ maxWidth: '320px', top: '50px' }}
      footer={null}
    >
      {generateForm()}
    </Modal>
  );
}

export default AuthModal;