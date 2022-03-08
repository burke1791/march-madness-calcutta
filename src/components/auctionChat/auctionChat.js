import React, { useState, useEffect, useRef, memo } from 'react';
import './auctionChat.css';

import { formatTimestamp } from '../../utilities/helper';

import { Row, List, Card, Input } from 'antd'
import 'antd/dist/antd.css';
import Pubsub from '../../utilities/pubsub';
import { NOTIF, AUCTION_SERVICE_ENDPOINTS } from '../../utilities/constants';
import AuctionService from '../../services/autction/auction.service';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import { useAuctionState } from '../../context/auctionContext';

const urlRegex = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;

const { Search } = Input;

function AuctionChat(props) {
  
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const messagesRef = useRef(messages);

  const { leagueId } = useLeagueState();
  const { authenticated } = useAuthState();
  const { connected } = useAuctionState();

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
  }, [leagueId, authenticated, connected]);

  const getAllMessages = () => {
    if (leagueId && authenticated && connected) {
      AuctionService.callApi(AUCTION_SERVICE_ENDPOINTS.FETCH_CHAT, { leagueId });
    }
  }

  const handleNewMessage = (newMessage) => {
    const newList = [...messagesRef.current, ...newMessage];

    messagesRef.current = newList;
    setMessages(newList);
  };

  const clearMessages = () => {
    messagesRef.current = [];
    setMessages([]);
  }

  const sendMessage = (value) => {
    let messageObj = {
      leagueId: leagueId,
      content: value
    };

    // sendSocketMessage(messageObj);
    props.sendSocketMessage('MESSAGE', messageObj);

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
                <MessageContent>{message.content}</MessageContent>
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

const MessageContent = memo(function MessageContent(props) {

  const parseContent = (children) => {

    if (typeof children !== 'string') return children;

    return children.split(' ').map((text, index, arr) => {
      if (arr.length - 1 == index) {
        // do not return a trailing space for the last chunk of text
        return (
          <MessageContentNode key={index}>
            {urlRegex.test(text) ? <a href={text}>{text}</a> : text}
          </MessageContentNode>
        );
      }

      return (
        <MessageContentNode key={index}>
          {urlRegex.test(text) ? <a href={text}>{text} </a> : text + ' '}
        </MessageContentNode>
      );
    });
  }

  return (
    <span className='content'>{parseContent(props.children)}</span>
  );
});

// this is a temporary hack to prevent the missing key in a list error
// rewrite these two components into something more elegant (I don't want a fuckton of individual text nodes on the dom)
const MessageContentNode = memo(function MessageContentNode(props) {
  return props.children;
});

export default AuctionChat;