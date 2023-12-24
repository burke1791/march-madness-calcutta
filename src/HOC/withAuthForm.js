import React, { useState } from 'react'

import { Form } from 'antd';

const layout = {
  labelCol: {
    span: 24
  }
};

function withAuthForm(FormItems, submitFunction) {
  
  return function(props) {

    const [form] = Form.useForm();

    const [errorMessage, setErrorMessage] = useState('');
    const [formType, setFormType] = useState('');

    const handleSubmit = (values) => {
      console.log(values);
      setErrorMessage('');
      props.toggleLoading();
  
      submitFunction(values).then(data => {
        console.log(data);
        props.toggleLoading(false);

        if (data.newFormType !== undefined) {
          setFormType(data.newFormType);
        }

        if (data.dismiss) {
          props.dismiss();
        }
      }).catch(error => {
        console.log(error);
  
        if (error.code === 'NotAuthorizedException') {
          setErrorMessage('Invalid credentials');
        } else {
          setErrorMessage(error.message);
        }
  
        props.toggleLoading(false);
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
      <Form
        form={form}
        {...layout}
        onFinish={handleSubmit} 
        className='signup-form'
        style={{ maxWidth: '300px' }}
      >
        {generateErrorMessage()}
        <FormItems {...props} formType={formType !== '' ? formType : props.formType} />
      </Form>
    )
  }
}

export default withAuthForm;