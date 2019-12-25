import React, { useState, useEffect } from 'react';
import './auctionChat.css';

import { formatTimestamp } from '../../utilities/helper';

import { Row, Col, List, Card, Input, Button } from 'antd'
import 'antd/dist/antd.css';
import { User } from '../../firebase/authService';
import DataService, { Data } from '../../utilities/data';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';

const { Search } = Input;

function AuctionChat(props) {
  
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    DataService.startChatListener(props.auctionId);

    Pubsub.subscribe(NOTIF.NEW_CHAT_MESSAGE, AuctionChat, newMessage);

    return (() => {
      DataService.killChatListener();

      Pubsub.unsubscribe(NOTIF.NEW_CHAT_MESSAGE, AuctionChat);
    });
  }, []);

  const newMessage = () => {
    setMessages(Data.chatMessages);
  }

  const sendMessage = (value) => {
    let params = {
      author: User.alias,
      content: value,
      user_id: User.user_id,
      uid: User.uid || 'unknown',
      auctionId: props.auctionId
    };

    DataService.sendChatMessage(params);
    setChatMessage('');
  }
  
  return (
    <Row style={{ height: 'auto', maxHeight: 'calc(50vh - 70px)', marginTop: '12px' }} className='flex-growVert-child flex-growVert-parent'>
      <Card size='small' className='flex-growVert-child' bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Row>
          <List
            dataSource={messages}
            style={{ overflow: 'auto' }}
            renderItem={message => (
              <div className='chat-message'>
                <span className='author'>{message.author}</span>
                <span className='timestamp'>{formatTimestamp(message.timestamp)}</span>
                <span className='content'>{message.content}</span>
              </div>
            )}
          />
        </Row>
        <Row style={{ marginTop: '6px' }}>
          <Search
            placeholder='Trash talk is encouraged..'
            enterButton='Send'
            size='default'
            value={chatMessage}
            onChange={event => setChatMessage(event.target.value)}
            onSearch={sendMessage}
          />
        </Row>
      </Card>
    </Row>
  );
}

export default AuctionChat;