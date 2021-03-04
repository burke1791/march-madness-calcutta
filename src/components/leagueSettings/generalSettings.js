import React, { useEffect, useState } from 'react';
import { Col, Divider, Layout, Row, Table, Typography } from 'antd';
import 'antd/dist/antd.css';
import LeagueHeader from '../league/leagueHeader';
import { useLeagueState } from '../../context/leagueContext';

const { Title } = Typography;
const { Content } = Layout;

function GeneralSettings() {

  const { leagueName } = useLeagueState();

  const [leagueNameText, setLeagueNameText] = useState(leagueName);
  const [leagueNameEdited, setLeagueNameEdited] = useState(false);

  useEffect(() => {
    if (!leagueNameEdited) {
      setLeagueNameText(leagueName);
    }
  }, [leagueName])

  const leagueNameChange = (text) => {
    setLeagueNameText(text);
    setLeagueNameEdited(true);
    // fire API request to update league name
    // re-download league metadata
  }

  return (
    <Content>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Divider orientation='left'>Edit League Name</Divider>
          <Row style={{ paddingLeft: 12, paddingRight: 12 }}>
            <Title
              level={4}
              editable={{
                maxLength: 128,
                onChange: leagueNameChange
              }}
            >
              {leagueNameText}
            </Title>
          </Row>
          <Divider orientation='left'>League Members</Divider>
          {/* <Row>
            <Table

            />
          </Row> */}
        </Col>
      </Row>
    </Content>
  );
}

export default GeneralSettings;