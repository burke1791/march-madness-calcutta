import React from 'react';
import { Col, Divider, Layout, Row } from 'antd';
import EditableLeagueName from '../../components/editableLeagueName/editableLeagueName';
import LeagueInviteInfo from '../../components/leagueInviteInfo/leagueInviteInfo';

const { Content } = Layout;

function GeneralSettings() {

  return (
    <Content>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Divider orientation='left'>Edit League Name</Divider>
          <EditableLeagueName />
        </Col>
      </Row>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Divider orientation='left'>Invite Your Friends</Divider>
          <LeagueInviteInfo />
        </Col>
      </Row>
      {/* <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Divider orientation='left'>League Type</Divider>
          Placeholder
        </Col>
      </Row> */}
    </Content>
  )
}

export default GeneralSettings;