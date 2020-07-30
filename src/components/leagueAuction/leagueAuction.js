import React, { useState, useEffect } from 'react';
import AuctionTeams from '../auctionTeams/auctionTeams';
import AuctionActions from '../auctionActions/auctionActions';
import AuctionChat from '../auctionChat/auctionChat';

import { Row, Col } from 'antd';
import 'antd/dist/antd.css';
import MyTeams from '../myTeams/myTeams';
import MemberList from '../memberList/memberList';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import { connectAuction, disconnect, fetchAuctionTeams, clearAuctionTeams, auctionTeams, fetchUserBuyIns, userBuyIns, fetchAuctionStatus } from '../../utilities/auctionService';
import { useLeagueState } from '../../context/leagueContext';
import withAuth from '../../HOC/withAuth';
import { useAuthState } from '../../context/authContext';

function LeagueAuction(props) {

  const [teams, setTeams] = useState([]);
  const [prizepool, setPrizepool] = useState(0);
  const [myTeams, setMyTeams] = useState([]);
  const [myTax, setMyTax] = useState(0);
  const [leagueUsers, setLeagueUsers] = useState([]);
  const [sidebarInUse, setSidebarInUse] = useState(true);

  const { leagueId } = useLeagueState();
  const { userId } = useAuthState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.AUCTION_TEAMS_DOWNLOADED, LeagueAuction, auctionTeamsDownloaded);
    Pubsub.subscribe(NOTIF.NEW_AUCTION_DATA, LeagueAuction, handleNewAuctionData);
    Pubsub.subscribe(NOTIF.AUCTION_BUYINS_DOWNLOADED, LeagueAuction, updateUserSummaries);

    return (() => {
      Pubsub.unsubscribe(NOTIF.AUCTION_TEAMS_DOWNLOADED, LeagueAuction);
      Pubsub.unsubscribe(NOTIF.NEW_AUCTION_DATA, LeagueAuction);
      Pubsub.unsubscribe(NOTIF.AUCTION_BUYINS_DOWNLOADED, LeagueAuction);
    });
  }, []);

  useEffect(() => {
    console.log(leagueId, props.authenticated);
    if (leagueId && props.authenticated) {
      fetchData(leagueId);
      connectWebsocket(leagueId);
    } else {
      console.log('leagueId is falsy');
    }

    return (() => {
      disconnect();
      clearAuctionTeams();
    });
  }, [leagueId]);

  useEffect(() => {
    if (props.authenticated) {
      handleSignIn();
    }
  }, [props.authenticated]);

  const handleSignIn = () => {
    if (leagueId) {
      fetchData(leagueId);
      connectWebsocket(leagueId);
    }
  }

  const connectWebsocket = (leagueId) => {
    connectAuction(leagueId);
  }

  const fetchData = (leagueId) => {
    fetchAuctionTeams(leagueId);
    fetchUserBuyIns(leagueId);
    fetchAuctionStatus(leagueId);
  }

  const auctionTeamsDownloaded = () => {
    setTeams(auctionTeams);
    
    const myTeamsArr = auctionTeams.filter(team => {
      if (team.owner === userId) {
        return team;
      }
    });
    setMyTeams(myTeamsArr);
  }

  const handleNewAuctionData = (newItem) => {
    if (newItem) {
      fetchAuctionTeams(leagueId);
      fetchUserBuyIns(leagueId);
    }
  }

  const updateUserSummaries = () => {
    let taxBurden = userBuyIns.find(user => user.userId == userId).taxBuyIn;
    
    const prizepool = userBuyIns.reduce((prev, current, i) => {
      if (i == 1) {
        return prev.totalBuyIn + current.totalBuyIn;
      }
      return prev + current.totalBuyIn;
    });
    setMyTax(taxBurden);
    setLeagueUsers(userBuyIns);
    console.log(prizepool);
    setPrizepool(prizepool);
  }

  return (
    // @TODO refactor this styling after implementing a toggle functionality for the league navigation
    <Row style={sidebarInUse ? { height: 'calc(100vh - 64px)' } : { height: 'calc(100vh - 114px)' }}>
      <Col span={8}>
        <AuctionTeams teams={teams} prizepool={prizepool} />
      </Col>
      <Col span={10} className='flex-growVert-parent'>
        <AuctionActions />
        <AuctionChat />
      </Col>
      <Col span={6}>
        <MyTeams myTeams={myTeams} myTax={myTax} />
        <MemberList users={leagueUsers} />
      </Col>
    </Row>
  );
}

export default withAuth(LeagueAuction);