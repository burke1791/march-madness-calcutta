import React, { useEffect } from 'react';

import LeagueNav from '../leagueNav/leagueNav';
import LeagueHome from '../leagueHome/leagueHome';
import LeagueAuction from '../leagueAuction/leagueAuction';
import Tournament from '../tournament/tournament';
import MessageBoard from '../messageBoard/messageBoard';
import MessageThread from '../messageThread/messageThread';
import MemberPage from '../memberPage/memberPage';

import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';

import { Layout } from 'antd';
import 'antd/dist/antd.css';
import { User } from '../../utilities/authService';
import LeagueSettings from '../../pages/leagueSettings/leagueSettings';
import { useSettingsDispatch, useSettingsState } from '../../context/leagueSettingsContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS, SETTING_TYPES } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';
import { AuctionProvider } from '../../context/auctionContext';
import { leagueServiceHelper } from '../../services/league/helper';
import { genericContextUpdate } from '../../context/helper';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

const { Content } = Layout;

function League(props) {

  const dispatch = useLeagueDispatch();
  const settingsDispatch = useSettingsDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { leagueId, leagueMetadataRefresh } = useLeagueState();
  const { settingsRefreshTrigger } = useSettingsState();
  const { authenticated } = useAuthState();

  useEffect(() => {
    // cannot use lookbehind because it causes issues on mobile (ugh)
    const parsedLeagueId = +location.pathname.match(/\d{1,}($|(?=\/))/ig)[0];
    genericContextUpdate({ leagueId: parsedLeagueId }, dispatch);

    return (() => {
      cleanupContext();
    });
  }, []);

  useEffect(() => {
    if (!!leagueId && authenticated) {
      fetchMetadata(leagueId);
    }
  }, [leagueId, authenticated, leagueMetadataRefresh]);

  const cleanupContext = () => {
    dispatch({ type: 'clear' });
    settingsDispatch({ type: 'clear' });
  }

  const fetchMetadata = (leagueId) => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_METADATA, { leagueId }).then(response => {
      let leagueMetadata = leagueServiceHelper.packageLeagueMetadata(response.data[0]);
      updateMetadataInContext(leagueMetadata);
    }).catch(error => {
      console.log(error);
    });
  }

  const updateMetadataInContext = (metadata) => {
    let status = genericContextUpdate(metadata, dispatch);

    if (status.success) {
      dispatch({ type: 'update', key: 'leagueMetadataUpdated', value: new Date().valueOf() });
    }
  }

  if (User.authenticated == undefined || User.authenticated) {
    return (
      <Layout style={{ minHeight: 'calc(100vh - 64px)', height: '100%' }}>
        <LeagueNav />
        <Layout>
          <Content>
            <Routes>
              <Route path='/' element={<LeagueHome />} />
              <Route path='auction' element={
                  <AuctionProvider>
                    <LeagueAuction path='/' />
                  </AuctionProvider>
                } 
              />
              <Route path='bracket' element={<Tournament />} />
              {/* <Route path='message_board' element={<MessageBoard leagueId={leagueId} role={role} />} /> */}
              {/* <Route path='message_board/:topicId' element={<MessageThread leagueId={leagueId} role={role} />} /> */}
              <Route path='member/:userId' element={<MemberPage />} />
              <Route path='settings/*' element={<LeagueSettings />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    );
  } else {
    return navigate('/');
  }
  
}

export default League;