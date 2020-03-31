import React, { useState, useEffect } from 'react';
import './auctionActions.css';

import AuctionAdmin from '../auctionAdmin/auctionAdmin';

import { Button, Card, Statistic, Row, Col, InputNumber } from 'antd';
import 'antd/dist/antd.css';

import { formatMoney } from '../../utilities/helper';
import { userBuyIns, Auction, getServerTimestamp, setItemComplete, placeAuctionBid } from '../../utilities/auctionService';
import { userId } from '../../utilities/leagueService';
import Pubsub from '../../utilities/pubsub';
import { NOTIF, AUCTION_STATUS } from '../../utilities/constants';
import { User } from '../../utilities/authService';
import { useLeagueState } from '../../context/leagueContext';

const { Countdown } = Statistic;

// @TODO this component does wayyyyy too much - break it up please!
function AuctionActions() {
  
  const [teamName, setTeamName] = useState('');
  const [biddingDisabled, setBiddingDisabled] = useState(true);
  const [highBid, setHighBid] = useState(0);
  const [highBidder, setHighBidder] = useState('n/a');
  const [totalSpent, setTotalSpent] = useState(0);
  const [bidVal, setBidVal] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [status, setStatus] = useState(false);
  const [offset, setOffset] = useState(0);

  const { roleId, leagueId } = useLeagueState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.NEW_AUCTION_DATA, AuctionActions, handleAuctionUpdate);
    Pubsub.subscribe(NOTIF.AUCTION_BUYINS_DOWNLOADED, AuctionActions, updateTotalSpent);
    Pubsub.subscribe(NOTIF.SERVER_SYNCED, AuctionActions, updateOffset);
    Pubsub.subscribe(NOTIF.AUCTION_ERROR, AuctionActions, handleAuctionError);

    getServerTimestamp();

    return (() => {
      Pubsub.unsubscribe(NOTIF.NEW_AUCTION_DATA, AuctionActions);
      Pubsub.unsubscribe(NOTIF.AUCTION_BUYINS_DOWNLOADED, AuctionActions);
      Pubsub.unsubscribe(NOTIF.SERVER_SYNCED, AuctionActions);
      Pubsub.unsubscribe(NOTIF.AUCTION_ERROR, AuctionActions);
    });
  }, []);

  const updateOffset = (offset) => {
    setOffset(offset);
  }

  const handleAuctionError = () => {
    setBiddingDisabled(false);
  }

  // updates local state with the new auction info from global state
  const handleAuctionUpdate = () => {
    setTeamName(generateTeamName());
    setHighBid(Auction.current.price);
    
    // sets highBidder to the user's alias if Auction.currentWinner is a userId, otherwise sets it to "n/a"
    setHighBidder(Auction.current == undefined || Auction.current.winnerAlias == null ? 'n/a' : Auction.current.winnerAlias);

    updateClock();

    // disables bid buttons if the auction is not currently in progress
    if (Auction.status == AUCTION_STATUS.BIDDING) {
      setBiddingDisabled(false);
    } else {
      setBiddingDisabled(true);
    }

    setStatus(Auction.status);
  }

  const generateTeamName = () => {
    if (Auction.current && Auction.current.itemName && Auction.current.itemSeed) {
      return '(' + +Auction.current.itemSeed + ') ' + Auction.current.itemName;
    } else if (Auction.current.itemName) {
      return Auction.current.itemName;
    }

    return '';
  }

  const updateClock = () => {
    let lastBid = Auction.current.lastBid.valueOf();

    let itemEnd = new Date(lastBid + 15000 - offset);

    console.log(itemEnd);
    setEndTime(itemEnd);
  }

  const updateTotalSpent = () => {
    console.log(userId);
    for (var user of userBuyIns) {
      if (user.userId == userId) {
        setTotalSpent(user.totalBuyIn);
      }
    }
  }

  const itemComplete = () => {
    //DataService.setItemComplete(props.auctionId);
    if (roleId == 1 || roleId == 2) {
      setItemComplete(leagueId);
    }
  }

  const bidChange = (value) => {
    setBidVal(Math.floor(value));
  }

  const placeCustomBid = () => {
    placeBid(bidVal);
  }

  const placeMinimumBid = () => {
    placeBid(Number(highBid + 1));
  }

  const placeBid = (value) => {
    setBiddingDisabled(true);

    placeAuctionBid(leagueId, value);
  }

  const generateAdminButtons = () => {
    if (roleId == 1 || roleId == 2) {
      return (
        <AuctionAdmin status={status} />
      );
    } else {
      return null;
    }
  }
  
  return (
    <Row>
      <Card size='small' style={{ width: '100%' }}>
        <div className='team-name'>
          <span>{teamName}</span>
        </div>
        {generateAdminButtons()}
        <Row type='flex' justify='space-between' gutter={8} style={{ marginTop: '6px' }}>
          <Col span={12} className='flex-growVert-parent'>
            <Card size='small' bodyStyle={{ textAlign: 'center' }} className='flex-growVert-child'>
              <Statistic title='High Bid' value={formatMoney(highBid)} />
              <Statistic title='By' value={highBidder} />
            </Card>
          </Col>
          <Col span={12} className='flex-growVert-parent'>
            <Card size='small' bodyStyle={{ textAlign: 'center' }} className='flex-growVert-child'>
              <Countdown title='Time Remaining' value={endTime} onFinish={itemComplete} format={'mm:ss'} />
            </Card>
          </Col>
        </Row>
        <Row type='flex' justify='space-between' gutter={8} style={{ marginTop: '6px' }}>
          <Col span={12} className='flex-growVert-parent'>
            <Card size='small' bodyStyle={{ textAlign: 'center' }} className='flex-growVert-child'>
              <Statistic title='Total Spent' value={formatMoney(totalSpent)} />
            </Card>
          </Col>
          <Col span={12} className='flex-growVert-parent'>
            <Card size='small' className='flex-growVert-child'>
              <Row type='flex' justify='space-around' gutter={8}>
                <InputNumber
                  min={0}
                  formatter={value => `\$ ${value}`}
                  parser={value => value.replace(/\$\s?/g, '')}
                  onChange={bidChange}
                  precision={0}
                  style={{ width: '50%' }}
                />
                <Button type='primary' style={{ width: '30%' }} disabled={biddingDisabled} onClick={placeCustomBid}>Bid</Button>
              </Row>
              <Row type='flex' justify='center' style={{ textAlign: 'center', marginTop: '6px' }} gutter={8}>
                <Button type='primary' disabled={biddingDisabled} style={{ width: '90%' }} onClick={placeMinimumBid}>${highBid + 1} (Min Bid)</Button>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </Row>
  );
}

export default AuctionActions;