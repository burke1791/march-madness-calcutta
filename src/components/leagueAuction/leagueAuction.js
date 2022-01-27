import React, { useState, useEffect } from 'react';
import AuctionTeams from '../auctionTeams/auctionTeams';
import AuctionActions from '../auctionActions/auctionActions';
import AuctionChat from '../auctionChat/auctionChat';

import { Row, Col, message } from 'antd';
import 'antd/dist/antd.css';
import MyTeams from '../myTeams/myTeams';
import MemberList from '../memberList/memberList';
import { AUCTION_SERVICE_ENDPOINTS, SOCKETS, AUCTION_STATUS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import AuctionService from '../../services/autction/auction.service';
import { clearAuctionTeams } from '../../services/autction/endpoints';
import withAuctionWebsocket from '../../HOC/withWebsocket';
import { auctionServiceHelper } from '../../services/autction/helper';
import { useAuctionDispatch, useAuctionState } from '../../context/auctionContext';
import AuctionModal from './auctionModal';
import AuctionLoadingModal from './auctionLoadingModal';

function LeagueAuction(props) {

  const [teams, setTeams] = useState([]);
  const [auctionTeamsLoading, setAuctionTeamsLoading] = useState(true);
  const [prizepool, setPrizepool] = useState(0);
  const [myTeams, setMyTeams] = useState([]);
  const [myTax, setMyTax] = useState(0);
  const [myTotalBuyIn, setMyTotalBuyIn] = useState(0);
  const [leagueUsers, setLeagueUsers] = useState([]);
  const [sidebarInUse, setSidebarInUse] = useState(true);

  const { leagueId } = useLeagueState();
  const { userId, authenticated } = useAuthState();
  const { newItemTimestamp, errorMessage, prevUpdate, connected } = useAuctionState();

  const auctionDispatch = useAuctionDispatch();

  useEffect(() => {
    if (errorMessage !== null && errorMessage !== undefined) {
      handleAuctionError(errorMessage);
    }
  }, [prevUpdate]);

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

  const fetchAllAuctionData = () => {
    fetchAuctionTeams();
    fetchAuctionBuyIns();
    fetchAuctionStatus();
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
      auctionDispatch({ type: 'update', key: 'auctionBuyInsDownloadedDate', value: new Date().valueOf() });
    }).catch(error => {
      console.log(error);
    });
  }

  const fetchAuctionStatus = () => {
    AuctionService.callApiWithPromise(AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_STATUS, { leagueId }).then(response => {
      let itemSoldFlag = response.data[0]?.Status === AUCTION_STATUS.SOLD;

      // indicate to listeners that an item was sold
      if (itemSoldFlag) {
        auctionDispatch({ type: 'update', key: 'newItemTimestamp', value: new Date().valueOf() });
      }

      let statusObj = auctionServiceHelper.updateAuctionStatus(response.data[0]);
      console.log(statusObj);
      updateAuctionStatusInContext(statusObj);
    });
  }

  const processAuctionTeams = (data) => {
    let auctionTeams = auctionServiceHelper.packageAuctionTeams(data);
    setTeams(auctionTeams);
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
    let myBuyIn = userBuyIns.find(user => user.userId == userId)
    let myTaxBurden = myBuyIn.taxBuyIn;
    let currentUserTotalBuyIn = myBuyIn.totalBuyIn;

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

  const handleAuctionError = (errorObj) => {
    // setBiddingDisabled(true);
    console.log(errorObj);
    message.error(errorObj);
  }

  return (
    // @TODO refactor this styling after implementing a toggle functionality for the league navigation
    <Row style={sidebarInUse ? { height: 'calc(100vh - 64px)' } : { height: 'calc(100vh - 114px)' }}>
      <Col span={8}>
        <AuctionTeams teams={teams} prizepool={prizepool} loading={auctionTeamsLoading} />
      </Col>
      <Col span={10} className='flex-growVert-parent'>
        <AuctionActions totalSpent={myTotalBuyIn} sendSocketMessage={props.sendSocketMessage} />
        <AuctionChat sendSocketMessage={props.sendSocketMessage} />
      </Col>
      <Col span={6}>
        <MyTeams myTeams={myTeams} myTax={myTax} />
        <MemberList users={leagueUsers} />
      </Col>
      <AuctionModal title='Connection to Auction Service Closed' />
      <AuctionLoadingModal errorTimer={10} />
    </Row>
  );
}

export default withAuctionWebsocket(LeagueAuction, { socketService: SOCKETS.AUCTION });