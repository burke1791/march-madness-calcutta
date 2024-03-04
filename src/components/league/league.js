import React, { useEffect, useState } from 'react';

import LeagueNav from '../leagueNav/leagueNav';
import LeagueHome from '../leagueHome/leagueHome';
import LeagueAuction from '../leagueAuction/leagueAuction';
import MemberPage from '../memberPage/memberPage';

import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';

import { Button, Checkbox, Layout, Modal } from 'antd';

import LeagueSettings from '../../pages/leagueSettings/leagueSettings';
import { useSettingsDispatch } from '../../context/leagueSettingsContext';
import { API_CONFIG, AUCTION_SERVICE_ENDPOINTS, LEAGUE_SERVICE_ENDPOINTS, SUPPLEMENTAL_PAGES } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';
import { AuctionProvider } from '../../context/auctionContext';
import { genericContextUpdate } from '../../context/helper';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import useData from '../../hooks/useData';
import { WorldCupGroupStage } from '../../pages/tournaments';
import WorldCupKnockout from '../../pages/tournaments/worldCupKnockout/worldCupKnockout';
import MarchMadnessBracket from '../../pages/tournaments/marchMadnessBracket/marchMadnessBracket';
import LeagueTeams from '../leagueTeams/leagueTeams';
import { parseLeaguePathName } from '../../utilities/helper';

const { Content } = Layout;

const FEEDBACK_ACKNOWLEDGED_LOCALSTORAGE_KEY = 'feedback_acknowledged';

function League(props) {

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackAcknowledged, setFeedbackAcknowledged] = useState(null);
  const [feedbackModalAllowAuctionClose, setFeedbackModalAllowAuctionClose] = useState(false);
  const [isAuctionPage, setIsAuctionPage] = useState(true); // defaulting to true so that a race condition doesn't flash the modal for a split second

  const dispatch = useLeagueDispatch();
  const settingsDispatch = useSettingsDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { leagueId, leagueMetadataRefresh, leagueStatusId, roleId } = useLeagueState();
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

  const [auctionData, auctionDataReturnDate, fetchAuctionData] = useData({
    baseUrl: API_CONFIG.AUCTION_SERVICE_BASE_URL,
    endpoint: `${AUCTION_SERVICE_ENDPOINTS.FULL_PAYLOAD}/${leagueId}`,
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
    const { menuItem } = parseLeaguePathName(location.pathname);

    if (menuItem == 'auction') {
      // we don't want to show the feedback modal if the user is on the auction page
      setIsAuctionPage(true);
    } else {
      setIsAuctionPage(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (leagueId) {
      const isAcknowledged = JSON.parse(localStorage.getItem(`${FEEDBACK_ACKNOWLEDGED_LOCALSTORAGE_KEY}_${leagueId}`));
      console.log(isAcknowledged);

      setFeedbackAcknowledged(!!isAcknowledged);
    }
  }, [leagueId]);

  useEffect(() => {
    if (leagueId && feedbackAcknowledged !== null) {
      localStorage.setItem(`${FEEDBACK_ACKNOWLEDGED_LOCALSTORAGE_KEY}_${leagueId}`, JSON.stringify(!!feedbackAcknowledged));
    }
  }, [leagueId, feedbackAcknowledged]);

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
    if (leagueMetadataReturnDate && leagueMetadata) {
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

  useEffect(() => {
    if (leagueStatusId == 2 && feedbackAcknowledged === false && !isAuctionPage) {
      setFeedbackModalOpen(true);
    }
  }, [leagueStatusId, feedbackAcknowledged, isAuctionPage]);

  useEffect(() => {
    if (leagueStatusId == 2 && roleId <= 2) {
      fetchAuctionData();
    }
  }, [leagueStatusId, roleId]);

  useEffect(() => {
    if (auctionData && auctionDataReturnDate) {
      let available = 0;

      auctionData.slots.forEach(t => {
        if (t.price == null) available++;
      });

      console.log('available:', available);

      if (available == 0 && leagueStatusId == 2) {
        setFeedbackAcknowledged(false);
      }
    }
  }, [auctionDataReturnDate, auctionData, leagueStatusId, roleId]);

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

  const dismissModal = () => {
    setFeedbackModalOpen(false);
  }

  const onFeedbackAcknowledgedChange = (event) => {
    setFeedbackAcknowledged(event.target.checked);
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
      <Modal
        okText='Dismiss'
        title='Auction in progress'
        open={feedbackModalOpen}
        onCancel={dismissModal}
        onOk={dismissModal}
        footer={[
          <Checkbox key='acknowledge_checkbox' onChange={onFeedbackAcknowledgedChange}>Don't show again</Checkbox>,
          <Button key='dismiss_button' type='primary' onClick={dismissModal}>Dismiss</Button>
        ]}
      >
        This league currently has an auction in progress. Auction results will not appear here until a league admin closes the auction.
      </Modal>
    </Layout>
  );
}

export default League;