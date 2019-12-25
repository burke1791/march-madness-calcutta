import React, { useState } from 'react';

import { AUTH_FORM_TYPE, ERROR_MESSAGES } from '../../utilities/constants';

import { Form, Icon, Input, Button, Checkbox, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import AuthService from '../../firebase/authService';

const formItemStyle = {
  marginBottom: '6px'
};

function SignupForm(props) {

  const [errorMessage, setErrorMessage] = useState('');

  const { getFieldDecorator } = props.form;

  const compareToFirstPassword = (rule, value, callback) => {
    const { form } = props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Passwords do not match!');
    } else {
      callback();
    }
  }

  const validateToNextPassword = (rule, value, callback) => {
    const { form } = props;
    if (value) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    props.form.validateFields((err, values) => {
      console.log(values);
      if (!err) {
        props.toggleLoading();
        
        let email = values.email;
        let username = values.username;
        let password = values.password;
        let remember = values.remember;

        AuthService.sendSignupRequest({ email: email, password: password, username: username }).catch(errorCode => {
          setErrorMessage(ERROR_MESSAGES[errorCode]);
          props.toggleLoading(false);
        });
      } else {
        alert('Validation Error');
      }
    });
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
    <Form onSubmit={handleSubmit} className='signup-form' style={{ maxWidth: '300px' }}>
      {generateErrorMessage()}
      <Form.Item label='Email Address' style={formItemStyle}>
        {getFieldDecorator('email', {
          rules: [
            {
              type: 'email',
              message: 'The input is not a valid email'
            },
            {
              required: true,
              message: 'Please input your email address'
            }
          ]
        })(<Input />)}
      </Form.Item>
      <Form.Item label='Password' style={formItemStyle} hasFeedback>
        {getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: 'Please input your password!'
            },
            {
              validator: validateToNextPassword
            }
          ]
        })(<Input type='password' />)}
      </Form.Item>
      <Form.Item label='Confirm Password' style={formItemStyle} hasFeedback>
        {getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: 'Please confirm your password!'
            },
            {
              validator: compareToFirstPassword
            }
          ]
        })(<Input type='password' />)}
      </Form.Item>
      <Form.Item
        label={
          <span>
            Username&nbsp;
            <Tooltip title='What do you want your display name to be?'>
              <Icon type='question-circle-o' />
            </Tooltip>
          </span>
        }
        style={formItemStyle}
      >
        {getFieldDecorator('username', {
          rules: [{ required: true, message: 'Please input your username!', whitespace: true }],
        })(<Input />)}
      </Form.Item>
      <Form.Item style={formItemStyle}>
        {getFieldDecorator('remember', {
          valuePropName: 'checked',
          initialValue: true,
        })(<Checkbox>Remember me</Checkbox>)}
        <Button type='primary' loading={props.loading} htmlType='submit' className='signup-form-button' style={{width: '100%'}}>Create Account</Button>
        <Button type='link' onClick={() => props.toggleAuthForm(AUTH_FORM_TYPE.SIGN_IN)} style={{padding: '0'}}>Already have an account? Sign in here.</Button>
      </Form.Item>
    </Form>
  );
}

const WrappedSignupForm = Form.create({ name: 'signup_form' })(SignupForm);

export default WrappedSignupForm;

