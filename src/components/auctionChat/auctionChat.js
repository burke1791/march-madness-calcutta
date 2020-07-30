import React, { useState, useEffect, useRef } from 'react';
import './auctionChat.css';

import { formatTimestamp } from '../../utilities/helper';

import { Row, Col, List, Card, Input, Button } from 'antd'
import 'antd/dist/antd.css';
import Pubsub from '../../utilities/pubsub';
import { NOTIF, AUCTION_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { sendSocketMessage } from '../../utilities/auctionService';
import AuctionService from '../../services/autction/auction.service';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';

const { Search } = Input;

function AuctionChat() {
  
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const messagesRef = useRef(messages);

  const { leagueId } = useLeagueState();
  const { authenticated } = useAuthState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.NEW_CHAT_MESSAGE, AuctionChat, handleNewMessage);

    return (() => {
      Pubsub.unsubscribe(NOTIF.NEW_CHAT_MESSAGE, AuctionChat);
    });
  }, []);

  useEffect(() => {
    clearMessages();
    getAllMessages();

    return (() => {
      clearMessages();
    });
  }, [leagueId, authenticated]);

  const getAllMessages = () => {
    if (leagueId && authenticated) {
      AuctionService.callApi(AUCTION_SERVICE_ENDPOINTS.FETCH_CHAT, { leagueId });
    }
  }

  const handleNewMessage = (newMessage) => {
    const newList = [...messagesRef.current, ...newMessage];

    messagesRef.current = newList;
    setMessages(newList);
  };

  const clearMessages = () => {
    setMessages([]);
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