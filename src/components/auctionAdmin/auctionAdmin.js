import React, { useState, useEffect } from 'react';

import { Button } from 'antd';
import 'antd/dist/antd.css';
import { AUCTION_SERVICE_ENDPOINTS, AUCTION_STATUS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuctionDispatch, useAuctionState } from '../../context/auctionContext';
import { auctionServiceHelper } from '../../services/autction/helper';
import AuctionService from '../../services/autction/auction.service';

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
  const { status, prevUpdate, auctionClosed } = useAuctionState();

  const auctionDispatch = useAuctionDispatch();

  useEffect(() => {
    handleNewAuctionData();
  }, [prevUpdate]);

  useEffect(() => {
    if (!!auctionClosed) {
      fetchAuctionStatus();
    }
  }, [auctionClosed]);

  // @TODO: figure out some state change to listen on for this functionality
  const handleNewAuctionData = () => {
    setResetClockLoading(false);
    setNextLoading(false);
    setStartLoading(false);
  }

  const fetchAuctionStatus = () => {
    AuctionService.callApiWithPromise(AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_STATUS, { leagueId }).then(response => {
      let statusObj = auctionServiceHelper.updateAuctionStatus(response.data[0]);
      console.log(statusObj);
      updateAuctionStatusInContext(statusObj);
    });
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
  
  const generateStartStopButton = () => {
    let btnText = 'Open Auction';
    let btnType = 'primary';
    let disabled = false;
    let name = 'start';
    let action = openAuction;

    if (status === AUCTION_STATUS.BIDDING || status === AUCTION_STATUS.SOLD || status === AUCTION_STATUS.CONFIRMED_SOLD) {
      btnText = 'Close Auction';
      btnType = 'danger';
      name = 'stop';
      action = endAuction;
    } else if (status === AUCTION_STATUS.END) {
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
    if (status === AUCTION_STATUS.INITIAL) {
      setStartLoading(true);
      
      // startAuction(leagueId);
      props.sendSocketMessage('START_AUCTION', { leagueId });
    }
  }

  const endAuction = (event) => {
    if (status === AUCTION_STATUS.BIDDING || status === AUCTION_STATUS.SOLD || AUCTION_STATUS.CONFIRMED_SOLD) {
      setStartLoading(true);

      // closeAuction(leagueId);
      props.sendSocketMessage('CLOSE_AUCTION', { leagueId });
    }
  }

  const nextAuctionItem = (event) => {
    if (status === AUCTION_STATUS.CONFIRMED_SOLD) {
      setNextLoading(true);
      
      // nextItem(leagueId);
      props.sendSocketMessage('NEXT_ITEM', { leagueId });
    }
  }

  const resetAuctionClock = (event) => {
    if (status === AUCTION_STATUS.SOLD || status === AUCTION_STATUS.BIDDING || AUCTION_STATUS.CONFIRMED_SOLD) {
      setResetClockLoading(true);

      // resetClock(leagueId);
      props.sendSocketMessage('RESET_CLOCK', { leagueId });
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