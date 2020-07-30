import React, { useEffect, useState } from 'react';
import { Row, Col, Button, Table, Typography } from 'antd';
import 'antd/dist/antd.css';

import LeagueModal from '../leagueModal/leagueModal';

import { NOTIF, LEAGUE_FORM_TYPE, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { User } from '../../utilities/authService';
import { Redirect, navigate } from '@reach/router';
import LeagueService from '../../services/league/league.service';
import { Data, leaguesFetched } from '../../services/league/endpoints';
import { leagueTableColumns } from './leagueTableColumns';

function Main() {

  const [loading, setLoading] = useState(true);
  const [leagueSummaries, setLeagueSummaries] = useState([
    {
      key: 0,
      name: 'You haven\'t joined any leagues yet',
      buyIn: null,
      payout: null,
      return: null
    }
  ]);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.SIGN_IN, Main, handleSignin);
    Pubsub.subscribe(NOTIF.SIGN_OUT, Main, handleSignout);
    Pubsub.subscribe(NOTIF.LEAGUE_JOINED, Main, handleLeagueJoin);
    Pubsub.subscribe(NOTIF.LEAGUE_SUMMARIES_FETCHED, Main, handleNewLeagueInfo);

    return (() => {
      Pubsub.unsubscribe(NOTIF.SIGN_IN, Main);
      Pubsub.unsubscribe(NOTIF.SIGN_OUT, Main);
      Pubsub.unsubscribe(NOTIF.LEAGUE_JOINED, Main);
      Pubsub.unsubscribe(NOTIF.LEAGUE_SUMMARIES_FETCHED, Main);
    });
  }, []);

  useEffect(() => {
    handleNewLeagueInfo();
  }, []);

  const fetchLeagueInfo = (override = false) => {
    LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_SUMMARIES, { override });
  }

  const handleLeagueJoin = () => {
    fetchLeagueInfo(true);
  }

  // copy the summary info from Data into local state, which triggers a rerender
  const handleNewLeagueInfo = () => {
    if (Data.leagues && Data.leagues.length) {
      setLeagueSummaries(
        (() => {
          return Data.leagues.map(league => {
            return {
              name: league.name,
              buyIn: league.buyIn, //formatMoney(league.buyIn || '0'),
              payout: league.payout, //formatMoney(league.payout || '0'),
              return: league.payout - league.buyIn, //formatMoney(league.payout - league.buyIn),
              roleId: league.roleId,
              auctionId: league.auctionId,
              tournamentId: league.tournamentId,
              key: league.id
            };
          });
        })()
      );
      setLoading(false);
    } else if (leaguesFetched) {
      // user does not belong to any leagues
      setLoading(false);
    } else {
      // in case this component gets rendered after the sign in notification
      fetchLeagueInfo();
    }
  }

  // loads in league summary info from global state
  // and rerenders the table on the main page
  const handleSignin = () => {
    fetchLeagueInfo();
  }

  // empties league summaries info on signout,
  // which triggers a rerender to show the default table on the main page
  const handleSignout = () => {
    setLeagueSummaries([]);
    // navigate('/');
  }

  const newLeague = () => {
    console.log('new league clicked');
    if (User.authenticated) {
      Pubsub.publish(NOTIF.LEAGUE_MODAL_SHOW, LEAGUE_FORM_TYPE.CREATE);
    } else {
      alert('Please sign in to create a league');
    }
  }

  const joinLeague = () => {
    console.log('join league clicked');
    if (User.authenticated) {
      Pubsub.publish(NOTIF.LEAGUE_MODAL_SHOW, LEAGUE_FORM_TYPE.JOIN);
    } else {
      alert('Please sign in to join a league');
    }
  }

  if (User.authenticated == undefined || User.authenticated) {
    return (
      <div>
        <Row type='flex' justify='center'>
          <Button type='primary' onClick={newLeague} style={{ margin: '20px 12px' }}>Start a League</Button>
          <Button type='primary' onClick={joinLeague} style={{ margin: '20px 12px' }}>Join a League</Button>
        </Row>
        <Row type='flex' justify='center'>
          <Table 
            columns={leagueTableColumns} 
            dataSource={leagueSummaries} 
            size='middle' 
            pagination={false}
            loading={loading}
            onRow={
              (record) => {
                return {
                  onClick: (event) => {
                    // utilize the router to go to the league page
                    if (record.key > 0) {
                      navigate(`/leagues/${record.key}`, { state: { auctionId: record.auctionId, roleId: record.roleId, tournamentId: record.tournamentId }});
                    }
                  }
                };
              }
            }
          />
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

export default Main;