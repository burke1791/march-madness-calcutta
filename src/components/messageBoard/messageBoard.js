import React, { useState, useEffect } from 'react';
import './messageBoard.css';

import { navigate } from '@reach/router';

import { Layout, Table, Row, Button } from 'antd';
import 'antd/dist/antd.css';
import DataService, { Data } from '../../utilities/data';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import MessageBoardModal from '../messageBoardModal/messageBoardModal';


const { Header, Content } = Layout;

function MessageBoard(props) {

  const [leagueName, setLeagueName] = useState(Data.leagueInfo.name || '');
  const [topicList, setTopicList] = useState([]);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.MESSAGE_BOARD_TOPICS_DOWNLOADED, MessageBoard, topicsDownloaded);

    DataService.getMessageBoardTopics(props.leagueId);

    return (() => {
      Pubsub.unsubscribe(NOTIF.MESSAGE_BOARD_TOPICS_DOWNLOADED, MessageBoard);
    });
  }, []);

  const topicsDownloaded = () => {
    setTopicList(Data.messageBoardTopics);
  }

  const newTopicClicked = () => {
    // post a notification to display the new topic modal
    Pubsub.publish(NOTIF.MESSAGE_BOARD_MODAL_SHOW, props.leagueId);
  }

  const topicClicked = (topicId, title) => {
    // navigate to the MessageThread component
    console.log('topic: ' + topicId);
    navigate(`/leagues/${props.leagueId}/message_board/${topicId}`, { state: { topicTitle: title || '' }})
  }

  const userClicked = (userId) => {
    // navigate to the User's page
    console.log('user: ' + userId);
  }

  const columns = [
    {
      title: 'Topic',
      dataIndex: 'topic',
      align: 'left',
      width: 300,
      render: topicObj => {
        return (
          <div className='topicTitle' style={{ textAlign: 'left' }}>
            <Button 
              type='link'
              style={{ display: 'block', padding: '0' }}
              size='small'
              data-link='nonRow'
              onClick={() => topicClicked(topicObj.id, topicObj.title)}
            >
              {topicObj.title}
            </Button>
            <span>
              by 
              <Button 
                type='link'
                size='small'
                data-link='nonRow'
                onClick={() => userClicked(topicObj.authorId)}
              >
                {topicObj.author}
              </Button>
            </span>
          </div>
        );
      }
    },
    {
      title: 'Created',
      dataIndex: 'created',
      align: 'left',
      width: 250
    },
    {
      title: 'Last Post',
      dataIndex: 'lastPost',
      align: 'left',
      width: 250,
      render: lastPostObj => {
        return (
          <div className='lastPost'>
            <p className='margin-0'>{lastPostObj.created}</p>
            <p className='margin-0'>
              by 
              <Button
                type='link'
                size='small'
                data-link='nonRow'
                onClick={() => userClicked(lastPostObj.authorId)}
              >
                {lastPostObj.author}  
              </Button>
            </p>
          </div>
        )
      }
    },
    {
      title: 'Posts',
      dataIndex: 'postCount',
      align: 'center',
      width: 100
    }
  ];

  return (
    <div>
      <Layout>
        <Header style={{ background: 'none', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px' }}>{leagueName} Message Board</h1>
        </Header>
        <Content style={{ margin: '0 20px'}}>
          <Button 
            type='primary'
            style={{ margin: '12px 0'}}
            onClick={newTopicClicked}
          >
            New Topic
          </Button>
          <Table 
            columns={columns}
            dataSource={topicList}
            size='small'
            pagination={false}
            onRow={
              (record, index) => {
                return {
                  onClick: (event) => {
                    if (event.target.getAttribute('data-link') !== 'nonRow') {
                      topicClicked(record.topic.id, record.topic.title);
                    }
                  }
                }
              }
            }
          />
        </Content>
      </Layout>
      <MessageBoardModal />
    </div>
  );
}

export default MessageBoard;