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
import { LEAGUE_SERVICE_ENDPOINTS, SETTING_TYPES } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';

const { Content } = Layout;

function League(props) {

  const dispatch = useLeagueDispatch();
  const settingsDispatch = useSettingsDispatch();

  const { leagueId } = useLeagueState();
  const { settingsRefreshTrigger } = useSettingsState();
  const { authenticated } = useAuthState();

  useEffect(() => {
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
      fetchPayoutSettings(leagueId);
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
      setSettingsInContext(response.data);
    }).catch(error => {
      console.log(error);
    });
  }

  const fetchPayoutSettings = (leagueId) => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_PAYOUT_SETTINGS, { leagueId }).then(response => {
      setPayoutSettingsInContext(response.data);
    }).catch(error => {
      console.log(error);
    });
  }

  const fetchMetadata = (leagueId) => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_METADATA, { leagueId }).then(response => {
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
        setting.MinValue = setting.MinValue == null ? undefined : +setting.MinValue * 100;
        setting.MaxValue = setting.MaxValue == null ? undefined : +setting.MaxValue * 100;
        setting.SettingValue = setting.SettingValue == null ? '' : +setting.SettingValue * 100;
      }

      if (setting.SettingValue == null) {
        setting.SettingValue = '';
      }

      let obj = {
        settingId: setting.SettingParameterId,
        name: setting.Name,
        displayOrder: setting.DisplayOrder,
        description: setting.Description,
        group: setting.SettingClass,
        inputList: [
          {
            serverValue: setting.SettingValue,
            type: setting.DataType,
            precision: setting.DecimalPrecision,
            prefix: setting.DisplayPrefix == null ? '' : setting.DisplayPrefix,
            suffix: setting.DisplaySuffix == null ? '' : setting.DisplaySuffix,
            trailingText: setting.TrailingText,
            minVal: setting.MinValue,
            maxVal: setting.MaxValue
          }
        ]
      };

      settingsList.push(obj);
    });

    settingsDispatch({ type: 'update', key: 'settingsList', value: settingsList});
  }

  const setPayoutSettingsInContext = (settings) => {
    if (settings[0].LeagueId !== props.leagueId) {
      // something ain't right
      console.log('payout settings may not be correct');
    }

    let settingList = [];

    settings.forEach(setting => {
      if (setting.PayoutRateSuffix == '%') {
        setting.PayoutRateMin = setting.PayoutRateMin == null ? undefined : +setting.PayoutRateMin * 100;
        setting.PayoutRateMax = setting.PayoutRateMax == null ? undefined : +setting.PayoutRateMax * 100;
        setting.PayoutRateValue = setting.PayoutRateValue == null ? '' : +setting.PayoutRateValue * 100;
      }

      if (setting.ThresholdSuffix == '%') {
        setting.ThresholdMin = setting.ThresholdMin == null ? undefined : +setting.ThresholdMin * 100;
        setting.ThresholdMax = setting.ThresholdMax == null ? undefined : +setting.ThresholdMax * 100;
        setting.PayoutThresholdValue = setting.PayoutThresholdValue == null ? '' : +setting.PayoutThresholdValue * 100;
      }

      if (setting.PayoutRateValue == null) {
        setting.PayoutRate = '';
      }

      let obj = {
        settingId: setting.TournamentPayoutId,
        name: setting.PayoutName,
        displayOrder: setting.DisplayOrder,
        description: setting.Tooltip,
        group: setting.SettingGroup,
        inputList: [
          {
            serverValue: setting.PayoutRateValue,
            type: SETTING_TYPES.INPUT_NUMBER, // payouts will always be numbers
            precision: setting.PayoutRatePrecision,
            leadingText: setting.PayoutRateLeadingText,
            prefix: setting.PayoutRatePrefix == null ? '' : setting.PayoutRatePrefix,
            suffix: setting.PayoutRateSuffix == null ? '' : setting.PayoutRateSuffix,
            trailingText: setting.PayoutRateTrailingText,
            minVal: setting.PayoutRateMin,
            maxVal: setting.PayoutRateMax
          }
        ]
      };

      if (setting.PayoutThresholdValue != null) {
        obj.inputList.push({
          serverValue: setting.PayoutThresholdValue,
          type: SETTING_TYPES.INPUT_NUMBER,
          precision: setting.ThresholdPrecision,
          leadingText: setting.ThresholdLeadingText,
          prefix: setting.ThresholdPrefix == null ? '' : setting.ThresholdPrefix,
          suffix: setting.ThresholdSuffix == null ? '' : setting.ThresholdSuffix,
          trailingText: setting.ThresholdTrailingText,
          minVal: setting.ThresholdMin,
          maxVal: setting.ThresholdMax
        });
      }

      settingList.push(obj);
    });

    settingsDispatch({ type: 'update', key: 'payoutSettings', value: settingList});
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
              <LeagueSettings path='settings/:settingsGroup' />
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