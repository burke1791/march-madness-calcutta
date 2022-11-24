import React, { Fragment, useEffect } from 'react';

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
import { useSettingsDispatch } from '../../context/leagueSettingsContext';
import LeagueService from '../../services/league/league.service';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS, SUPPLEMENTAL_PAGES } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';
import { AuctionProvider } from '../../context/auctionContext';
import { leagueServiceHelper } from '../../services/league/helper';
import { genericContextUpdate } from '../../context/helper';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import useData from '../../hooks/useData';
import { WorldCupGroupStage } from '../../pages/tournaments';

const { Content } = Layout;

function League(props) {

  const dispatch = useLeagueDispatch();
  const settingsDispatch = useSettingsDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { leagueId, leagueMetadataRefresh } = useLeagueState();
  const { authenticated } = useAuthState();

  const [supplementalPages, supplementalPagesReturnDate, fetchSupplementalPages] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_SUPPLEMENTAL_PAGES}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated, leagueId]
  });

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

  useEffect(() => {
    if (!!leagueId && authenticated) {
      fetchSupplementalPages();
    }
  }, [leagueId, authenticated]);

  useEffect(() => {
    if (supplementalPagesReturnDate) {
      syncSupplementalPagesInContext();
    }
  }, [supplementalPagesReturnDate]);

  const syncSupplementalPagesInContext = () => {
    if (supplementalPages && supplementalPages.length > 0) {
      const pages = [];
      for (let page of supplementalPages) {
        if (SUPPLEMENTAL_PAGES.indexOf(page.ReactComponentKey) !== -1) {
          pages.push({
            displayName: page.PageName,
            path: page.PathName,
            displayOrder: page.DisplayOrder
          });
        }
      }

      pages.sort((a, b) => a.displayOrder - b.displayOrder);

      if (pages.length > 0) {
        dispatch({ type: 'update', key: 'supplementalPages', value: pages });
        dispatch({ type: 'update', key: 'supplementalPagesSync', value: new Date().valueOf() });
      }
    }
  }

  const cleanupContext = () => {
    dispatch({ type: 'clear' });
    settingsDispatch({ type: 'clear' });
  }

  const constructRoutes = () => {
    if (supplementalPages && supplementalPages.length > 0) {
      return supplementalPages.map(page => {
        switch (page.ReactComponentKey) {
          case 'world-cup-group-stage':
            return <Route key={page.ReactComponentKey} path={page.PathName} element={<WorldCupGroupStage />} />;
          case 'world-cup-knockout':
            return <Route key={page.ReactComponentKey} path={page.PathName} element={<WorldCupGroupStage />} />;
          default:
            return null;
        }
      });
    }

    return null;
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

              {constructRoutes()}

              {/* <Route path='bracket' element={<Tournament />} /> */}
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