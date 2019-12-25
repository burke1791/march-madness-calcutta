import React, { useEffect, useState } from 'react';
import './messageThread.css';

import { navigate } from '@reach/router';

import { Layout, Row, Button, Comment, List, Form, Input, Avatar, Icon } from 'antd';
import 'antd/dist/antd.css';
import DataService, { Data } from '../../utilities/data';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';

const { Header, Content } = Layout;
const { TextArea } = Input;

function MessageThread(props) {
  
  const [messages, setMessages] = useState([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.MESSAGE_THREAD_DOWNLOADED, MessageThread, messagesDownloaded);
    Pubsub.subscribe(NOTIF.NEW_MESSAGE_POSTED, MessageThread, newMessagePosted);

    DataService.downloadMessageThread(props.topicId);

    return (() => {
      Pubsub.unsubscribe(NOTIF.MESSAGE_THREAD_DOWNLOADED, MessageThread);
      Pubsub.unsubscribe(NOTIF.NEW_MESSAGE_POSTED, MessageThread);
    });
  }, []);

  const messagesDownloaded = () => {
    setMessages(Data.messageThread);
  }

  const newMessagePosted = () => {
    setSubmitting(false);
    setNewMessageContent('');
    DataService.downloadMessageThread(props.topicId);
  }

  const backBtnClicked = () => {
    navigate(`/leagues/${props.leagueId}/message_board`);
  }

  const userClicked = (userId) => {
    // navigate to the user's profile page
    console.log('user: ' + userId);
  }

  const handleNewMessageChange = (event) => {
    setNewMessageContent(event.target.value);
  }

  const submitNewMessage = () => {
    // perform validation then send to server
    if (!!newMessageContent) {
      setSubmitting(true);
      DataService.postNewMessage(props.leagueId, props.topicId, newMessageContent)
    }
  }
  
  return (
    <div>
      <Layout>
        <Header style={{ background: 'none', width: '60%', margin: 'auto', padding: '0' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <Button type='primary' onClick={backBtnClicked}>
                <Icon type='left' />
                Message Board
              </Button>
            </div>
            <h1 style={{ fontSize: '32px' }}>{props.location.state.topicTitle}</h1>
            <div style={{ flex: 1 }}></div>
          </div>
        </Header>
        <Content>
          <Row type='flex' justify='center'>
            <List
              className="chat-window"
              itemLayout="horizontal"
              dataSource={messages}
              style={{ width: '60%' }}
              renderItem={item => (
                <li>
                  <Comment
                    //actions={item.actions}
                    author={<Button type='link' style={{ padding: '0' }} size='small' onClick={() => userClicked(item.authorId)}>{item.author}</Button>}
                    avatar={
                      <Avatar icon='user' />
                    }
                    content={
                      <p>
                        {item.content}
                      </p>
                    }
                    datetime={
                      <span>{item.created}</span>
                    }
                  />
                </li>
              )}
            />
          </Row>
          <Row type='flex' justify='center'>
            <div style={{ width: '60%' }}>
              <Form.Item>
                <TextArea rows={4} onChange={handleNewMessageChange} value={newMessageContent} />
              </Form.Item>
              <Form.Item>
                <Button htmlType="submit" loading={submitting} onClick={submitNewMessage} type="primary">
                  Send Message
                </Button>
              </Form.Item>
            </div>
          </Row>
        </Content>
      </Layout>
    </div>
  );
}

export default MessageThread;