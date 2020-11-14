import React, { useEffect } from 'react';
import { Router, Redirect } from '@reach/router';

import LeagueNav from '../leagueNav/leagueNav';
import LeagueHome from '../leagueHome/leagueHome';
import LeagueAuction from '../leagueAuction/leagueAuction';
import Tournament from '../tournament/tournament';
import MessageBoard from '../messageBoard/messageBoard';
import MessageThread from '../messageThread/messageThread';
import MemberPage from '../memberPage/memberPage';

import { useLeagueDispatch } from '../../context/leagueContext';

import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { User } from '../../utilities/authService';
import LeagueSettings from '../leagueSettings/leagueSettings';

const { Content } = Layout;

function League(props) {

  const dispatch = useLeagueDispatch();

  useEffect(() => {
    
    setLeagueContext();

    return (() => {
      dispatch({ type: 'clear' });
    });
  }, []);

  /**
   * Dispatches context updates only if the data is known
   * @function setLeagueContext
   */
  const setLeagueContext = () => {

    if (props.location.state.tournamentId) {
      dispatch({ type: 'update', key: 'tournamentId', value: props.location.state.tournamentId });
    }

    if (props.leagueId) {
      dispatch({ type: 'update', key: 'leagueId', value: props.leagueId });
    }

    if (props.location.state.roleId) {
      dispatch({ type: 'update', key: 'roleId', value: props.location.state.roleId });
    }
  }

  if (User.authenticated == undefined || User.authenticated) {
    return (
      <Layout style={{ height: 'calc(100vh - 64px)' }}>
        <LeagueNav />
        <Layout>
          <Content>
            <Router>
              <LeagueHome path='/' />
              <LeagueAuction path='auction' />
              <Tournament path='tournament' />
              {/* <MessageBoard path='message_board' leagueId={props.leagueId} role={role} /> */}
              {/* <MessageThread path='message_board/:topicId' leagueId={props.leagueId} role={role} /> */}
              <MemberPage path='member' />
              <LeagueSettings path='settings' />
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