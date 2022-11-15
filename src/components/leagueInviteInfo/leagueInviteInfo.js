import React from 'react';
import { Typography } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import LeagueHeader from '../league/leagueHeader';
import { SETTINGS_TOOLTIPS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';

const { Text } = Typography;

function LeagueInviteInfo() {

  const { inviteCode, inviteUrl } = useLeagueState();

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
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <LeagueHeader class='secondary' text='Invite Code' tooltipText={getInviteTooltipText('code')} tooltipIcon={getInviteTooltipIcon('code')} headerStyle={{ padding: 0, textAlign: 'left' }} />
      <Text keyboard copyable>{inviteCode}</Text>
      <LeagueHeader class='secondary' text='Invite Url' tooltipText={getInviteTooltipText('url')} tooltipIcon={getInviteTooltipIcon('url')} headerStyle={{ padding: 0, textAlign: 'left', marginTop: 12 }} />
      <Text code copyable>{inviteUrl}</Text>
    </div>
  );
}

export default LeagueInviteInfo;