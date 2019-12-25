import React, { useState } from 'react';
import { Router, Redirect } from '@reach/router';

import LeagueNav from '../leagueNav/leagueNav';
import LeagueHome from '../leagueHome/leagueHome';
import LeagueAuction from '../leagueAuction/leagueAuction';
import MessageBoard from '../messageBoard/messageBoard';
import MessageThread from '../messageThread/messageThread';

import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { User } from '../../firebase/authService';

const { Header } = Layout;

function League(props) {
  const [auctionId, setAuctionId] = useState(props.location.state.auctionId);
  const [role, setRole] = useState(props.location.state.role);

  if (User.user_id) {
    return (
      <Layout>
        <LeagueNav leagueId={props.leagueId} />
        <Router>
          <LeagueHome path='/' />
          <LeagueAuction path='auction' auctionId={auctionId} leagueId={props.leagueId} role={role} />
          <MessageBoard path='message_board' leagueId={props.leagueId} role={role} />
          <MessageThread path='message_board/:topicId' leagueId={props.leagueId} role={role} />
        </Router>
      </Layout>
    );
  } else {
    return (
      <Redirect to='/' noThrow />
    );
  }
  
}

export default League;