import React, { useEffect, useState } from 'react';
import { Col, Layout, Row, Table } from 'antd';
import { useLeagueState } from '../../context/leagueContext';
import LeagueHeader from '../league/leagueHeader';
import PrizepoolCards from './prizepoolCards';
import { useAuthState } from '../../context/authContext';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { parseLeagueTeamPayouts } from '../../services/league/parsers/leagueTeamPayouts';
import { ButtonTableCell } from '../buttonTableCell';
import { formatMoney } from '../../utilities/helper';
import TeamPayoutModal from './payoutModal';

const { Content } = Layout;
const { Column } = Table;

function LeagueTeams(props) {

  const [loading, setLoading] = useState(true);

  const [selectedTeamName, setSelectedTeamName] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [selectedTeamOwner, setSelectedTeamOwner] = useState(null);
  const [selectedTeamPayouts, setSelectedTeamPayouts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const { authenticated } = useAuthState();
  const { leagueId, leagueName, roleId } = useLeagueState();

  const [teams, teamsReturnDate, fetchTeams] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_TEAM_PAYOUTS}/${leagueId}`,
    method: 'GET',
    processData: parseLeagueTeamPayouts,
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (authenticated, leagueId) {
      fetchTeams();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    if (teamsReturnDate) {
      console.log(teams);
      setLoading(false);
    }
  }, [teamsReturnDate]);

  const getPayoutButtonText = () => {
    if (roleId == 1 || roleId == 2) {
      return 'Pay Team'
    }

    return 'View Payouts';
  }

  const dismissModal = () => {
    setModalOpen(false);
  }

  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <Content style={{ overflowX: 'hidden' }}>
        <PrizepoolCards prizepool={5500} totalAwarded={5000.69} />
        <Row type='flex' justify='center' style={{ marginTop: 16 }}>
          <Col md={20} xxl={16}>
            <Table
              pagination={false}
              dataSource={teams}
              size='small'
              loading={loading}
              rowKey='TeamId'
            >
              <Column
                title='Team'
                dataIndex='TeamName'
              />
              <Column
                title='Owner'
                dataIndex='Username'
              />
              <Column
                title='Current Payout'
                dataIndex='totalPayout'
                render={(value) => {
                  return formatMoney(value);
                }}
              />
              <Column
                align='right'
                render={(text, record) => {
                  return (
                    <ButtonTableCell
                      type='primary'
                      size='small'
                      animated={false}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedTeamName(record.TeamName);
                        setSelectedTeamId(record.TeamId);
                        setSelectedTeamOwner(record.Username);
                        setSelectedTeamPayouts(record.payouts);
                        setModalOpen(true);
                      }}
                    >
                      {getPayoutButtonText()}
                    </ButtonTableCell>
                  );
                }}
              />
            </Table>
            <TeamPayoutModal
              teamName={selectedTeamName}
              teamId={selectedTeamId}
              ownerUsername={selectedTeamOwner}
              payouts={selectedTeamPayouts}
              open={modalOpen}
              dismiss={dismissModal}
            />
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}

export default LeagueTeams;