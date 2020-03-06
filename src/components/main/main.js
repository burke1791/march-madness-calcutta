import React, { useEffect, useState } from 'react';
import { Row, Col, Button } from 'antd';
import 'antd/dist/antd.css';

import LeagueTable from '../leagueTable/leagueTable';
import LeagueModal from '../leagueModal/leagueModal';

import { NOTIF, LEAGUE_FORM_TYPE } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { User } from '../../utilities/authService';
import { formatMoney } from '../../utilities/helper';
import { navigate } from '@reach/router/lib/history';
import { Redirect } from '@reach/router';
import { Data, getLeagueSummaries } from '../../utilities/leagueService';

function Main() {

  const [leagueSummaries, setLeagueSummaries] = useState([]);

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

  const fetchLeagueInfo = () => {
    if (User.authenticated) {
      getLeagueSummaries();
    }
  }

  const handleLeagueJoin = () => {
    fetchLeagueInfo();
  }

  // copy the summary info from Data into local state, which triggers a rerender
  const handleNewLeagueInfo = () => {
    if (Data.leagues && Data.leagues.length) {
      setLeagueSummaries(
        (() => {
          return Data.leagues.map(league => {
            return {
              name: league.name,
              buyIn: formatMoney(league.buyIn || '0'),
              payout: formatMoney(league.payout || '0'),
              return: formatMoney(league.buyIn && league.payout ? league.payout - league.buyIn : '0'),
              roleId: league.roleId,
              auctionId: league.auctionId,
              key: league.id
            };
          });
        })()
      );
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
          <LeagueTable type='in-progress' list={leagueSummaries} />
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