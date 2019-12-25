import React, { useState, useEffect } from 'react';

import { Modal, Button } from 'antd';
import 'antd/dist/antd.css';

import { AUTH_FORM_TYPE, NOTIF } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import WrappedSigninForm from '../signinForm/signinForm';
import WrappedSignupForm from '../signupForm/signupForm';

function AuthModal() {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState(AUTH_FORM_TYPE.SIGN_IN);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.AUTH_MODAL_SHOW, AuthModal, showModal);
    Pubsub.subscribe(NOTIF.SIGN_IN, AuthModal, handleCancel);

    return (() => {
      Pubsub.unsubscribe(NOTIF.AUTH_MODAL_SHOW, AuthModal);
      Pubsub.unsubscribe(NOTIF.SIGN_IN, AuthModal);
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

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  }

  const toggleLoading = (state) => {
    if (state == undefined) {
      console.log('toggle loading natural');
      setLoading(!loading);
    } else {
      console.log('toggle loading literal');
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
    }
  }

  return (
    <Modal
      title={formType}
      visible={visible}
      onCancel={handleCancel}
      style={{ maxWidth: '320px', top: '50px' }}
      footer={null}
    >
      {generateForm()}
    </Modal>
  );
}

export default AuthModal;