import React from 'react';
import { Col, Divider, Layout, Row } from 'antd';
import EditableLeagueName from '../../components/editableLeagueName/editableLeagueName';
import LeagueInviteInfo from '../../components/leagueInviteInfo/leagueInviteInfo';
import { useLeagueState } from '../../context/leagueContext';
import LeagueDelete from '../../components/leagueDelete/leagueDelete';

const { Content } = Layout;

function GeneralSettings() {

  const { roleId } = useLeagueState();

  return (
    <Content style={{ paddingBottom: 12 }}>
      { roleId == 1 || roleId == 2 ? (
        <Row justify='center' style={{ marginTop: 8 }}>
          <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
            <LeagueDelete />
          </Col>
        </Row>
      ) : null
      }
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
    </Content>
  )
}

export default GeneralSettings;