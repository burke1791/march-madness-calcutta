import React, { useState, useEffect } from 'react';
import './auctionActions.css';

import AuctionAdmin from '../auctionAdmin/auctionAdmin';

import { Button, Card, Statistic, Row, Col, InputNumber } from 'antd';
import 'antd/dist/antd.css';

import { formatMoney } from '../../utilities/helper';
import { userBuyIns, Auction, getServerTimestamp, setItemComplete } from '../../utilities/auctionService';
import { userId } from '../../utilities/leagueService';
import Pubsub from '../../utilities/pubsub';
import { NOTIF, AUCTION_STATUS } from '../../utilities/constants';
import { User } from '../../utilities/authService';

const { Countdown } = Statistic;

// @TODO this component does wayyyyy too much - break it up please!
function AuctionActions(props) {
  
  const [teamName, setTeamName] = useState('');
  const [biddingDisabled, setBiddingDisabled] = useState(true);
  const [highBid, setHighBid] = useState(0);
  const [highBidder, setHighBidder] = useState('n/a');
  const [totalSpent, setTotalSpent] = useState(0);
  const [bidVal, setBidVal] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [status, setStatus] = useState(false);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.NEW_AUCTION_DATA, AuctionActions, handleAuctionUpdate);
    Pubsub.subscribe(NOTIF.AUCTION_BUYINS_DOWNLOADED, AuctionActions, updateTotalSpent);
    Pubsub.subscribe(NOTIF.SERVER_SYNCED, AuctionActions, updateOffset);

    getServerTimestamp();

    return (() => {
      Pubsub.unsubscribe(NOTIF.NEW_AUCTION_DATA, AuctionActions);
      Pubsub.unsubscribe(NOTIF.AUCTION_BUYINS_DOWNLOADED, AuctionActions);
      Pubsub.unsubscribe(NOTIF.SERVER_SYNCED, AuctionActions);
    });
  }, []);

  const updateOffset = (offset) => {
    setOffset(offset);
  }

  // updates local state with the new auction info from global state
  const handleAuctionUpdate = () => {
    setTeamName(generateTeamName());
    setHighBid(Auction.current.price);
    
    // sets highBidder to the user's alias if Auction.currentWinner is a userId, otherwise sets it to "n/a"
    setHighBidder(Auction.current == undefined ? 'n/a' : Auction.current.winnerAlias);

    // let itemEnd = Auction.endTime == 0 ? 0 : (+Auction.endTime * 1000);
    // itemEnd += 15000;
    // setEndTime(itemEnd);
    // console.log(Auction.status);

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
      console.log(user);
      if (user.userId == userId) {
        setTotalSpent(user.totalBuyIn);
      }
    }
  }

  const itemComplete = () => {
    //DataService.setItemComplete(props.auctionId);
    if (props.role == 1 || props.role == 2) {
      setItemComplete(props.leagueId);
    }
  }

  const bidChange = (value) => {
    setBidVal(value);
  }

  const placeCustomBid = () => {
    placeBid(bidVal);
  }

  const placeMinimumBid = () => {
    placeBid(Number(highBid + 1));
  }

  const placeBid = (value) => {
    setBiddingDisabled(true);
    // DataService.placeBid(props.auctionId, value).then(response => {
    //   // do nothing for now
    // }).catch(error => {
    //   // enable bid buttons because the attempted bid failed
    //   setBiddingDisabled(false);
    // });
  }

  const generateAdminButtons = () => {
    if (props.role == 1 || props.role == 2) {
      return (
        <AuctionAdmin status={status} leagueId={props.leagueId} />
      );
    } else {
      return null;
    }
  }
  
  return (
    <Row>
      <Card size='small'>
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
                  style={{ width: '50%' }}
                />
                <Button type='primary' style={{ width: '30%' }} disabled={biddingDisabled} onClick={placeCustomBid}>Bid</Button>
              </Row>
              <Row style={{ textAlign: 'center', marginTop: '6px' }} gutter={8}>
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