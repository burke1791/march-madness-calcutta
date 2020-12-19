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
import { useAuthState } from '../../context/authContext';

const { Content } = Layout;

function League(props) {

  const dispatch = useLeagueDispatch();
  const settingsDispatch = useSettingsDispatch();

  const { leagueId } = useLeagueState();
  const { settingsRefreshTrigger } = useSettingsState();
  const { authenticated } = useAuthState();

  useEffect(() => {
    console.log('league component');
    console.log(props);
    setLeagueContext([
      { key: 'leagueId', value: props.leagueId }
    ]);

    return (() => {
      cleanupContext();
    });
  }, []);

  useEffect(() => {
    // using leagueId from context to ensure the settings download stays in sync with the correct league
    if (!!leagueId && authenticated) {
      fetchSettings(leagueId);
    }
  }, [leagueId, authenticated, settingsRefreshTrigger]);

  useEffect(() => {
    if (!!leagueId && authenticated) {
      fetchMetadata(leagueId);
    }
  }, [leagueId, authenticated]);

  const cleanupContext = () => {
    dispatch({ type: 'clear' });
    settingsDispatch({ type: 'clear' });
  }

  /**
   * Dispatches context updates only if the data is known
   * @function setLeagueContext
   */
  const setLeagueContext = (data) => {
    if (data.length > 0) {
      data.forEach(obj => {
        dispatch({ type: 'update', key: obj.key, value: obj.value });
      });
    }
  }

  const fetchSettings = (leagueId) => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS, { leagueId }).then(response => {
      console.log(response);
      setSettingsInContext(response.data);
    }).catch(error => {
      console.log(error);
    });
  }

  const fetchMetadata = (leagueId) => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_METADATA, { leagueId }).then(response => {
      console.log(response);
      let leagueMetadata = packageLeagueMetadata(response.data[0]);
      setLeagueContext(leagueMetadata);
    }).catch(error => {
      console.log(error);
    });
  }

  const packageLeagueMetadata = (data) => {
    let arr = [
      { key: 'leagueName', value: data.LeagueName },
      { key: 'tournamentId', value: data.TournamentId },
      { key: 'tournamentName', value: data.TournamentName },
      { key: 'tournamentRegimeId', value: data.TournamentRegimeId },
      { key: 'tournamentRegimeName', value: data.TournamentRegimeName },
      { key: 'roleId', value: data.RoleId },
      { key: 'roleName', value: data.RoleName }
    ];

    return arr;
  }

  const setSettingsInContext = (settings) => {
    if (settings[0].LeagueId !== props.leagueId) {
      // something ain't right
      console.log('settings may not be correct');
    }

    let settingsList = [];

    settings.forEach(setting => {
      if (setting.DisplaySuffix == '%') {
        setting.MinValue = +setting.MinValue * 100;
        setting.MaxValue = +setting.MaxValue * 100;
        setting.SettingValue = +setting.SettingValue * 100;
      }

      if (setting.SettingValue == null) {
        setting.SettingValue = '';
      }

      let obj = {
        settingId: setting.SettingParameterId,
        name: setting.Name,
        value: setting.SettingValue,
        serverValue: setting.SettingValue,
        displayOrder: setting.DisplayOrder,
        type: setting.DataType,
        precision: setting.DecimalPrecision,
        description: setting.Description,
        prefix: setting.DisplayPrefix == null ? '' : setting.DisplayPrefix,
        suffix: setting.DisplaySuffix == null ? '' : setting.DisplaySuffix,
        trailingText: setting.TrailingText,
        minVal: setting.MinValue,
        maxVal: setting.MaxValue,
        group: setting.SettingClass
      };

      settingsList.push(obj);
    });

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