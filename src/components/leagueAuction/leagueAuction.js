import React, { useState, useEffect } from 'react';
import AuctionTeams from '../auctionTeams/auctionTeams';
import AuctionActions from '../auctionActions/auctionActions';
import AuctionChat from '../auctionChat/auctionChat';

import { Row, Col, message } from 'antd';

import MyTeams from '../myTeams/myTeams';
import MemberList from '../memberList/memberList';
import { AUCTION_SERVICE_ENDPOINTS, SOCKETS, API_CONFIG } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import withAuctionWebsocket from '../../HOC/withWebsocket';
import { useAuctionDispatch, useAuctionState } from '../../context/auctionContext';
import AuctionModal from './auctionModal';
import AuctionLoadingModal from './auctionLoadingModal';
import useData from '../../hooks/useData';
import { parseAuctionStatus } from '../../parsers/auction';
import { parseAuctionTeamsNew } from '../../parsers/auction/fetchAuctionTeams';

function LeagueAuction(props) {

  const [sidebarInUse, setSidebarInUse] = useState(true);

  const { leagueId } = useLeagueState();
  const { authenticated, userId } = useAuthState();
  const { errorMessage, connected } = useAuctionState();

  const auctionDispatch = useAuctionDispatch();

  const [auctionData, auctionDataReturnDate, fetchAuctionData] = useData({
    baseUrl: API_CONFIG.AUCTION_SERVICE_BASE_URL,
    endpoint: `${AUCTION_SERVICE_ENDPOINTS.FULL_PAYLOAD}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (errorMessage !== null && errorMessage !== undefined) {
      handleAuctionError(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (leagueId && authenticated && connected) {
      // fetchAllAuctionData();
      fetchAuctionData();
    }
  }, [leagueId, authenticated, connected]);

  useEffect(() => {
    if (auctionDataReturnDate && auctionData?.message == 'ERROR!') {
      console.log(auctionData);
      message.error('Unable to get auction data');
    } else if (auctionDataReturnDate) {
      console.log(auctionData);
      syncAuctionStatus(auctionData.status);
      syncAuctionTeams(auctionData.slots);
      syncAuctionSettings(auctionData.settings);
      syncAuctionUsers(auctionData.users);
    }
  }, [auctionData, auctionDataReturnDate]);

  useEffect(() => {
    if (auctionDataReturnDate && !!userId) {
      syncAuctionSummary(auctionData.users, userId);
    }
  }, [auctionData, auctionDataReturnDate, userId]);

  const syncAuctionStatus = (status) => {
    const parsedStatus = parseAuctionStatus([status]);
    const keys = Object.keys(parsedStatus);

    for (let key of keys) {
      auctionDispatch({ type: 'update', key: key, value: parsedStatus[key] });
    }

    auctionDispatch({ type: 'update', key: 'auctionStatusDownloadedDate', value: new Date().valueOf() });
  }

  const syncAuctionTeams = (teams) => {
    const parsedTeams = parseAuctionTeamsNew(teams);

    auctionDispatch({ type: 'update', key: 'teams', value: parsedTeams });
    auctionDispatch({ type: 'update', key: 'teamsDownloadedDate', value: new Date().valueOf() });
  }

  const syncAuctionSettings = (settings) => {
    if (!Array.isArray(settings) || settings.length == 0) return;

    auctionDispatch({ type: 'update', key: 'auctionSettings', value: settings });
    auctionDispatch({ type: 'update', key: 'auctionSettingsDownloadedDate', value: new Date().valueOf() });
  }

  const syncAuctionSummary = (users, userId) => {
    if (!Array.isArray(users) || users.length == 0) return;

    const thisUser = users.find(u => u.userId == userId);
    if (thisUser != undefined) {
      auctionDispatch({ type: 'update', key: 'naturalBuyIn', value: thisUser.naturalBuyIn });
      auctionDispatch({ type: 'update', key: 'taxBuyIn', value: thisUser.taxBuyIn });
    }

    let prizepool = 0;

    users.forEach(u => {
      prizepool += u.naturalBuyIn;
      prizepool += u.taxBuyIn;
    });

    auctionDispatch({ type: 'update', key: 'prizepool', value: prizepool });
  }

  const syncAuctionUsers = (users) => {
    if (!Array.isArray(users) || users.length == 0) return;

    auctionDispatch({ type: 'update', key: 'memberBuyIns', value: users });
    auctionDispatch({ type: 'update', key: 'auctionBuyInsDownloadedDate', value: new Date().valueOf() });
  }

  const handleAuctionError = (errorMessage) => {
    message.error(errorMessage);
  }

  return (
    // @TODO refactor this styling after implementing a toggle functionality for the league navigation
    <Row style={sidebarInUse ? { height: 'calc(100vh - 64px)' } : { height: 'calc(100vh - 114px)' }}>
      <Col xs={0} md={0} lg={8}>
        <AuctionTeams />
      </Col>
      <Col xs={24} md={24} lg={10} className='flex-growVert-parent'>
        <AuctionActions sendSocketMessage={props.sendSocketMessage} />
        <AuctionChat sendSocketMessage={props.sendSocketMessage} />
      </Col>
      <Col xs={0} md={0} lg={6}>
        <MyTeams />
        <MemberList sendSocketMessage={props.sendSocketMessage} />
      </Col>
      <AuctionModal title='Connection to Auction Service Closed' />
      <AuctionLoadingModal errorTimer={15} />
    </Row>
  );
}

export default withAuctionWebsocket(LeagueAuction, { socketService: SOCKETS.AUCTION });