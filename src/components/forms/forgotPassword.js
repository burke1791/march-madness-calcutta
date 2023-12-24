import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import withAuthForm from '../../HOC/withAuthForm';
import { initiateForgotPassword } from '../../utilities/authService';

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

  const [instructionText, setInstructionText] = useState('');
  const [submitText, setSubmitText] = useState('Send Password Reset Code');

  useEffect(() => {
    console.log(props.formType);

    if (props.formType === 'forgotPassword-code') {
      setInstructionText('Check your email for a password reset code');
      setSubmitText('Reset Password');
    } else {
      setInstructionText('');
      setSubmitText('Send Password Reset Code');
    }
  }, [props.formType]);

  const generateInstructionText = () => {
    if (props.formType === 'forgotPassword-code') {
      return (
        <div>
          <span>{instructionText}</span>
          <hr></hr>
        </div>
      );
    }
  }

  const generateFormItems = () => {
    if (props.formType === 'forgotPassword-code') {
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
  
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

export default withAuthForm(ForgotPassword, initiateForgotPassword);