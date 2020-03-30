import React, { useState, useEffect } from 'react';
import './auctionChat.css';

import { formatTimestamp } from '../../utilities/helper';

import { Row, Col, List, Card, Input, Button } from 'antd'
import 'antd/dist/antd.css';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import { sendSocketMessage, fetchChatMessages, clearChatMessages, chatMessages } from '../../utilities/auctionService';
import { useLeagueState } from '../../context/leagueContext';

const { Search } = Input;

function AuctionChat() {
  
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const { leagueId } = useLeagueState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.NEW_CHAT_MESSAGE, AuctionChat, newMessage);

    return (() => {
      Pubsub.unsubscribe(NOTIF.NEW_CHAT_MESSAGE, AuctionChat);
    });
  }, []);

  useEffect(() => {
    fetchChatMessages(leagueId);

    return (() => {
      clearChatMessages();
    })
  }, [leagueId]);

  const newMessage = () => {
    setMessages([...chatMessages]);
  }

  const sendMessage = (value) => {
    let messageObj = {
      leagueId: leagueId,
      content: value
    };

    sendSocketMessage(messageObj);

    setChatMessage('');
  }
  
  return (
    <Row style={{ height: 'auto', maxHeight: 'calc(50vh - 70px)', marginTop: '12px' }} className='flex-growVert-child flex-growVert-parent'>
      <Card size='small' className='flex-growVert-child' bodyStyle={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Row style={{ maxHeight: 'calc(50vh - 70px)', overflow: 'auto' }}>
          <List
            dataSource={messages}
            style={{ overflow: 'auto', width: '100%' }}
            renderItem={message => (
              <div className='chat-message'>
                <span className='author'>{message.alias}</span>
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