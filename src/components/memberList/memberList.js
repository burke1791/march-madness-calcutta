import React, { useState, useEffect, useRef } from 'react';

import { Row, Col, Card, Table } from 'antd';
import './memberList.css';

import { formatMoney } from '../../utilities/helper';
import Pubsub from '../../utilities/pubsub';
import { API_CONFIG, AUCTION_NOTIF, AUCTION_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useAuctionDispatch, useAuctionState } from '../../context/auctionContext';
import { useLeagueState } from '../../context/leagueContext';
import useData from '../../hooks/useData';
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

  const auctionDispatch = useAuctionDispatch();

  const [users, usersReturnDate, getUsers] = useData({
    baseUrl: API_CONFIG.AUCTION_SERVICE_BASE_URL,
    endpoint: `${AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_BUYINS}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (authenticated && leagueId) {
      downloadData();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    if (confirmedSoldTimestamp && confirmedSoldTimestamp > auctionBuyInsDownloadedDate) {
      setLoading(true);
    } else if (auctionBuyInsDownloadedDate && auctionBuyInsDownloadedDate > confirmedSoldTimestamp) {
      setLoading(false);
    }
  }, [confirmedSoldTimestamp, auctionBuyInsDownloadedDate]);

  useEffect(() => {
    if (usersReturnDate) {
      setLoading(false);
      auctionDispatch({ type: 'update', key: 'memberBuyIns', value: users });
      auctionDispatch({ type: 'update', key: 'auctionBuyInsDownloadedDate', value: new Date().valueOf() });
    }
  }, [usersReturnDate]);

  useEffect(() => {
    if (connectedUsersUpdated || auctionBuyInsDownloadedDate) {
      updateUsersList();
    }
  }, [connectedUsersUpdated, auctionBuyInsDownloadedDate]);

  useEffect(() => {
    updateMyNaturalAndTaxBuyIn();
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

  const downloadData = () => {
    setLoading(true);
    getUsers();
  }

  const updateUsersList = () => {

    const list = [];

    if (memberBuyIns?.length) {
      for (let u of memberBuyIns) {
        list.push({
          userId: +u.UserId,
          alias: u.Alias,
          totalBuyIn: u.NaturalBuyIn + u.TaxBuyIn,
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

  const updateMyNaturalAndTaxBuyIn = () => {
    if (memberBuyIns && memberBuyIns.length) {
      const currentUser = memberBuyIns.find(u => u.UserId == userId);

      if (currentUser) {
        const naturalBuyIn = currentUser.NaturalBuyIn || 0;
        const taxBuyIn = currentUser.TaxBuyIn || 0;

        auctionDispatch({ type: 'update', key: 'naturalBuyIn', value: naturalBuyIn });
        auctionDispatch({ type: 'update', key: 'taxBuyIn', value: taxBuyIn });
      }
    }
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