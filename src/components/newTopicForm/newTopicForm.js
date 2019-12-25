import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import DataService from '../../utilities/data';

const { TextArea } = Input;

function NewTopicForm(props) {
  const [errorMessage, setErrorMessage] = useState('');

  const { getFieldDecorator } = props.form;

  const handleSubmit = (event) => {
    event.preventDefault();

    props.form.validateFields((err, values) => {
      if (!err) {
        props.toggleLoading();

        let title = values.topicTitle;
        let content = values.topicContent;

        console.log('title: ' + title);
        console.log('content: ' + content);

        // make a post request
        DataService.postNewMessageBoardTopic(props.leagueId, title, content).then(response => {
          console.log('should populate the message board table with the new thread - just query for all topics again');
          props.handleCancel();
        }).catch(error => {
          // @TODO refactor to proper error handling
          setErrorMessage('Server Error, please try again later');
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
        <span className='ant-form-text' style={{ color: 'cf1322' }}>{errorMessage}</span>
      );
    } else {
      return null;
    }
  }

  return (
    <Form onSubmit={handleSubmit} className='new-topic-form' style={{ maxWidth: '480px' }}>
      <Form.Item>
        {getFieldDecorator('topicTitle', {
          rules: [
            {
              required: true,
              message: 'Please enter a title!'
            }
          ]
        })(
          <Input
            type='text'
            placeholder='Title'
          />
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('topicContent', {
          rules: [
            {
              required: true,
              message: 'Don\'t be shy, speak your mind!'
            }
          ]
        })(
          <TextArea rows={8} />
        )}
      </Form.Item>
      <Form.Item>
        <Button type='primary' loading={props.loading} htmlType='submit'>Submit</Button>
        <Button type='link' onClick={() => {props.handleCancel()}} style={{ color: '#8e8e8e' }}>Cancel</Button>
      </Form.Item>
    </Form>
  );
}

const WrappedNewTopicForm = Form.create({ name: 'new_topic_form' })(NewTopicForm);

export default WrappedNewTopicForm;