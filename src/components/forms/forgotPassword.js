import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

import withAuth from '../../HOC/withAuth';
import { useAuthState } from '../../context/authContext';
import Pubsub from '../../utilities/pubsub';
import { AUTH_FORM_TYPE, NOTIF } from '../../utilities/constants';

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

function ForgotPassword(props) {

  const [form] = Form.useForm();

  const [formType, setFormType] = useState('email');
  const [instructionText, setInstructionText] = useState('');
  const [submitText, setSubmitText] = useState('Send Password Reset Code');

  const { errorMessage } = useAuthState();

  // useEffect(() => {
  //   console.log(props.formType);

  //   if (props.formType === 'forgotPassword-code') {
  //     setInstructionText('Check your email for a password reset code');
  //     setSubmitText('Reset Password');
  //   } else {
  //     setInstructionText('');
  //     setSubmitText('Send Password Reset Code');
  //   }
  // }, [props.formType]);

  useEffect(() => {
    if (formType === 'forgotPassword-code') {
      setInstructionText('Check your email for a password reset code');
      setSubmitText('Reset Password');
    } else {
      setInstructionText('');
      setSubmitText('Send Password Reset Code');
    }
  }, [formType]);

  const generateErrorMessage = () => {
    if (errorMessage) {
      return (
        <span className='ant-form-text' style={{ color: '#cf1322' }}>{errorMessage}</span>
      );
    } else {
      return null;
    }
  }

  const generateInstructionText = () => {
    if (formType === 'forgotPassword-code') {
      return (
        <div>
          <span>{instructionText}</span>
          <hr></hr>
        </div>
      );
    }
  }

  const generateFormItems = () => {
    if (formType === 'forgotPassword-code') {
      return ([
        <Form.Item 
          name='code'
          key='pw-reset-code'
          label='Password Reset Code'
          style={formItemStyle}
          rules={[
            {
              required: true,
              message: 'Please input your password reset code'
            }
          ]}
        >
          <Input />
        </Form.Item>,
        <Form.Item
          name='newPassword'
          key='pw-reset-newpw'
          label={
            <span>
              New Password &nbsp;
              <Tooltip title='Password must be at least 8 characters long and include at least one uppercase, lowercase, number, and symbol'>
                <QuestionCircleOutlined />
              </Tooltip>
            </span>
          }
          dependencies={['confirmNewPassword']}
          style={formItemStyle}
          rules={[
            {
              required: true,
              message: 'Please input new password!'
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/g,
              message: 'Password not strong enough'
            }
          ]}
          hasFeedback
        >
          <Input type='password' />
        </Form.Item>,
        <Form.Item
          name='confirmNewPassword'
          key='pw-reset-newpw-confirm'
          label='Confirm New Password'
          dependencies={['newPassword']}
          style={formItemStyle}
          rules={[
            {
              required: true,
              message: 'Please confirm new password!'
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }

                return Promise.reject('Passwords do not match');
              }
            })
          ]}
          hasFeedback
        >
          <Input type='password' />
        </Form.Item>
      ]);
    }
  }

  const handleSubmit = async (values) => {
    console.log(values);
    props.toggleLoading();

    if (formType === 'forgotPassword-code') {
      const data = await props.submitForgotPassword(values.email, values.code, values.newPassword);
      console.log(data);
      Pubsub.publish(NOTIF.AUTH_MODAL_SHOW, AUTH_FORM_TYPE.SIGN_IN);
    } else {
      const data = await props.initiateForgotPassword(values.email);
      console.log(data);
      setFormType(data.newFormType);
    }
    
    props.toggleLoading(false);
  }
  
  return (
    <Form
      form={form}
      {...layout}
      onFinish={handleSubmit}
      className='forgot-password'
      style={{ maxWidth: '300px' }}
    >
      {generateErrorMessage()}
      {generateInstructionText()}
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
      {generateFormItems()}
      <Form.Item style={formItemStyle}>
        <Button
          type='primary'
          loading={props.loading}
          htmlType='submit'
          style={{width: '100%'}}
        >
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
}

export default withAuth(ForgotPassword);