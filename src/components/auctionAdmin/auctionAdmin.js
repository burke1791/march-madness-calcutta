import React, { useState } from 'react';

import { Button } from 'antd';
import { AUCTION_STATUS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuctionState } from '../../context/auctionContext';
import AuctionAdminPanelModal from './auctionAdminPanelModal';
import { NextItemButton, ResetClockButton } from './buttons';

const btnStyle = {
  marginTop: '4px'
};

const containerStyle = {
  display: 'flex',
  justifyContent: 'space-between'
};

function AuctionAdmin(props) {

  const [adminPanelOpen, setAdminPanelOpen] = useState(false);

  const { leagueId } = useLeagueState();
  const { status } = useAuctionState();

  const showAdminPanel = () => {
    setAdminPanelOpen(true);
  }

  const dismissAdminPanel = () => {
    setAdminPanelOpen(false);
  }

  const nextAuctionItem = (event) => {
    if (status === AUCTION_STATUS.CONFIRMED_SOLD) {
      props.sendSocketMessage('NEXT_ITEM', { leagueId });
    }
  }

  const resetAuctionClock = (event) => {
    if (status === AUCTION_STATUS.SOLD || status === AUCTION_STATUS.BIDDING || status === AUCTION_STATUS.CONFIRMED_SOLD) {
      props.sendSocketMessage('RESET_CLOCK', { leagueId });
    }
  }
  
  return (
    <div className='admin-actions' style={containerStyle}>
      <Button
        type='primary'
        onClick={showAdminPanel}
      >
        Admin Panel
      </Button>
      <NextItemButton onClick={nextAuctionItem} />
      <ResetClockButton onClick={resetAuctionClock} />
      <AuctionAdminPanelModal
        open={adminPanelOpen}
        dismiss={dismissAdminPanel}
        sendSocketMessage={props.sendSocketMessage}
      />
    </div>
  );
}

export default AuctionAdmin;