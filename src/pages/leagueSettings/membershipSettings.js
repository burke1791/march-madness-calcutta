import React from 'react';
import { Col, Divider, Layout, Row } from 'antd';
import LeagueRoster from '../../components/leagueRoster/leagueRoster';

const { Content } = Layout;

function MembershipSettings() {

  return (
    <Content style={{ paddingBottom: 12 }}>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={24}>
          <Divider orientation='left'>Roster</Divider>
          <LeagueRoster />
        </Col>
      </Row>
    </Content>
  );

}

export default MembershipSettings;