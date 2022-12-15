import React, { useState, useEffect, useRef } from 'react';
import AuctionTeams from '../auctionTeams/auctionTeams';
import AuctionActions from '../auctionActions/auctionActions';
import AuctionChat from '../auctionChat/auctionChat';

import { Row, Col, message } from 'antd';
import 'antd/dist/antd.css';
import MyTeams from '../myTeams/myTeams';
import MemberList from '../memberList/memberList';
import { AUCTION_SERVICE_ENDPOINTS, SOCKETS, AUCTION_STATUS, API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import AuctionService from '../../services/autction/auction.service';
import { clearAuctionTeams } from '../../services/autction/endpoints';
import withAuctionWebsocket from '../../HOC/withWebsocket';
import { auctionServiceHelper } from '../../services/autction/helper';
import { useAuctionDispatch, useAuctionState } from '../../context/auctionContext';
import AuctionModal from './auctionModal';
import AuctionLoadingModal from './auctionLoadingModal';
import useData from '../../hooks/useData';
import { parseAuctionSettings } from './helper';

function LeagueAuction(props) {

  // const [teams, setTeams] = useState([]);
  const [auctionTeamsLoading, setAuctionTeamsLoading] = useState(true);
  const [prizepool, setPrizepool] = useState(0);
  const [myTeams, setMyTeams] = useState([]);
  const [myTax, setMyTax] = useState(0);
  const [myTaxBrackets, setMyTaxBrackets] = useState([]);
  const [myTotalBuyIn, setMyTotalBuyIn] = useState(0);
  const [leagueUsers, setLeagueUsers] = useState([]);
  const [sidebarInUse, setSidebarInUse] = useState(true);

  const teams = useRef([]);

  const { leagueId } = useLeagueState();
  const { userId, authenticated } = useAuthState();
  const { newItemTimestamp, errorMessage, prevUpdate, connected } = useAuctionState();

  const auctionDispatch = useAuctionDispatch();

  const [auctionSettings, auctionSettingsReturnDate, fetchAuctionSettings] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS}/${leagueId}?settingClass=Auction`,
    method: 'GET',
    processData: parseAuctionSettings,
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (errorMessage !== null && errorMessage !== undefined) {
      handleAuctionError(errorMessage);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (leagueId && authenticated && connected) {
      fetchAllAuctionData();
    }

    return (() => {
      clearAuctionTeams();
    });
  }, [leagueId, authenticated, connected]);

  useEffect(() => {
    if (leagueId && newItemTimestamp) {
      fetchAuctionTeams();
      fetchAuctionBuyIns();
    }
  }, [newItemTimestamp]);

  useEffect(() => {
    if (auctionSettingsReturnDate && auctionSettings) {
      const keys = Object.keys(auctionSettings);
      
      for (let key of keys) {
        auctionDispatch({ type: 'update', key: key, value: auctionSettings[key] });
      }
    }
  }, [auctionSettingsReturnDate]);

  const fetchAllAuctionData = () => {
    fetchAuctionTeams();
    fetchAuctionBuyIns();
    fetchAuctionStatus();
    fetchAuctionSettings();
  }

  const fetchAuctionTeams = () => {
    AuctionService.callApiWithPromise(AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_TEAMS, { leagueId }).then(response => {
      processAuctionTeams(response.data);
      auctionDispatch({ type: 'update', key: 'teamsDownloadedDate', value: new Date().valueOf() });
    }).catch(error => {
      console.log(error);
    });
  }

  const fetchAuctionBuyIns = () => {
    AuctionService.callApiWithPromise(AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_BUYINS, { leagueId }).then(response => {
      processAuctionBuyIns(response.data);
      // processAuctionBuyIns(response.data?.buyIns);
      // processMyTaxBrackets(response.data?.tax);
      auctionDispatch({ type: 'update', key: 'auctionBuyInsDownloadedDate', value: new Date().valueOf() });
    }).catch(error => {
      console.log(error);
    });
  }

  const fetchAuctionStatus = () => {
    AuctionService.callApiWithPromise(AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_STATUS, { leagueId }).then(response => {
      let statusObj = auctionServiceHelper.updateAuctionStatus(response.data[0]);
      updateAuctionStatusInContext(statusObj);
    });
  }

  const processAuctionTeams = (data) => {
    let auctionTeams = auctionServiceHelper.packageAuctionTeams(data);
    // setTeams(auctionTeams);
    // teams.current = auctionTeams;
    auctionDispatch({ type: 'update', key: 'teams', value: auctionTeams });
    setAuctionTeamsLoading(false);
    
    const myTeamsArr = auctionTeams.filter(team => {
      if (team.owner == userId) {
        return team;
      }
    });
    setMyTeams(myTeamsArr);
  }

  const processAuctionBuyIns = (buyIns) => {
    let userBuyIns = auctionServiceHelper.packageUserBuyIns(buyIns);

    updateUserSummaries(userBuyIns);
  }

  const processMyTaxBrackets = (taxBrackets) => {
    if (taxBrackets != undefined) {
      setMyTaxBrackets(taxBrackets);
    }
  }

  const updateAuctionStatusInContext = (statusObj) => {
    let keys = Object.keys(statusObj);

    for (var key of keys) {
      if (statusObj[key] !== undefined) {
        auctionDispatch({ type: 'update', key: key, value: statusObj[key] });
      }
    }

    auctionDispatch({ type: 'update', key: 'auctionStatusDownloadedDate', value: new Date().valueOf() });
  }

  const updateUserSummaries = (userBuyIns) => {
    const myBuyIn = userBuyIns.find(user => user.userId == userId);

    // if myBuyIn is undefined then the current user is a spectator, so we default to 0
    const myTaxBurden = myBuyIn?.taxBuyIn || 0;
    const currentUserTotalBuyIn = myBuyIn?.totalBuyIn || 0;

    const prizepool = userBuyIns.reduce((prev, current, i) => {
      if (i == 1) {
        return prev + current.totalBuyIn;
      }
      return prev + current.totalBuyIn;
    }, 0);

    setMyTotalBuyIn(currentUserTotalBuyIn);
    setMyTax(myTaxBurden);
    setLeagueUsers(userBuyIns);
    setPrizepool(prizepool);
  }

  const handleAuctionError = (errorMessage) => {
    // setBiddingDisabled(true);
    console.log(errorMessage);
    message.error(errorMessage);
  }

  return (
    // @TODO refactor this styling after implementing a toggle functionality for the league navigation
    <Row style={sidebarInUse ? { height: 'calc(100vh - 64px)' } : { height: 'calc(100vh - 114px)' }}>
      <Col xs={0} md={0} lg={8}>
        <AuctionTeams teams={teams.current} prizepool={prizepool} loading={auctionTeamsLoading} />
      </Col>
      <Col xs={24} md={24} lg={10} className='flex-growVert-parent'>
        <AuctionActions totalSpent={myTotalBuyIn} sendSocketMessage={props.sendSocketMessage} />
        <AuctionChat sendSocketMessage={props.sendSocketMessage} />
      </Col>
      <Col xs={0} md={0} lg={6}>
        <MyTeams myTeams={myTeams} myTax={myTax} />
        <MemberList users={leagueUsers} />
      </Col>
      <AuctionModal title='Connection to Auction Service Closed' />
      <AuctionLoadingModal errorTimer={15} />
    </Row>
  );
}

export default withAuctionWebsocket(LeagueAuction, { socketService: SOCKETS.AUCTION });