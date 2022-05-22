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
import SeedGroupSettings from './seedGroupSettings';
import { NOTIF, SETTINGS_TOOLTIPS } from '../../utilities/constants';
import SettingsUpdateButton from './settingsUpdateButton';
import Pubsub from '../../utilities/pubsub';
import SeedGroupModal from './seedGroupModal';
import GeneralSettings from './generalSettings';
import { useLocation } from 'react-router-dom';

const { Content } = Layout;

function LeagueSettings() {

  const [loading, setLoading] = useState(false);
  const [settingsGroup, setSettingsGroup] = useState('');

  const { leagueId, leagueName } = useLeagueState();

  const { settingsList, payoutSettings, newSettings } = useSettingsState();
  const settingsDispatch = useSettingsDispatch();
  const location = useLocation();

  useEffect(() => {
    const parsedSettingsGroup = location.pathname.match(/(?<=\/leagues\/\d{1,}\/settings\/)\w{1,}($|(?=\/))/ig)[0];
    setSettingsGroup(parsedSettingsGroup);
  }, [location]);

  useEffect(() => {
    // just forcing a rerender
  }, [leagueId, JSON.stringify(settingsList)]);

  const updateSettings = () => {
    if (settingsGroup == 'seed_groups') {
      Pubsub.publish(NOTIF.SEED_GROUP_MODAL_SHOW, null);
    } else {
      setLoading(true);

      if (newSettings?.length) {
        let settingsUpdate = constructUpdatedSettingsArray(settingsGroup, newSettings);
        let endpoint = getUpdateSettingsEndpoint(settingsGroup);

        LeagueService.callApiWithPromise(endpoint, { 
          leagueId: leagueId,
          settings: settingsUpdate
        }).then(response => {
          setLoading(false);
          
          if (response.data[0]?.Error) {
            displayError(response.data[0].Error);
          } else if (response.data[0]?.ValidationError) {
            // generate validation error messages
          } else {
            settingsDispatch({ type: 'update', key: 'settingsRefreshTrigger', value: new Date().valueOf() });
            message.success('Settings Updated');
          }
        }).catch(error => {
          console.log(error);
        });
      } else {
        setLoading(false);
        // TODO: provide feedback
      }
    }
  }

  const displayError = (text) => {
    message.error(text);
  }

  const generateSettings = () => {
    if (settingsGroup == 'league') {
      return <GeneralSettings />;
    } else if (settingsGroup == 'auction') {
      return generateSettingsView(settingsList);
    } else if (settingsGroup == 'payout') {
      return generateSettingsView(payoutSettings);
    } else if (settingsGroup == 'seed_groups') {
      return (
        <SeedGroupSettings />
      );
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
                  settingGroup={settingsGroup}
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

    if (settingsGroup == 'league') {
      name = 'League Settings';
    } else if (settingsGroup == 'auction') {
      name = 'Auction Settings';
    } else if (settingsGroup == 'payout') {
      name = 'Payout Settings'
    } else if (settingsGroup == 'seed_groups') {
      name = 'Seed Group Settings'
    } else {
      name = 'Settings';
    }

    return name;
  }

  const getSettingsTooltipText = () => {
    let tooltip = null;

    if (settingsGroup == 'seed_groups') {
      tooltip = SETTINGS_TOOLTIPS.GROUPS_HEADER;
    }

    return tooltip;
  }

  const getSettingsTooltipIcon = () => {
    if (settingsGroup == 'seed_groups') {
      return <QuestionCircleTwoTone />;
    }

    return null;
  }

  const getUpdateButtonText = () => {
    let text = '';

    if (settingsGroup == 'league') {
      text = null
    } else if (settingsGroup == 'auction') {
      text = 'Update Auction Settings';
    } else if (settingsGroup == 'payout') {
      text = 'Update Payout Settings'
    } else if (settingsGroup == 'seed_groups') {
      text = 'New Group'
    } else {
      text = 'Update Settings';
    }

    return text;
  }

  return (
    <Content style={{ overflowX: 'hidden' }}>
      <Row justify='center'>
        <LeagueHeader class='primary' text={leagueName} />
      </Row>
      <Row justify='center'>
        <LeagueHeader class='secondary' text={generateSettingsGroupText()} tooltipText={getSettingsTooltipText()} tooltipIcon={getSettingsTooltipIcon()} />
      </Row>
      {generateSettings()}
      <SettingsUpdateButton 
        text={getUpdateButtonText()}
        onClick={updateSettings}
        loading={loading}
      />
      <SeedGroupModal />
    </Content>
  );
}

export default LeagueSettings;