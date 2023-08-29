import React, { useEffect, useState } from 'react';
import { Button, Col, message, Popconfirm, Row, Typography } from 'antd';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

function LeagueDelete(props) {

  const [loading, setLoading] = useState(false);

  const { leagueId } = useLeagueState();
  const { authenticated } = useAuthState();
  const navigate = useNavigate();

  const [deleteLeagueResponse, deleteLeagueReturnDate, deleteLeague] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.DELETE_LEAGUE}/${leagueId}`,
    method: 'POST',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (deleteLeagueReturnDate) {
      setLoading(false);

      if (deleteLeagueResponse?.length > 0 && deleteLeagueResponse[0]?.Error) {
        message.error(deleteLeagueResponse[0].Error);
      } else {
        navigate('/home');
      }
    }
  }, [deleteLeagueReturnDate, deleteLeagueResponse]);

  const sendDeleteLeagueRequest = () => {
    setLoading(true);
    deleteLeague();
  }

  return (
    <Row justify='space-between'>
      <Col>
        <Title level={4}>Delete League</Title>
      </Col>
      <Col>
        <Popconfirm
          title='Are you sure?'
          onConfirm={sendDeleteLeagueRequest}
          okText='Delete'
          okButtonProps={{ danger: true }}
        >
          <Button
            type='primary'
            danger
            loading={loading}
          >
            Delete
          </Button>
        </Popconfirm>
      </Col>
    </Row>
  )
}

export default LeagueDelete;