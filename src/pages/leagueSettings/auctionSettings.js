import React from 'react';
import { Button, Layout, Row, Col, Typography } from 'antd';
import SettingsDivider from '../../components/settingsDivider/settingsDivider';
import GeneralRules from '../../components/auctionRulesGeneral/generalRules';
import BiddingRules from '../../components/auctionRulesBidding/biddingRules';
import TaxRules from '../../components/auctionRulesTax/taxRules';
import AuctionSettingsReset from '../../components/auctionReset/auctionSettingsReset';
import { useLeagueState } from '../../context/leagueContext';

const { Content } = Layout;
const { Title } = Typography;

function AuctionSettings() {

  const { roleId } = useLeagueState();

  return (
    <Content style={{ paddingBottom: 12 }}>
      { roleId == 1 || roleId == 2 ? <AuctionSettingsReset /> : null }
      <SettingsDivider justify='center' dividerOrientation='left'>Auction Rules</SettingsDivider>
      <GeneralRules />
      <SettingsDivider justify='center' dividerOrientation='left'>Bidding Rules</SettingsDivider>
      <BiddingRules />
      <SettingsDivider justify='center' dividerOrientation='left'>Tax Brackets</SettingsDivider>
      <TaxRules />
    </Content>
  )
}

export default AuctionSettings;