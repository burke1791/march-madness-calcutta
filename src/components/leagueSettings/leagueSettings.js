import React, { useState, useEffect } from 'react';

import { Layout, Row, Form, InputNumber } from 'antd';
import 'antd/dist/antd.css';
import LeagueHeader from '../league/leagueHeader';
import { useLeagueState } from '../../context/leagueContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';

const { Content } = Layout;

function LeagueSettings(props) {

  const [leagueName, setLeagueName] = useState('');
  const [auctionInterval, setAuctionInterval] = useState();

  const { leagueId } = useLeagueState();

  useEffect(() => {
    console.log(leagueId);
    if (leagueId) {
      fetchSettings();
    }
  }, [leagueId]);

  const fetchSettings = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS, { leagueId }).then(response => {
      console.log(response);
      setSettingsInState(response.data[0]);
    }).catch(error => {
      console.log(error);
    });
  }

  const setSettingsInState = (settingsObj) => {
    setAuctionInterval(settingsObj.auctionInterval);
  }

  return (
    <Layout>
      <LeagueHeader class='primary' text='placeholder for league name' />
      <LeagueHeader class='secondary' text='Settings' />
      <Content>
        <Row>
          <Form>
            <Form.Item label='Auction Timer'>
              <Form.Item name='auctionInterval' noStyle>
                <InputNumber min={5} max={30} defaultValue={15} />
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