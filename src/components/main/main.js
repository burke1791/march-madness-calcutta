import React, { Fragment, useEffect, useState, memo } from 'react';
import { Row, Col, Button, Table, message, Typography, List, Card, Statistic, Divider } from 'antd';
import 'antd/dist/antd.css';
import './main.css';

import LeagueModal from '../leagueModal/leagueModal';

import { NOTIF, LEAGUE_FORM_TYPE, LEAGUE_SERVICE_ENDPOINTS, USER_SERVICE_ENDPOINTS } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { User } from '../../utilities/authService';
import { Redirect, navigate } from '@reach/router';
import LeagueService from '../../services/league/league.service';
import { leagueTableColumns } from './leagueTableColumns';
import { useAuthState, useAuthDispatch } from '../../context/authContext';
import { leagueServiceHelper } from '../../services/league/helper';
import { genericContextUpdate } from '../../context/helper';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import UserService from '../../services/user/user.service';

const { Title, Text } = Typography;

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

  useEffect(() => {
    Pubsub.subscribe(NOTIF.SIGN_OUT, Main, handleSignout);
    Pubsub.subscribe(NOTIF.LEAGUE_JOINED, Main, handleLeagueJoin);

    return (() => {
      Pubsub.unsubscribe(NOTIF.SIGN_OUT, Main);
      Pubsub.unsubscribe(NOTIF.LEAGUE_JOINED, Main);
    });
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchLeagueSummaries();
    } else if (authenticated === false) {
      setLoading(false);
    }
  }, [authenticated]);

  const handleLeagueJoin = () => {
    fetchLeagueSummaries();
  }

  const fetchLeagueSummaries = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_SUMMARIES).then(response => {
      const activeLeagues = leagueServiceHelper.packageLeagueSummaries(response.data.active);
      const inactiveLeagues = leagueServiceHelper.packageLeagueSummaries(response.data.inactive);

      if (activeLeagues.length) {
        setActiveLeagueSummaries(activeLeagues);
      }

      if (inactiveLeagues.length) {
        setInactiveLeagueSummaries(inactiveLeagues);
      }

      setLoading(false);
    }).catch(error => {
      message.error('Error downloading league data, please try again later');
      setLoading(false);
      console.log(error);
    })
  }

  // empties league summaries info on signout,
  // which triggers a rerender to show the default table on the main page
  const handleSignout = () => {
    setActiveLeagueSummaries([]);
    setInactiveLeagueSummaries([]);
    setLoading(false);
    // navigate('/');
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

  if (authenticated == undefined || authenticated) {
    return (
      <div>
        <Row type='flex' justify='center'>
          <Title level={1}>{alias}</Title>
        </Row>
        <Row type='flex' justify='center'>
          <Button type='primary' onClick={newLeague} style={{ margin: '20px 12px' }}>Start a League</Button>
          <Button type='primary' onClick={joinLeague} style={{ margin: '20px 12px' }}>Join a League</Button>
        </Row>
        <Row type='flex' justify='center' gutter={[12, 8]}>
          {/* <Col span={6}>
            <UpcomingGamesList />
          </Col> */}
          <Col md={24} lg={20} xl={18} xxl={12}>
            <Divider orientation='left'>Active Leagues</Divider>
            <LeagueSummaries leagueSummaries={activeLeagueSummaries} loading={loading} />
            <Divider orientation='left'>Past Leagues</Divider>
            <LeagueSummaries leagueSummaries={inactiveLeagueSummaries} loading={loading} />
          </Col>
          {/* <Col span={6}>
            <LifetimeStats />
          </Col> */}
        </Row>
        <LeagueModal />
      </div>
    );
  } else {
    return (
      <Redirect to='/' noThrow />
    );
  }
  
}


function UpcomingGamesList() {

  const [loading, setLoading] = useState(true);
  const [upcomingGames, setUpcomingGames] = useState([]);

  const { authenticated } = useAuthState();

  useEffect(() => {
    if (authenticated) {
      getUserUpcomingGames();
    }
  }, [authenticated]);

  // call upcoming games user service endpoint
  const getUserUpcomingGames = () => {
    setLoading(true);

    UserService.callApiWithPromise(USER_SERVICE_ENDPOINTS.GET_USER_UPCOMING_GAMES).then(response => {
      console.log(response);
      setLoading(false);
    }).catch(error => {
      console.log(error);
      setLoading(false);
      message.error('Unable to load upcoming games');
    });
  }

  return (
    <List 
      size='large'
      header='Upcoming Games'
      bordered
      dataSource={upcomingGames}
      loading={loading}
      renderItem={game => <UpcomingGameListItem eventDate={game.eventDate} teams={game.teams} />}
    />
  );
}

function UpcomingGameListItem(props) {

  const { userId } = useAuthState();

  return (
    <List.Item>
      <div className='upcoming-header'>
        <Row type='flex'>
          <Col>
            <Text>{props.eventDate}</Text>
          </Col>
        </Row>
      </div>
      <div className='upcoming-main'>
        <Row type='flex'>
          <Col span={11}>
            <UpcomingGameListItemTeam team={props.teams[0]} isOwner={props.teams[0].owner == userId} />
          </Col>
          <Col span={2}>
            <Text>vs.</Text>
          </Col>
          <Col span={11}>
            <UpcomingGameListItemTeam team={props.teams[1]} isOwner={props.teams[1].owner == userId} />
          </Col>
        </Row>
      </div>
    </List.Item>
  );
}

function UpcomingGameListItemTeam(props) {

  const getClassName = () => {
    return props.isOwner ? 'upcoming-team-owner' : 'upcoming-team';
  }

  return (
    <div className={getClassName()}>
      <Row type='flex' justify='center'>
        <img src={props.team.logoUrl}></img>
      </Row>
      <Row type='flex' justify='center'>
        {props.team.displayName}
      </Row>
    </div>
  );
}


const LeagueSummaries = memo(function LeagueSummaries(props) {

  return (
    <Table
      columns={leagueTableColumns} 
      dataSource={props.leagueSummaries} 
      size='small'
      pagination={false}
      loading={props.loading}
      rowKey='id'
      rowClassName='pointer'
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


function LifetimeStats() {

  const { lifetimeBuyIn, lifetimePayout, lifetimeTax } = useAuthState();

  const getRoi = () => {
    if (lifetimeBuyIn == undefined || lifetimePayout == undefined) return 0;

    return (lifetimePayout - lifetimeBuyIn) / lifetimeBuyIn * 100;
  }

  const getRoiStyle = () => {
    if (getRoi() >= 0) {
      return { color: '#3f8600' };
    }

    return { color: '#cf1322' };
  }

  const getRoiPrefix = () => {
    if (getRoi() >= 0) {
      return <ArrowUpOutlined />;
    }

    return <ArrowDownOutlined />;
  }

  return (
    <Fragment>
      <Row type='flex' justify='center' gutter={[0,12]}>
        <Col span={24}>
          <Card style={{ textAlign: 'center' }}>
            <Statistic
              title='Lifetime Buy-In'
              value={lifetimeBuyIn}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix='$'
            />
          </Card>
        </Col>
      </Row>
      <Row type='flex' justify='center' gutter={[0,12]}>
        <Col span={24}>
          <Card style={{ textAlign: 'center' }}>
            <Statistic
              title='Lifetime Payout'
              value={lifetimePayout}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix='$'
            />
          </Card>
        </Col>
      </Row>
      <Row type='flex' justify='center' gutter={[0,12]}>
        <Col span={24}>
          <Card style={{ textAlign: 'center' }}>
            <Statistic
              title='Lifetime Return'
              value={getRoi()}
              precision={1}
              valueStyle={getRoiStyle()}
              prefix={getRoiPrefix()}
              suffix='%'
            />
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
}

export default Main;