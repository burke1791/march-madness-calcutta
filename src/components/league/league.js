import React, { useEffect } from 'react';
import { Router, Redirect } from '@reach/router';

import LeagueNav from '../leagueNav/leagueNav';
import LeagueHome from '../leagueHome/leagueHome';
import LeagueAuction from '../leagueAuction/leagueAuction';
import Tournament from '../tournament/tournament';
import MessageBoard from '../messageBoard/messageBoard';
import MessageThread from '../messageThread/messageThread';
import MemberPage from '../memberPage/memberPage';

import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';

import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { User } from '../../utilities/authService';
import LeagueSettings from '../leagueSettings/leagueSettings';
import { useSettingsDispatch, useSettingsState } from '../../context/leagueSettingsContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';

const { Content } = Layout;

function League(props) {

  const dispatch = useLeagueDispatch();
  const settingsDispatch = useSettingsDispatch();

  const { leagueId } = useLeagueState();
  const { settingsRefreshTrigger } = useSettingsState();

  useEffect(() => {
    
    setLeagueContext();

    return (() => {
      cleanupContext();
    });
  }, []);

  useEffect(() => {
    // using leagueId from context to ensure the settings download stays in sync with the correct league
    console.log(leagueId);
    console.log(settingsRefreshTrigger);
    if (!!leagueId) {
      fetchSettings(leagueId);
    }
  }, [leagueId, settingsRefreshTrigger]);

  const cleanupContext = () => {
    dispatch({ type: 'clear' });
    settingsDispatch({ type: 'clear' });
  }

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

  const fetchSettings = (leagueId) => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS, { leagueId }).then(response => {
      console.log(response);
      setSettingsInContext(response.data[0]);
    }).catch(error => {
      console.log(error);
    });
  }

  const setSettingsInContext = (settings) => {
    if (settings.leagueId !== props.leagueId) {
      // something ain't right
      console.log('settings may not be correct');
    }

    let settingNames = Object.keys(settings);
    let settingsList = [];

    for (var name of settingNames) {
      if (name != 'leagueId') {
        let obj = {
          name: name,
          value: settings[name],
          serverValue: settings[name],
          displayOrder: 0 // will be filled in when the database catches up
        };

        settingsList.push(obj);
      }
    }
    console.log(settingsList);
    settingsDispatch({ type: 'update', key: 'settingsList', value: settingsList});
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