import React from 'react';
import { Layout } from 'antd';
import SettingsDivider from '../../components/settingsDivider/settingsDivider';
import SettingsRow from '../../components/settingsRow/settingsRow';
import PayoutCalculation from '../../components/payoutCalculation/payoutCalculation';

const { Content } = Layout;

function PayoutSettings() {

  return (
    <Content>
      <SettingsDivider dividerOrientation='left'>Payout Calculation</SettingsDivider>
      <SettingsRow justify='center'>
        <PayoutCalculation />
      </SettingsRow>
      <SettingsDivider dividerOrientation='left'>Payout Rules</SettingsDivider>
      {/* PayoutRules */}
    </Content>
  )
}

export default PayoutSettings;