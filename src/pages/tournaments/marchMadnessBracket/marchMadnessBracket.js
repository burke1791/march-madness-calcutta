import React, { useEffect, useState } from 'react';
import { Col, Layout, message, Row, Skeleton } from 'antd';
import LeagueHeader from '../../../components/league/leagueHeader';
import { useLeagueState } from '../../../context/leagueContext';
import { useAuthState } from '../../../context/authContext';
import HighlightDropdown from '../common/highlightDropdown';
import useData from '../../../hooks/useData';
import { API_CONFIG, TOURNAMENT_SERVICE_ENDPOINTS } from '../../../utilities/constants';
import BracketFactory from '../../../components/bracket/bracket';

const { Content } = Layout;

function MarchMadnessBracket(props) {

  const [games, setGames] = useState(null);
  const [gamesLoading, setGamesLoading] = useState(true);

  const { authenticated } = useAuthState();
  const { leagueId, leagueName } = useLeagueState();

  const [bracket, bracketReturnDate, fetchBracket] = useData({
    baseUrl: API_CONFIG.TOURNAMENT_SERVICE_BASE_URL,
    endpoint: `${TOURNAMENT_SERVICE_ENDPOINTS.GET_MARCH_MADNESS_BRACKET}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (authenticated && leagueId) {
      fetchBracket();
      setGamesLoading(true);
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    if (bracketReturnDate) {
      console.log(bracket);

      if (bracket.bracket !== undefined) {
        setGames(bracket.bracket);
      } else if (bracket?.message == 'SERVER ERROR!') {
        message.error('Error downloading bracket. Try again later');
      }
      
      setGamesLoading(false);
    }
  }, [bracketReturnDate]);

  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <LeagueHeader class='secondary' text='Bracket' />
      <Content style={{ textAlign: 'center', minHeight: 'calc(100vh - 192px)', height: '100%' }}>
        <HighlightDropdown
          selectedUserKey='marchMadnessSelectedUser'
          selectPlaceholder='Highlight Teams'
        />
        <Row justify='center'>
          <Col span={24} style={{ overflow: 'auto' }}>
            {gamesLoading ? <Skeleton active /> : <BracketFactory games={games} />}
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default MarchMadnessBracket;