import React from 'react';
import { Layout } from 'antd';
import SettingsDivider from '../../components/settingsDivider/settingsDivider';
import GeneralRules from '../../components/auctionRules/generalRules';
// import BiddingRules from '../../components/auctionRules/biddingRules';

const { Content } = Layout;

function AuctionSettings() {

  return (
    <Content>
      <SettingsDivider justify='center' dividerOrientation='left'>Auction Rules</SettingsDivider>
      <GeneralRules />
      <SettingsDivider justify='center' dividerOrientation='left'>Bidding Rules</SettingsDivider>
      {/* <BiddingRules /> */}
      <SettingsDivider justify='center' dividerOrientation='left'>Tax Brackets</SettingsDivider>
    </Content>
  )
}

export default AuctionSettings;