import React, { Fragment, useEffect, useState, memo } from 'react';
import { Row, Col, Button, Table, message, Typography, List, Card, Statistic, Divider, Layout, Popover } from 'antd';
import './main.css';

import LeagueModal from '../leagueModal/leagueModal';

import { NOTIF, LEAGUE_FORM_TYPE, LEAGUE_SERVICE_ENDPOINTS, USER_SERVICE_ENDPOINTS } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import LeagueService from '../../services/league/league.service';
import { leagueTableColumns } from './leagueTableColumns';
import { useAuthState, } from '../../context/authContext';
import { leagueServiceHelper } from '../../services/league/helper';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import UserService from '../../services/user/user.service';
import Team from '../team/team';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Content } = Layout;

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

      if (activeLeagues && activeLeagues.length) {
        setActiveLeagueSummaries(activeLeagues);
      }

      if (inactiveLeagues && inactiveLeagues.length) {
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
      <div style={{ overflowY: 'scroll', paddingBottom: 16 }}>
        <Row type='flex' justify='center'>
          <Title level={1}>{alias}</Title>
        </Row>
        <Row type='flex' justify='center'>
          <Button type='primary' onClick={newLeague} style={{ margin: '20px 12px' }}>Start a League</Button>
          <Button type='primary' onClick={joinLeague} style={{ margin: '20px 12px' }}>Join a League</Button>
        </Row>
        <Row type='flex' justify='center' gutter={[12, 8]}>
          {/* <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={6}>
            <UpcomingGamesList />
          </Col> */}
          <Col md={24} lg={20} xl={18} xxl={12}>
            <Divider orientation='left'>Active Leagues</Divider>
            <LeagueSummaries leagueSummaries={activeLeagueSummaries} loading={loading} scrollY={500} />
            <Divider orientation='left'>Past Leagues</Divider>
            <LeagueSummaries leagueSummaries={inactiveLeagueSummaries} loading={loading} scrollY={500} />
          </Col>
          {/* <Col xs={0} sm={0} md={0} lg={0} xl={0} xxl={6}>
            <LifetimeStats />
          </Col> */}
        </Row>
        <LeagueModal />
      </div>
    );
  } else {
    return navigate('/');
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
      setUpcomingGames(response.data);
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
      renderItem={game => {
        return (
          <Popover content={<UpcomingGamePopover />}>
            <UpcomingGameListItem eventDate={game.eventDate} teams={game.teams} />
          </Popover>
        );
      }}
    />
  );
}

function UpcomingGamePopover(props) {

  return (
    <Fragment>
      <Row justify='center'>
        <Col>
          <Text strong>{props.eventDate}</Text>
        </Col>
      </Row>
      <Row justify='center'>
        <Col span={11}>
          <Team imageSrc={props.team1LogoUrl} name={props.team1DisplayName} imgStyle={{ maxWidth: 50 }} />
        </Col>
        <Col span={2}>
          <Text style={{ textAlign: 'center' }}>vs.</Text>
        </Col>
        <Col span={11}>
          <Team imageSrc={props.team2LogoUrl} name={props.team2DisplayName} imgStyle={{ maxWidth: 50 }} />
        </Col>
      </Row>
    </Fragment>
  )
}

function UpcomingGameListItem(props) {

  const { userId } = useAuthState();

  return (
    <List.Item>
      <Content>
        <Row justify='center'>
          <Col>
            <Text strong>{props.eventDate}</Text>
          </Col>
        </Row>
        <Row justify='center' align='bottom'>
          <Col span={11}>
            <UpcomingGameListItemTeam team={props.teams[0]} isOwner={props.teams[0].ownerId == userId} />
          </Col>
          <Col span={2}>
            <Text style={{ textAlign: 'center' }}>vs.</Text>
          </Col>
          <Col span={11}>
            <UpcomingGameListItemTeam team={props.teams[1]} isOwner={props.teams[1].ownerId == userId} />
          </Col>
        </Row>
      </Content>
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
        <img style={{ maxWidth: 50 }} className='upcoming-logo' src={props.team.logoUrl}></img>
      </Row>
      <Row type='flex' justify='center'>
        {props.team.displayName}
      </Row>
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