import React, { useEffect, useState, memo } from 'react';
import { Row, Col, Button, Table, Typography, Divider, Layout } from 'antd';

import './main.css';

import LeagueModal from '../leagueModal/leagueModal';

import { NOTIF, LEAGUE_FORM_TYPE, LEAGUE_SERVICE_ENDPOINTS, API_CONFIG } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { leagueTableColumns } from './leagueTableColumns';
import { useAuthState, } from '../../context/authContext';
import { useNavigate } from 'react-router-dom';
import useData from '../../hooks/useData';
import { parseLeagueSummaries } from '../../parsers/league';

const { Title } = Typography;

function Main() {

  const [loading, setLoading] = useState(true);
  const [activeLeagueSummaries, setActiveLeagueSummaries] = useState([
    {
      id: 0,
      name: 'You haven\'t joined any leagues yet',
      buyIn: null,
      payout: null,
      netReturn: null
    }
  ]);
  const [inactiveLeagueSummaries, setInactiveLeagueSummaries] = useState([]);

  const { authenticated, alias } = useAuthState();
  const navigate = useNavigate(); 

  const [leagueSummaries, leagueSummariesReturnDate, fetchLeagueSummaries] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: LEAGUE_SERVICE_ENDPOINTS.LEAGUE_SUMMARIES,
    method: 'GET',
    processData: parseLeagueSummaries,
    conditions: [authenticated]
  });

  useEffect(() => {
    if (leagueSummaries && leagueSummariesReturnDate) {
      console.log(leagueSummaries);
      if (leagueSummaries?.active?.length) {
        setActiveLeagueSummaries(leagueSummaries.active);
      }

      if (leagueSummaries?.inactive?.length) {
        setInactiveLeagueSummaries(leagueSummaries.inactive);
      }

      setLoading(false);
    }
  }, [leagueSummaries, leagueSummariesReturnDate]);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_JOINED, Main, handleLeagueJoin);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_JOINED, Main);
    });
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchLeagueSummaries();
    } else if (authenticated === false) {
      handleSignout();
      setLoading(false);
    }
  }, [authenticated]);

  const handleLeagueJoin = () => {
    fetchLeagueSummaries();
  }

  // empties league summaries info on signout,
  // which triggers a rerender to show the default table on the main page
  const handleSignout = () => {
    setActiveLeagueSummaries([]);
    setInactiveLeagueSummaries([]);
    setLoading(false);
    navigate('/');
  }

  const newLeague = () => {
    console.log('new league clicked');
    if (authenticated) {
      Pubsub.publish(NOTIF.LEAGUE_MODAL_SHOW, LEAGUE_FORM_TYPE.CREATE);
    } else {
      alert('Please sign in to create a league');
    }
  }

  const joinLeague = () => {
    console.log('join league clicked');
    if (authenticated) {
      Pubsub.publish(NOTIF.LEAGUE_MODAL_SHOW, LEAGUE_FORM_TYPE.JOIN);
    } else {
      alert('Please sign in to join a league');
    }
  }

  return (
    <div style={{ overflowY: 'scroll', paddingBottom: 16 }}>
      <Row type='flex' justify='center'>
        <Title level={1}>{alias}</Title>
      </Row>
      <Row type='flex' justify='center'>
        <Button type='primary' onClick={newLeague} style={{ margin: '20px 12px' }}>Start a League</Button>
        <Button type='primary' onClick={joinLeague} style={{ margin: '20px 12px' }}>Join a League</Button>
      </Row>
      <Row type='flex' justify='center' gutter={[12, 8]}>
        <Col md={24} lg={20} xl={18} xxl={12}>
          <Divider orientation='left'>Active Leagues</Divider>
          <LeagueSummaries leagueSummaries={activeLeagueSummaries} loading={loading} scrollY={500} />
          <Divider orientation='left'>Past Leagues</Divider>
          <LeagueSummaries leagueSummaries={inactiveLeagueSummaries} loading={loading} scrollY={500} />
        </Col>
      </Row>
      <LeagueModal />
    </div>
  );
}


const LeagueSummaries = memo(function LeagueSummaries(props) {

  const navigate = useNavigate();

  return (
    <Table
      columns={leagueTableColumns} 
      dataSource={props.leagueSummaries} 
      size='small'
      pagination={false}
      loading={props.loading}
      rowKey='id'
      rowClassName='pointer'
      scroll={{ y: props.scrollY }}
      onRow={
        (record) => {
          return {
            onClick: (event) => {
              // utilize the router to go to the league page
              if (record.id > 0) {
                navigate(`/leagues/${record.id}`, { state: { roleId: record.roleId, tournamentId: record.tournamentId }});
              }
            }
          };
        }
      }
    />
  );
});

export default Main;