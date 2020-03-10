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
import { User } from '../../utilities/authService';
import { connectAuction, disconnect, fetchAuctionTeams, clearAuctionTeams, auctionTeams, fetchUserBuyIns, userBuyIns, fetchAuctionStatus } from '../../utilities/auctionService';
import { userId } from '../../utilities/leagueService';

function LeagueAuction(props) {

  const [teams, setTeams] = useState([]);
  const [prizepool, setPrizepool] = useState(0);
  const [myTeams, setMyTeams] = useState([]);
  const [myTax, setMyTax] = useState(0);
  const [leagueUsers, setLeagueUsers] = useState([]);

  useEffect(() => {
    fetchAuctionTeams(props.leagueId);
    fetchUserBuyIns(props.leagueId);
    fetchAuctionStatus(props.leagueId);

    connectAuction(props.leagueId);

    Pubsub.subscribe(NOTIF.AUCTION_TEAMS_DOWNLOADED, LeagueAuction, auctionTeamsDownloaded);
    Pubsub.subscribe(NOTIF.NEW_AUCTION_DATA, LeagueAuction, handleNewAuctionData);
    Pubsub.subscribe(NOTIF.AUCTION_BUYINS_DOWNLOADED, LeagueAuction, updateUserSummaries);

    return (() => {
      Pubsub.unsubscribe(NOTIF.AUCTION_TEAMS_DOWNLOADED, LeagueAuction);
      Pubsub.unsubscribe(NOTIF.NEW_AUCTION_DATA, LeagueAuction);
      Pubsub.unsubscribe(NOTIF.AUCTION_BUYINS_DOWNLOADED, LeagueAuction);

      disconnect();
      clearAuctionTeams();
    });
  }, []);

  const auctionTeamsDownloaded = () => {
    setTeams(auctionTeams);
    
    let totalBid = 0;
    const myTeamsArr = auctionTeams.filter(team => {
      totalBid += team.price;
      if (team.owner === userId) {
        return team;
      }
    });
    setMyTeams(myTeamsArr);
    // setPrizepool(totalBid);
  }

  const handleNewAuctionData = (newItem) => {
    if (newItem) {
      fetchAuctionTeams(props.leagueId);
      fetchUserBuyIns(props.leagueId);
    }
  }

  const updateUserSummaries = () => {
    let taxBurden = 0;
    const prizepool = userBuyIns.reduce((prev, current, i) => {
      
      if (i == 1) {
        taxBurden += prev.taxBuyIn + current.taxBuyIn;
        return prev.totalBuyIn + current.totalBuyIn;
      }
      taxBurden += current.taxBuyIn;
      return prev + current.totalBuyIn;
    });
    setMyTax(taxBurden);
    setLeagueUsers(userBuyIns);
    setPrizepool(prizepool);
  }

  return (
    <Row style={{ height: 'calc(100vh - 114px)' }}>
      <Col span={8}>
        <AuctionTeams teams={teams} prizepool={prizepool} />
      </Col>
      <Col span={10} style={{ height: 'calc(100vh - 114px)' }} className='flex-growVert-parent'>
        <AuctionActions role={props.role} leagueId={props.leagueId} />
        <AuctionChat leagueId={props.leagueId} />
      </Col>
      <Col span={6}>
        <MyTeams myTeams={myTeams} myTax={myTax} />
        <MemberList users={leagueUsers} />
      </Col>
    </Row>
  );
}

export default LeagueAuction;