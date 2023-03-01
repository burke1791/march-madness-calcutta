import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useAuctionState } from '../../../context/auctionContext';
import { AUCTION_STATUS } from '../../../utilities/constants';

/**
 * @typedef CloseAuctionButtonProps
 * @property {Function} onClick
 */

/**
 * @component
 * @param {CloseAuctionButtonProps} props 
 */
function CloseAuctionButton(props) {

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const { status } = useAuctionState();

  useEffect(() => {
    if (status === AUCTION_STATUS.BIDDING) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }

    setLoading(false);
  }, [status]);

  const closeAuction = () => {
    if (status === AUCTION_STATUS.SOLD || status === AUCTION_STATUS.CONFIRMED_SOLD) {
      setLoading(true);
      props.onClick();
    }
  }

  return (
    <Button
      type='primary'
      danger
      disabled={disabled}
      loading={loading}
      onClick={closeAuction}
    >
      Close Auction
    </Button>
  );
}

export default CloseAuctionButton;