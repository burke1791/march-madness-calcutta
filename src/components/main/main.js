import React, { useEffect, useState } from 'react';
import { Row, Button, Table } from 'antd';
import 'antd/dist/antd.css';

import LeagueModal from '../leagueModal/leagueModal';

import { NOTIF, LEAGUE_FORM_TYPE, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { User } from '../../utilities/authService';
import { Redirect, navigate } from '@reach/router';
import LeagueService from '../../services/league/league.service';
import { leagueTableColumns } from './leagueTableColumns';
import { useAuthState, useAuthDispatch } from '../../context/authContext';
import { leagueServiceHelper } from '../../services/league/helper';
import { genericContextUpdate } from '../../context/helper';

function Main() {

  const [loading, setLoading] = useState(true);
  const [leagueSummaries, setLeagueSummaries] = useState([
    {
      id: 0,
      name: 'You haven\'t joined any leagues yet',
      buyIn: null,
      payout: null,
      netReturn: null
    }
  ]);

  const authDispatch = useAuthDispatch();

  const { authenticated } = useAuthState();  

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
    } else {
      setLoading(false);
    }
  }, [authenticated]);

  const handleLeagueJoin = () => {
    fetchLeagueSummaries();
  }

  const fetchLeagueSummaries = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_SUMMARIES).then(response => {
      let userId = {
        userId: leagueServiceHelper.extractUserId(response.data)
      }
      genericContextUpdate(userId, authDispatch);

      let leagueArr = leagueServiceHelper.packageLeagueSummaries(response.data);
      if (leagueArr.length) {
        setLeagueSummaries(leagueArr);
      }
      setLoading(false);
    }).catch(error => {
      console.log(error);
    })
  }

  // empties league summaries info on signout,
  // which triggers a rerender to show the default table on the main page
  const handleSignout = () => {
    setLeagueSummaries([]);
    setLoading(false);
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
            size='small'
            pagination={false}
            loading={loading}
            rowKey='id'
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