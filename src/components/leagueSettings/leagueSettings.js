import React, { useState, useEffect } from 'react';

import { Layout, Row, Form, InputNumber } from 'antd';
import 'antd/dist/antd.css';
import LeagueHeader from '../league/leagueHeader';
import { useLeagueState } from '../../context/leagueContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS, SETTINGS } from '../../utilities/constants';
import { useSettingsState } from '../../context/leagueSettingsContext';

const { Content } = Layout;

function LeagueSettings(props) {

  const [leagueName, setLeagueName] = useState('');
  const [settings, setSettings] = useState({});

  const { leagueId } = useLeagueState();

  const settingsObj = useSettingsState();

  useEffect(() => {
    if (!!leagueId) {
      updateSettingsFromContext();
    }
  }, [leagueId, settingsObj.settingsRefreshTrigger]);

  const updateSettingsFromContext = () => {
    let newSettingsObj = {
      auctionInterval: {
        value: settingsObj.auctionInterval?.value,
        changed: false
      }
    };

    setSettings(newSettingsObj);
  }

  const onSettingsChange = (name, value) => {
    console.log(settingsObj);
    console.log(name, value);
  }

  const generateSettings = () => {

  }

  return (
    <Layout>
      <LeagueHeader class='primary' text='placeholder for league name' />
      <LeagueHeader class='secondary' text='Settings' />
      <Content>
        <Row>
          <Form
            initialValues={{
              [SETTINGS.AUCTION_INTERVAL.name]: 15
            }}
          >
            <Form.Item label={SETTINGS.AUCTION_INTERVAL.text}>
              <Form.Item name={SETTINGS.AUCTION_INTERVAL.name} noStyle>
                <InputNumber 
                  min={5}
                  max={30}
                  size='small'
                  onChange={(value) => { onSettingsChange(SETTINGS.AUCTION_INTERVAL.name, value)}}
                />
              </Form.Item>
              <span className='ant-form-text'> seconds</span>
            </Form.Item>
          </Form>
        </Row>
      </Content>
    </Layout>
  );
}

export default LeagueSettings;