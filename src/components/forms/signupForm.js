import React, { useState, useEffect } from 'react';

import { AUTH_FORM_TYPE, NOTIF } from '../../utilities/constants';

import { Form, Input, Button, Checkbox, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import Pubsub from '../../utilities/pubsub';
import withAuth from '../../HOC/withAuth';

const formItemStyle = {
  marginBottom: '6px'
};

const lineHeightStyle = {
  lineHeight: '40px'
};

const layout = {
  labelCol: {
    span: 24
  }
};

function SignupForm(props) {

  const [form] = Form.useForm();

  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    Pubsub.subscribe(NOTIF.AUTH_ERROR, SignupForm, handleAuthError);

    return (() => {
      Pubsub.unsubscribe(NOTIF.AUTH_ERROR, SignupForm);
    });
  }, []);

  const onRememberChange = (event) => {
    setRememberMe(event.target.checked);
  }

  const handleAuthError = (errorMsg) => {
    props.toggleLoading(false);
    setErrorMessage(errorMsg);
  }

  const handleSubmit = async (values) => {
    props.toggleLoading();
    
    try {
      const email = values.email;
      const username = values.username;
      const password = values.password;

      await props.signUp(username, email, password);
    } catch (error) {
      console.log(error);
      props.toggleLoading();
    }
  }

  const generateErrorMessage = () => {
    if (errorMessage) {
      return (
        <span className='ant-form-text' style={{ color: '#cf1322' }}>{errorMessage}</span>
      );
    } else {
      return null;
    }
  }

  return (
    <Form
      form={form}
      {...layout}
      onFinish={handleSubmit} 
      className='signup-form'
      style={{ maxWidth: '300px' }}
    >
      {generateErrorMessage()}
      <Form.Item 
        name='email'
        label='Email Address'
        style={formItemStyle}
        rules={[
          {
            type: 'email',
            message: 'The input is not a valid email'
          },
          {
            required: true,
            message: 'Please input your email address'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item 
        name='password'
        label={
          <span>
            Password &nbsp;
            <Tooltip title='Password must be at least 8 characters long and include at least one uppercase, lowercase, number, and symbol'>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        dependencies={['confirm']}
        style={formItemStyle} 
        rules={[
          {
            required: true,
            message: 'Please input your password!'
          },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/g,
            message: 'Password not strong enough'
          }
        ]}
        hasFeedback
      >
        <Input type='password' />
      </Form.Item>
      <Form.Item 
        name='confirm'
        label='Confirm Password'
        dependencies={['password']}
        style={formItemStyle}
        hasFeedback
        rules={[
          {
            required: true,
            message: 'Please confirm your password!'
          },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }

              return Promise.reject('Passwords do not match');
            }
          })
        ]}
      >
        <Input type='password' />
      </Form.Item>
      <Form.Item
        name='username'
        label={
          <span>
            Username&nbsp;
            <Tooltip title='What do you want your display name to be?'>
              <QuestionCircleOutlined />
            </Tooltip>
          </span>
        }
        style={formItemStyle}
        rules={[
          { required: true, message: 'Please input your username!', whitespace: true }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item style={formItemStyle}>
        <Checkbox checked={rememberMe} onChange={onRememberChange} style={lineHeightStyle}>
          Remember me
        </Checkbox>
        <Button
          type='primary'
          loading={props.loading}
          htmlType='submit'
          className='signup-form-button'
          style={{width: '100%'}}
        >
          Create Account
        </Button>
        <Button 
          type='link'
          onClick={() => props.toggleAuthForm(AUTH_FORM_TYPE.SIGN_IN)} style={{padding: '0'}}
        >
          Already have an account? Sign in here.
        </Button>
      </Form.Item>
    </Form>
  );
}

export default withAuth(SignupForm);

