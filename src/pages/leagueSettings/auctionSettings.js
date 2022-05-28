import React from 'react';
import { Col, Divider, Layout, Row } from 'antd';
import AuctionRules from '../../components/auctionRules/auctionRules';
import SettingsDivider from '../../components/settingsDivider/settingsDivider';

const { Content } = Layout;

function AuctionSettings() {

  return (
    <Content>
      <SettingsDivider justify='center' dividerOrientation='left'>Auction Rules</SettingsDivider>
      <AuctionRules />
      <SettingsDivider justify='center' dividerOrientation='left'>Bidding Rules</SettingsDivider>
      <SettingsDivider justify='center' dividerOrientation='left'>Tax Brackets</SettingsDivider>
    </Content>
  )
}

export default AuctionSettings;