import React, { useEffect, useState } from 'react';
import { Col, Divider, Layout, message, Row, Typography } from 'antd';
import 'antd/dist/antd.css';
import LeagueHeader from '../league/leagueHeader';
import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';
import LeagueRoster from './leagueRoster';
import { LEAGUE_SERVICE_ENDPOINTS, SETTINGS_TOOLTIPS } from '../../utilities/constants';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import LeagueService from '../../services/league/league.service';

const { Title, Text } = Typography;
const { Content } = Layout;

function GeneralSettings() {

  const { leagueId, leagueName, inviteCode, inviteUrl } = useLeagueState();

  const leagueDispatch = useLeagueDispatch();

  const [leagueNameText, setLeagueNameText] = useState(leagueName);
  const [leagueNameEdited, setLeagueNameEdited] = useState(false);

  useEffect(() => {
    if (!leagueNameEdited) {
      setLeagueNameText(leagueName);
    }
  }, [leagueName])

  const leagueNameChange = (text) => {
    setLeagueNameText(text);
    setLeagueNameEdited(true);

    let payload = {
      leagueId: leagueId,
      newLeagueName: text // state updates aren't synchronous so we need to use the function input instead of the state variable
    };

    // fire API request to update league name
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_NAME, { payload }).then(response => {
      if (response.data && response.data.length && response.data[0]?.Error) {
        message.error(response.data[0].Error);
      } else {
        leagueDispatch({ type: 'update', key: 'leagueMetadataRefresh', value: new Date().valueOf() });
        message.success('League Name Updated');
      }
    }).catch(error => {
      console.log(error);
      message.error('Error updating league name. Please try again later');
    });
  }

  const getInviteTooltipIcon = (inviteType) => {
    if (inviteType === 'code') {
      return <QuestionCircleTwoTone />;
    } else if (inviteType === 'url') {
      return <QuestionCircleTwoTone />;
    }

    return null;
  }

  const getInviteTooltipText = (inviteType) => {
    if (inviteType === 'code') {
      return SETTINGS_TOOLTIPS.INVITE_CODE;
    } else if (inviteType === 'url') {
      return SETTINGS_TOOLTIPS.INVITE_URL;
    }

    return null;
  }

  return (
    <Content>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Divider orientation='left'>Edit League Name</Divider>
          <Row style={{ paddingLeft: 12, paddingRight: 12 }}>
            <Title
              level={4}
              editable={{
                maxLength: 50,
                onChange: leagueNameChange
              }}
            >
              {leagueNameText}
            </Title>
          </Row>
          <Divider orientation='left'>League Members</Divider>
          <Row style={{ paddingLeft: 12, paddingRight: 12 }}>
            <LeagueRoster />
          </Row>
          <Divider orientation='left'>Invite Link</Divider>
          <Row style={{ paddingLeft: 12, paddingRight: 12 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <LeagueHeader class='secondary' text='League Invite Code' tooltipText={getInviteTooltipText('code')} tooltipIcon={getInviteTooltipIcon('code')} headerStyle={{ padding: 0, textAlign: 'left' }} />
              <Text keyboard copyable>{inviteCode}</Text>
              <LeagueHeader class='secondary' text='League Invite Code' tooltipText={getInviteTooltipText('url')} tooltipIcon={getInviteTooltipIcon('url')} headerStyle={{ padding: 0, textAlign: 'left', marginTop: 12 }} />
              <Text code copyable>{inviteUrl}</Text>
            </div>
          </Row>
        </Col>
      </Row>
    </Content>
  );
}

export default GeneralSettings;