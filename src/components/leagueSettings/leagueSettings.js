import React, { useState, useEffect } from 'react';

import { Layout, Row, List } from 'antd';
import 'antd/dist/antd.css';
import LeagueHeader from '../league/leagueHeader';
import { useLeagueState } from '../../context/leagueContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS, SETTINGS, SETTING_TYPES } from '../../utilities/constants';
import { useSettingsState } from '../../context/leagueSettingsContext';
import Setting from './setting';

const { Content } = Layout;

function LeagueSettings(props) {

  const { leagueId, leagueName } = useLeagueState();

  const { settingsList, settingsRefreshTrigger } = useSettingsState();

  useEffect(() => {
    // not sure what to do here
  }, [leagueId, settingsRefreshTrigger]);

  const generateSettings = () => {

    if (settingsList?.length > 0) {
      let settingsView = settingsList.map(setting => {
        if (setting.name !== 'unclaimedAllowed') {
          return (
            <Setting
              key={setting.name}
              labelText={setting.name}
              type={SETTING_TYPES.INPUT_NUMBER}
              trailingText='seconds'
            />
          );
        }
      });
      return (settingsView);
    }
    return null;
  }

  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <LeagueHeader class='secondary' text='Settings' />
      <Content>
        {generateSettings()}
      </Content>
    </Layout>
  );
}

export default LeagueSettings;