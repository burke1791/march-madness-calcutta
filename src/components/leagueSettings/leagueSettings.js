import React, { useState, useEffect } from 'react';

import { Layout, Row, Col, Button, message, Tooltip } from 'antd';
import 'antd/dist/antd.css';
import LeagueHeader from '../league/leagueHeader';
import { useLeagueState } from '../../context/leagueContext';
import { constructUpdatedSettingsArray, getUpdateSettingsEndpoint } from './helper';
import LeagueService from '../../services/league/league.service';
import { useSettingsDispatch, useSettingsState } from '../../context/leagueSettingsContext';
import Setting from './setting';
import { QuestionCircleTwoTone } from '@ant-design/icons';

const { Content } = Layout;

function LeagueSettings(props) {

  const [loading, setLoading] = useState(false);
  // const []

  const { leagueId, leagueName } = useLeagueState();

  const { settingsList, payoutSettings, newSettings } = useSettingsState();
  const settingsDispatch = useSettingsDispatch();

  useEffect(() => {
    // just forcing a rerender
  }, [leagueId, JSON.stringify(settingsList)]);

  const updateSettings = () => {
    setLoading(true);

    if (newSettings?.length) {
      let settingsUpdate = constructUpdatedSettingsArray(props.settingsGroup, newSettings);
      let endpoint = getUpdateSettingsEndpoint(props.settingsGroup);

      LeagueService.callApiWithPromise(endpoint, { 
        leagueId: leagueId,
        settings: settingsUpdate
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
    if (props.settingsGroup == 'auction') {
      return generateSettingsView(settingsList);
    } else if (props.settingsGroup == 'payout') {
      return generateSettingsView(payoutSettings);
    }
    return null;
  }

  const generateSettingsView = (list) => {
    if (list?.length > 0) {
      let group = null;
      let prevGroup = null;
      let settingsView = list.map((setting, index) => {
        prevGroup = group;
        group = setting.group;
        let view = (
          <Row justify='center' align='middle' gutter={[4, 16]} key={setting.settingId}>
            <Col span={3}>
              <div className='settingLabel' style={{ textAlign: 'right' }}>
                <span>{setting.name} </span>
              </div>
            </Col>
            <Col span={1}>
              <Tooltip placement='top' title={setting.description}>
                <QuestionCircleTwoTone />
              </Tooltip>
            </Col>
            {setting.inputList.map((input, index) => {
              return (
                <Setting
                  key={`${setting.settingId}_${index}`}
                  settingId={setting.settingId}
                  settingGroup={props.settingsGroup}
                  settingIndex={index}
                  type={input.type}
                  precision={input.precision}
                  minVal={input.minVal}
                  maxVal={input.maxVal}
                  leadingText={input.leadingText}
                  prefix={input.prefix}
                  serverValue={input.serverValue}
                  suffix={input.suffix}
                  trailingText={input.trailingText}
                />
              );
            })}
          </Row>
        );

        if (group != prevGroup && index > 0) {
          return (
            <React.Fragment key={`${setting.settingId}_fragment`}>
              <Row justify='center'>
                <Col span={18}>
                  <hr></hr>
                </Col>
              </Row>
              {view}
            </React.Fragment>
          );
        }

        return view;
      });
      return (settingsView);
    }
    return null;
  }

  const generateSettingsGroupText = () => {
    let name = '';

    if (props.settingsGroup == 'auction') {
      name = 'Auction Settings';
    } else if (props.settingsGroup == 'payout') {
      name = 'Payout Settings'
    } else {
      name = 'Settings';
    }

    return name;
  }

  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <LeagueHeader class='secondary' text={generateSettingsGroupText()} />
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
              {`Update ${generateSettingsGroupText()}`}
            </Button>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default LeagueSettings;