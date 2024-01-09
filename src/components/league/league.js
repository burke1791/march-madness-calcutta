import React, { Fragment, useEffect } from 'react';

import LeagueNav from '../leagueNav/leagueNav';
import LeagueHome from '../leagueHome/leagueHome';
import LeagueAuction from '../leagueAuction/leagueAuction';
import MemberPage from '../memberPage/memberPage';

import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';

import { Layout } from 'antd';

import LeagueSettings from '../../pages/leagueSettings/leagueSettings';
import { useSettingsDispatch } from '../../context/leagueSettingsContext';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS, SUPPLEMENTAL_PAGES } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';
import { AuctionProvider } from '../../context/auctionContext';
import { genericContextUpdate } from '../../context/helper';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import useData from '../../hooks/useData';
import { WorldCupGroupStage } from '../../pages/tournaments';
import WorldCupKnockout from '../../pages/tournaments/worldCupKnockout/worldCupKnockout';
import MarchMadnessBracket from '../../pages/tournaments/marchMadnessBracket/marchMadnessBracket';
import LeagueTeams from '../leagueTeams/leagueTeams';

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

  const [leagueMetadata, leagueMetadataReturnDate, fetchLeagueMetadata] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.LEAGUE_METADATA}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated, !!leagueId]
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
    if (authenticated === false) {
      navigate('/');
    }
  }, [authenticated]);

  useEffect(() => {
    if (!!leagueId && authenticated) {
      // fetchMetadata(leagueId);
      fetchLeagueMetadata();
    }
  }, [leagueId, authenticated, leagueMetadataRefresh]);

  useEffect(() => {
    if (leagueMetadataReturnDate) {
      console.log(leagueMetadata);
      updateMetadataInContext(leagueMetadata);
    }
  }, [leagueMetadata, leagueMetadataReturnDate]);

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
            return <Route key={page.ReactComponentKey} path={page.PathName} element={<WorldCupKnockout />} />;
          case 'march-madness-bracket':
            return <Route key={page.ReactComponentKey} path={page.PathName} element={<MarchMadnessBracket />} />;
          default:
            return null;
        }
      });
    }

    return null;
  }

  const updateMetadataInContext = (metadata) => {
    let status = genericContextUpdate(metadata, dispatch);

    if (status.success) {
      dispatch({ type: 'update', key: 'leagueMetadataUpdated', value: new Date().valueOf() });
    }
  }

  return (
    <Layout style={{ minHeight: 'calc(100vh - 64px)', height: '100%' }}>
      <LeagueNav />
      <Layout>
        <Content style={{ minHeight: 'calc(100vh - 64px)', height: '100%', overflow: 'auto' }}>
          <Routes>
            <Route path='/' element={<LeagueHome />} />
            <Route path='auction' element={
                <AuctionProvider>
                  <LeagueAuction path='/' />
                </AuctionProvider>
              } 
            />
            <Route path='teams' element={<LeagueTeams />} />

            {constructRoutes()}

            <Route path='member/:userId' element={<MemberPage />} />
            <Route path='settings/*' element={<LeagueSettings />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

export default League;