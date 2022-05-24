import React from 'react';
import { Col, Divider, Layout, Row } from 'antd';
import AuctionRules from '../../components/auctionRules/auctionRules';

const { Content } = Layout;

function AuctionSettings() {

  return (
    <Content>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Divider orientation='left'>Auction Rules</Divider>
          <AuctionRules />
        </Col>
      </Row>
    </Content>
  )
}

export default AuctionSettings;