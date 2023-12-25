import React, { useState } from 'react';

import { Form, Input, Button, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
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

function PasswordReset(props) {
  
  const [form] = Form.useForm();

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (values) => {
    props.toggleLoading();

    let oldPassword = values.oldPassword;
    let newPassword = values.newPassword;

    try {
      await props.resetPassword(oldPassword, newPassword);
      props.dismiss();
    } catch (error) {
      console.log(error);

      if (error.code === 'NotAuthorizedException') {
        setErrorMessage('Invalid credentials');
      }

      props.toggleLoading(false);
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
      className='password-reset'
      style={{ maxWidth: '300px' }}
    >
      {generateErrorMessage()}
      <Form.Item
        name='oldPassword'
        label='Old Password'
        style={formItemStyle}
        rules={[
          {
            required: true,
            message: 'Old password required!'
          }
        ]}
      >
        <Input type='password' />
      </Form.Item>
      <Form.Item
        name='newPassword'
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
      </Form.Item>
      <Form.Item
        name='confirmNewPassword'
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
      <Form.Item style={formItemStyle}>
        <Button
          type='primary'
          loading={props.loading}
          htmlType='submit'
          className='password-reset-form-button'
          style={{width: '100%'}}
        >
          Reset Password
        </Button>
      </Form.Item>
    </Form>
  );
}

export default withAuth(PasswordReset);