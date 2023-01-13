import React from 'react';
import { Layout, Skeleton } from 'antd';
import SettingsDivider from '../../components/settingsDivider/settingsDivider';
import SettingsRow from '../../components/settingsRow/settingsRow';
import PayoutCalculation from '../../components/payoutCalculation/payoutCalculation';
import PayoutRules from '../../components/leagueRulesPayout/payoutRules';
import { useSettingsState } from '../../context/leagueSettingsContext';
import PayoutRulesText from '../../components/leagueRulesPayout/payoutRulesText';
import { Editor } from '../../components/richTextEditor';

const { Content } = Layout;

function PayoutSettings() {

  const { calcOption } = useSettingsState();

  return (
    <Content style={{ paddingBottom: 12 }}>
      <SettingsDivider dividerOrientation='left'>Payout Calculation</SettingsDivider>
      <SettingsRow justify='center'>
        <PayoutCalculation />
      </SettingsRow>
      <SettingsDivider dividerOrientation='left'>Payout Rules</SettingsDivider>
      {calcOption?.toLowerCase() === 'automatic' ? <PayoutRules /> : <Editor />
        // <PayoutRulesText />
      }
    </Content>
  )
}

export default PayoutSettings;