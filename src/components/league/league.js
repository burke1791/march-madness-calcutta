import React, { useState } from 'react';
import { Router, Redirect } from '@reach/router';

import LeagueNav from '../leagueNav/leagueNav';
import LeagueHome from '../leagueHome/leagueHome';
import LeagueAuction from '../leagueAuction/leagueAuction';
import MessageBoard from '../messageBoard/messageBoard';
import MessageThread from '../messageThread/messageThread';
import MemberPage from '../memberPage/memberPage';

import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import { User } from '../../utilities/authService';

const { Header, Sider, Content } = Layout;

function League(props) {
  const [auctionId, setAuctionId] = useState(props.location.state.auctionId);
  const [role, setRole] = useState(props.location.state.roleId);

  if (User.authenticated) {
    return (
      <Layout style={{ height: 'calc(100vh - 64px)' }}>
        <LeagueNav leagueId={props.leagueId} />
        <Layout>
          <Content>
            <Router>
              <LeagueHome path='/' />
              <LeagueAuction path='auction' auctionId={auctionId} leagueId={props.leagueId} role={role} />
              {/* <MessageBoard path='message_board' leagueId={props.leagueId} role={role} /> */}
              {/* <MessageThread path='message_board/:topicId' leagueId={props.leagueId} role={role} /> */}
              <MemberPage path='member' leagueId={props.leagueId} />
            </Router>
          </Content>
        </Layout>
      </Layout>
    );
  } else {
    return (
      <Redirect to='/' noThrow />
    );
  }
  
}

export default League;