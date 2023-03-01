import React, { useState, useEffect } from 'react';

import { Button } from 'antd';
import 'antd/dist/antd.css';
import { AUCTION_STATUS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuctionState } from '../../context/auctionContext';
import AuctionAdminPanelModal from './auctionAdminPanelModal';

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
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  const { leagueId } = useLeagueState();
  const { status, prevUpdate } = useAuctionState();

  useEffect(() => {
    handleNewAuctionData();
  }, [prevUpdate]);

  // @TODO: figure out some state change to listen on for this functionality
  const handleNewAuctionData = () => {
    setResetClockLoading(false);
    setNextLoading(false);
    setStartLoading(false);
  }

  const showAdminPanel = () => {
    setAdminPanelOpen(true);
  }

  const dismissAdminPanel = () => {
    setAdminPanelOpen(false);
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
      
      props.sendSocketMessage('START_AUCTION', { leagueId });
    }
  }

  const endAuction = (event) => {
    if (status === AUCTION_STATUS.BIDDING || status === AUCTION_STATUS.SOLD || status === AUCTION_STATUS.CONFIRMED_SOLD) {
      setStartLoading(true);

      props.sendSocketMessage('CLOSE_AUCTION', { leagueId });
    }
  }

  const nextAuctionItem = (event) => {
    if (status === AUCTION_STATUS.CONFIRMED_SOLD) {
      setNextLoading(true);
      
      props.sendSocketMessage('NEXT_ITEM', { leagueId });
    }
  }

  const resetAuctionClock = (event) => {
    if (status === AUCTION_STATUS.SOLD || status === AUCTION_STATUS.BIDDING || status === AUCTION_STATUS.CONFIRMED_SOLD) {
      setResetClockLoading(true);

      props.sendSocketMessage('RESET_CLOCK', { leagueId });
    }
  }
  
  return (
    <div className='admin-actions' style={containerStyle}>
      {/* {generateStartStopButton()} */}
      <Button
        type='primary'
        style={btnStyle}
        onClick={showAdminPanel}
      >
        Admin Panel
      </Button>
      <Button type='primary' style={btnStyle} loading={nextLoading} onClick={nextAuctionItem}>Next Item</Button>
      <Button type='primary' style={btnStyle} loading={resetClockLoading} onClick={resetAuctionClock}>Reset Clock</Button>
      <AuctionAdminPanelModal
        open={adminPanelOpen}
        dismiss={dismissAdminPanel}
        sendSocketMessage={props.sendSocketMessage}
      />
    </div>
  );
}

export default AuctionAdmin;