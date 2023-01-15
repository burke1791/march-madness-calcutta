import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { useAuctionState } from '../../../context/auctionContext';
import { AUCTION_STATUS } from '../../../utilities/constants';

/**
 * @typedef OpenAuctionButtonProps
 * @property {Function} onClick
 */

/**
 * @component
 * @param {OpenAuctionButtonProps} props 
 */
function OpenAuctionButton(props) {

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const { status } = useAuctionState();

  useEffect(() => {
    if (status === AUCTION_STATUS.INITIAL) {
      setDisabled(false);
    }

    setLoading(false);
  }, [status]);

  const openAuction = () => {
    if (status === AUCTION_STATUS.INITIAL) {
      setLoading(true);
      props.onClick();
    }
  }

  return (
    <Button
      type='primary'
      disabled={disabled}
      loading={loading}
      onClick={openAuction}
    >
      Open Auction
    </Button>
  )
}

export default OpenAuctionButton;