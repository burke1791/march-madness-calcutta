import React, { useState, useEffect } from 'react';

import { Form, Input, Button, Checkbox } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { AUTH_FORM_TYPE, ERROR_MESSAGES, NOTIF } from '../../utilities/constants';
import { signIn } from '../../utilities/authService';
import Pubsub from '../../utilities/pubsub';

const lineHeightStyle = {
  lineHeight: '40px'
};

function SigninForm(props) {

  const [form] = Form.useForm();

  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    Pubsub.subscribe(NOTIF.AUTH_ERROR, SigninForm, handleAuthError);

    return (() => {
      Pubsub.unsubscribe(NOTIF.AUTH_ERROR, SigninForm);
    });
  }, []);

  const onRememberChange = (event) => {
    setRememberMe(event.target.checked);
  }

  const handleAuthError = (errorMsg) => {
    props.toggleLoading(false);
    setErrorMessage(errorMsg);
  }

  const handleSubmit = (values) => {
    props.toggleLoading();
    
    let email = values.email;
    let password = values.password;
    
    signIn(email, password);
  }

  const generateErrorMessage = () => {
    if (errorMessage) {
      return (
        <span className="ant-form-text" style={{ color: '#cf1322' }}>{errorMessage}</span>
      );
    } else {
      return null;
    }
  }

  return (
    <Form 
      form={form}
      onFinish={handleSubmit}
      className='login-form'
      style={{maxWidth: '300px'}}
    >
      {generateErrorMessage()}
      <Form.Item
        name='email'
        rules={[
          {
            required: true, 
            message: 'Please input your email!'
          }
        ]}
      >
        <Input 
          prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
          placeholder='email' 
        />
      </Form.Item>
      <Form.Item
        name='password'
        rules={[
          { required: true, message: 'Please input your password!'}
        ]}
      >
        <Input 
          prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />} 
          type='password'
          placeholder='password' 
        />
      </Form.Item>
      <Form.Item>
        <Checkbox checked={rememberMe} onChange={onRememberChange} style={lineHeightStyle}>
          Remember me
        </Checkbox>
        <Button
          type='link'
          onClick={() => props.toggleAuthForm(AUTH_FORM_TYPE.FORGOT_PASSWORD)}
          style={{float: 'right'}}
        >
          Forgot password
        </Button>
        <Button 
          type='primary'
          loading={props.loading}
          htmlType='submit'
          className='login-form-button'
          style={{width: '100%'}}
          data-testid='signin-submit'
        >
          Sign In
        </Button>
        <Button 
          type='link'
          onClick={() => props.toggleAuthForm(AUTH_FORM_TYPE.SIGN_UP)} style={{padding: '0'}}
        >
          Create an Account
        </Button>
      </Form.Item>
    </Form>
  );
}

export default SigninForm;