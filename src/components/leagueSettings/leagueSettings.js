import React, { useState, useEffect } from 'react';

import { Layout, Row, Col, Button, message } from 'antd';
import 'antd/dist/antd.css';
import LeagueHeader from '../league/leagueHeader';
import { useLeagueState } from '../../context/leagueContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS, SETTINGS, SETTING_TYPES } from '../../utilities/constants';
import { useSettingsDispatch, useSettingsState } from '../../context/leagueSettingsContext';
import Setting from './setting';

const { Content } = Layout;

function LeagueSettings(props) {

  const [loading, setLoading] = useState(false);

  const { leagueId, leagueName } = useLeagueState();

  const { settingsList, newSettings } = useSettingsState();
  const settingsDispatch = useSettingsDispatch();

  useEffect(() => {
    // just forcing a rerender
  }, [leagueId, JSON.stringify(settingsList)]);

  const updateSettings = () => {
    setLoading(true);

    if (newSettings?.length) {
      LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_SETTINGS, { 
        leagueId: leagueId,
        settings: newSettings
      }).then(response => {
        setLoading(false);
        console.log(response);
        
        if (response.data[0]?.Error) {
          displayError(response.data[0].Error);
        } else if (response.data[0]?.ValidationError) {
          // generate validation error messages
        } else {
          settingsDispatch({ type: 'update', key: 'settingsRefreshTrigger', value: new Date().valueOf() });
        }
      }).catch(error => {
        console.log(error);
      });
    } else {
      setLoading(false);
      // TODO: provide feedback
    }
  }

  const displayError = (text) => {
    message.error(text);
  }

  const generateSettings = () => {

    if (settingsList?.length > 0) {
      let settingsView = settingsList.map(setting => {
        return (
          <Setting
            key={setting.settingId}
            settingId={setting.settingId}
            labelText={setting.name}
            type={setting.type}
            serverValue={setting.serverValue}
            precision={setting.DecimalPrecision}
            tooltip={setting.description}
            prefix={setting.prefix}
            suffix={setting.suffix}
            trailingText={setting.trailingText}
            minVal={setting.minVal}
            maxVal={setting.maxVal}
          />
        );
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
        <Row justify='center'>
          <Col span={12} style={{ textAlign: 'center' }}>
            <hr></hr>
            <Button
              type='primary'
              loading={loading}
              onClick={updateSettings}
            >
              Update Settings
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default LeagueSettings;