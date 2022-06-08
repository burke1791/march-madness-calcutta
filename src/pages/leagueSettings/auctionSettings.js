import React from 'react';
import { Layout } from 'antd';
import GeneralRules from '../../components/auctionRules/generalRules';
import SettingsDivider from '../../components/settingsDivider/settingsDivider';
import GeneralRulesTest from '../../components/auctionRules/generalRules2';
// import BiddingRules from '../../components/auctionRules/biddingRules';

const { Content } = Layout;

function AuctionSettings() {

  return (
    <Content>
      <SettingsDivider justify='center' dividerOrientation='left'>Auction Rules</SettingsDivider>
      {/* <GeneralRules /> */}
      <GeneralRulesTest />
      <SettingsDivider justify='center' dividerOrientation='left'>Bidding Rules</SettingsDivider>
      {/* <BiddingRules /> */}
      <SettingsDivider justify='center' dividerOrientation='left'>Tax Brackets</SettingsDivider>
    </Content>
  )
}

export default AuctionSettings;