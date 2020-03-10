import React, { useState, useEffect } from 'react';

import { Form, Icon, Input, Button, Checkbox } from 'antd';
import 'antd/dist/antd.css';
import { AUTH_FORM_TYPE, ERROR_MESSAGES, NOTIF } from '../../utilities/constants';
import { signIn } from '../../utilities/authService';
import Pubsub from '../../utilities/pubsub';

function SigninForm(props) {

  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    Pubsub.subscribe(NOTIF.AUTH_ERROR, SigninForm, handleAuthError);

    return (() => {
      Pubsub.unsubscribe(NOTIF.AUTH_ERROR, SigninForm);
    });
  }, []);

  const handleAuthError = (errorMsg) => {
    props.toggleLoading(false);
    setErrorMessage(errorMsg);
  }

  const { getFieldDecorator } = props.form;

  const handleSubmit = (event) => {
    event.preventDefault();

    props.form.validateFields((err, values) => {
      if (!err) {
        props.toggleLoading();
        
        let email = values.email;
        let password = values.password;
        let remember = values.remember;

        // @TODO refactor error handling
        signIn(email, password);

        // AuthService.sendSigninRequest({ email: email, password: password }).catch(errorCode => {
        //   setErrorMessage(ERROR_MESSAGES[errorCode]);
        //   props.toggleLoading(false);
        // })
      } else {
        alert('Validation Error');
      }
    });
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
    <Form onSubmit={handleSubmit} className='login-form' style={{maxWidth: '300px'}}>
      {generateErrorMessage()}
      <Form.Item>
        {getFieldDecorator('email', {
          rules: [
            { 
              required: true, 
              message: 'Please input your email!'
            }
          ],
        })(
          <Input 
            prefix={<Icon type='mail' style={{ color: 'rgba(0,0,0,.25)' }} />} 
            placeholder='email' 
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: 'Please input your password!'}],
        })(
          <Input 
            prefix={<Icon type='lock' style={{ color: 'rgba(0,0,0,.25)' }} />} 
            type='password'
            placeholder='password' 
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('remember', {
          valuePropName: 'checked',
          initialValue: true,
        })(<Checkbox>Remember me</Checkbox>)}
        <a href='#' className='login-form-forgot' style={{float: 'right'}}>Forgot password</a>
        <Button type='primary' loading={props.loading} htmlType='submit' className='login-form-button' style={{width: '100%'}} data-testid='signin-submit'>Sign In</Button>
        <Button type='link' onClick={() => props.toggleAuthForm(AUTH_FORM_TYPE.SIGN_UP)} style={{padding: '0'}}>Create an Account</Button>
      </Form.Item>
    </Form>
  );
}

const WrappedSigninForm = Form.create({ name: 'signin_form' })(SigninForm);

export default WrappedSigninForm;