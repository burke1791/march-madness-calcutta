import React, { useState, useEffect } from 'react';

import { Button } from 'antd';
import 'antd/dist/antd.css';
import { AUCTION_STATUS, NOTIF } from '../../utilities/constants';
import { startAuction, resetClock, nextItem, closeAuction } from '../../utilities/auctionService';
import Pubsub from '../../utilities/pubsub';
import { useLeagueState } from '../../context/leagueContext';

const btnStyle = {
  marginTop: '4px'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between'
};

function AuctionAdmin(props) {

  const [startLoading, setStartLoading] = useState(false);
  const [nextLoading, setNextLoading] = useState(false);
  const [resetClockLoading, setResetClockLoading] = useState(false);

  const { leagueId } = useLeagueState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.NEW_AUCTION_DATA, AuctionAdmin, handleNewAuctionData);

    return (() => {
      Pubsub.unsubscribe(NOTIF.NEW_AUCTION_DATA, AuctionAdmin);
    });
  }, []);

  const handleNewAuctionData = () => {
    setResetClockLoading(false);
    setNextLoading(false);
    setStartLoading(false);
  }
  
  const generateStartStopButton = () => {
    let btnText = 'Open Auction';
    let btnType = 'primary';
    let disabled = false;
    let name = 'start';
    let action = openAuction;

    if (props.status === AUCTION_STATUS.BIDDING || props.status === AUCTION_STATUS.SOLD) {
      btnText = 'Close Auction';
      btnType = 'danger';
      name = 'stop';
      action = endAuction;
    } else if (props.status === AUCTION_STATUS.END) {
      btnText = 'Auction Closed';
      btnType = 'primary'
      disabled = true;
      name = 'n/a';
      action = endAuction;
    }

    return (
      <Button 
        type={btnType} 
        disabled={disabled} 
        style={btnStyle} 
        loading={startLoading} 
        onClick={action} 
        name={name}
      >
        {btnText}
      </Button>
    );
  }

  const openAuction = (event) => {
    if (props.status === AUCTION_STATUS.INITIAL) {
      setStartLoading(true);
      
      startAuction(leagueId);
    }
  }

  const endAuction = (event) => {
    if (props.status === AUCTION_STATUS.BIDDING || props.status === AUCTION_STATUS.SOLD) {
      setStartLoading(true);

      closeAuction(leagueId);
    }
  }

  const nextAuctionItem = (event) => {
    if (props.status === AUCTION_STATUS.SOLD) {
      setNextLoading(true);
      
      nextItem(leagueId);
    }
  }

  const resetAuctionClock = (event) => {
    if (props.status === AUCTION_STATUS.SOLD || props.status === AUCTION_STATUS.BIDDING) {
      setResetClockLoading(true);

      resetClock(leagueId);
    }
  }
  
  return (
    <div className='admin-actions' style={containerStyle}>
      {generateStartStopButton()}
      <Button type='primary' style={btnStyle} loading={nextLoading} onClick={nextAuctionItem}>Next Item</Button>
      <Button type='primary' style={btnStyle} loading={resetClockLoading} onClick={resetAuctionClock}>Reset Clock</Button>
    </div>
  );
}

export default AuctionAdmin;