import React, { useState, useEffect, useRef } from 'react';

import { Row, Col, Card, Table } from 'antd';

import './memberList.css';

import { formatMoney } from '../../utilities/helper';
import Pubsub from '../../utilities/pubsub';
import { AUCTION_NOTIF } from '../../utilities/constants';
import { useAuctionState } from '../../context/auctionContext';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import { DisconnectOutlined } from '@ant-design/icons';

const { Column } = Table;

// @TODO (Tracked by MMC-105) add some sort of animation on the table rows that update, e.g. highlight then fade
function MemberList(props) {

  const [loading, setLoading] = useState(true);
  const [connectedUsersUpdated, setConnectedUsersUpdated] = useState(null);
  const [userList, setUserList] = useState([]);

  const connectedUsers = useRef([]);

  const { connected, memberBuyIns, auctionBuyInsDownloadedDate, confirmedSoldTimestamp } = useAuctionState();
  const { leagueId } = useLeagueState();
  const { authenticated, userId } = useAuthState();

  useEffect(() => {
    if (authenticated && leagueId) {
      setLoading(true);
    }
  }, [authenticated, leagueId]);

  // useEffect(() => {
  //   if (confirmedSoldTimestamp && confirmedSoldTimestamp > auctionBuyInsDownloadedDate) {
  //     setLoading(true);
  //   } else if (auctionBuyInsDownloadedDate && auctionBuyInsDownloadedDate > confirmedSoldTimestamp) {
  //     setLoading(false);
  //   }
  // }, [confirmedSoldTimestamp, auctionBuyInsDownloadedDate]);

  useEffect(() => {
    if (connectedUsersUpdated || auctionBuyInsDownloadedDate) {
      updateUsersList();
    }
  }, [connectedUsersUpdated, auctionBuyInsDownloadedDate]);

  useEffect(() => {
    if (auctionBuyInsDownloadedDate) {
      setLoading(false);
    }
  }, [auctionBuyInsDownloadedDate]);

  useEffect(() => {
    if (connected && leagueId) {
      props.sendSocketMessage('CONNECTED_USERS', { leagueId: leagueId });
    } else if (connected === false) {
      handleConnection([{ userId: userId, isConnected: connected }]);
    }
  }, [connected, leagueId]);

  useEffect(() => {
    Pubsub.subscribe(AUCTION_NOTIF.CONNECTION, MemberList, handleConnection);

    return (() => {
      Pubsub.unsubscribe(AUCTION_NOTIF.CONNECTION, MemberList);
    })
  }, []);

  const updateUsersList = () => {

    const list = [];

    if (memberBuyIns?.length) {
      for (let u of memberBuyIns) {
        list.push({
          userId: +u.userId,
          alias: u.alias,
          totalBuyIn: u.naturalBuyIn + u.taxBuyIn,
          isConnected: false
        });
      }
    }

    // add the connected property to each user
    if (connectedUsers.current?.length) {
      for (let c of connectedUsers.current) {
        const user = list.find(u => u.userId == +c.userId);
  
        if (user == undefined) {
          list.push({
            userId: +c.userId,
            alias: c.alias,
            totalBuyIn: 0,
            isConnected: c.isConnected
          });
        } else {
          user.isConnected = c.isConnected
        }
      }
    }

    list.sort((a, b) => b.totalBuyIn - a.totalBuyIn);

    setUserList(list);
  }

  const handleConnection = (newConnectedUsers) => {
    const currentConnectedUsers = [...connectedUsers.current];

    for (let user of newConnectedUsers) {
      const connectedUser = currentConnectedUsers.find(u => +u.userId == +user.userId);
      if (connectedUser == undefined) {
        currentConnectedUsers.push(user);
      } else {
        connectedUser.isConnected = user.isConnected;
      }
    }

    connectedUsers.current = currentConnectedUsers;
    setConnectedUsersUpdated(new Date().valueOf());
  }

  return (
    <Row style={{ height: 'calc(50vh - 70px)', marginTop: '12px' }}>
      <Col>
        <Card style={{ height: '100%', width: '100%' }} bodyStyle={{ padding: '0', height: '100%' }} size='small'>
          <Table
            loading={loading}
            dataSource={userList}
            rowKey='userId'
            pagination={false}
            size='small'
            bordered={false}
            scroll={{ y: 'calc(50vh - 107px)' }}
            style={{ border: 'none' }}
          >
            <Column
              align='left'
              dataIndex='isConnected'
              width={20}
              render={ (text, record) => <ConnectedIcon isConnected={record.isConnected} /> }
            />
            <Column
              title='Member'
              dataIndex='alias'
              key='alias'
              align='left'
              width='70%'
            />
            <Column
              title='Total Paid'
              dataIndex='totalBuyIn'
              key='totalBuyIn'
              align='right'
              width='30%'
              render={ (value) => formatMoney(value) }
            />
          </Table>
        </Card>
      </Col>
    </Row>
  );
}

export default MemberList;

/**
 * @typedef ConnectedIconProps
 * @property {Boolean} isConnected
 */

/**
 * @component
 * @param {ConnectedIconProps} props 
 */
function ConnectedIcon(props) {

  if (props.isConnected) {
    return <PulseCircle color='green' />;
  } else {
    return <DisconnectOutlined />;
  }
}

/**
 * @typedef PulseCircleProps
 * @property {('green'|'orange'|'blue'|'rose')} color
 */

/**
 * @component
 * @param {PulseCircleProps} props 
 */
function PulseCircle(props) {

  return (
    <div className={`circle pulse ${props.color || 'green'}`}></div>
  );
}