import React, { useState, useEffect } from 'react';

import { Button } from 'antd';
import 'antd/dist/antd.css';
import { AUCTION_STATUS, NOTIF } from '../../utilities/constants';
import DataService from '../../utilities/data';
import { startAuction, resetClock, nextItem } from '../../utilities/auctionService';
import Pubsub from '../../utilities/pubsub';

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

  useEffect(() => {
    Pubsub.subscribe(NOTIF.NEW_AUCTION_DATA, AuctionAdmin, handleNewAuctionData);

    return (() => {
      Pubsub.unsubscribe(NOTIF.NEW_AUCTION_DATA, AuctionAdmin);
    });
  }, []);

  const handleNewAuctionData = () => {
    setResetClockLoading(false);
    setNextLoading(false);
  }
  
  const generateStartStopButton = () => {
    let btnText = 'Start Auction';
    let btnType = 'primary';
    let disabled = false;
    let name = 'start';

    if (props.status === AUCTION_STATUS.BIDDING || props.status === AUCTION_STATUS.SOLD) {
      btnText = 'Stop Auction';
      btnType = 'danger';
      name = 'stop'
    } else if (props.status === AUCTION_STATUS.END) {
      btnText = 'Auction Complete';
      btnType = 'primary'
      disabled = true;
      name = 'n/a';
    }

    return (
      <Button 
        type={btnType} 
        disabled={disabled} 
        style={btnStyle} 
        loading={startLoading} 
        onClick={startStopClick} 
        name={name}>{btnText}
      </Button>
    );
  }

  const startStopClick = (event) => {
    event.preventDefault();
    let name = event.target.name;

    if (name == 'start') {
      // Start auction
      console.log('auction start clicked');
      startAuction(props.leagueId);
    } else if (name == 'stop') {
      DataService.stopAuction(props.auctionId, props.leagueId);
    }
  }

  const nextAuctionItem = (event) => {
    if (props.status === AUCTION_STATUS.SOLD) {
      setNextLoading(true);
      
      nextItem(props.leagueId);
    }
  }

  const resetAuctionClock = (event) => {
    if (props.status === AUCTION_STATUS.SOLD || props.status === AUCTION_STATUS.BIDDING) {
      setResetClockLoading(true);

      resetClock(props.leagueId);
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