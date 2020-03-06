import React, { useState } from 'react';

import { Button } from 'antd';
import 'antd/dist/antd.css';
import { AUCTION_STATUS } from '../../utilities/constants';
import DataService from '../../utilities/data';
import { startAuction } from '../../utilities/auctionService';

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

  const nextItem = (event) => {
    event.preventDefault();

    if (props.status === AUCTION_STATUS.SOLD) {
      setNextLoading(true);
      DataService.nextItem(props.auctionId, props.leagueId).then(response => {
        setNextLoading(false);
      }).catch(error => {
        setNextLoading(false);
      });
    }
  }

  const resetClock = (event) => {
    event.preventDefault();

    if (props.status === AUCTION_STATUS.SOLD || props.status === AUCTION_STATUS.BIDDING) {
      setResetClockLoading(true);
      DataService.resetClock(props.auctionId, props.leagueId).then(response => {
        setResetClockLoading(false);
      }).catch(error => {
        setResetClockLoading(false);
      });
    }
  }
  
  return (
    <div className='admin-actions' style={containerStyle}>
      {generateStartStopButton()}
      <Button type='primary' style={btnStyle} loading={nextLoading} onClick={nextItem}>Next Item</Button>
      <Button type='primary' style={btnStyle} loading={resetClockLoading} onClick={resetClock}>Reset Clock</Button>
    </div>
  );
}

export default AuctionAdmin;