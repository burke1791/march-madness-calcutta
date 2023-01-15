import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useAuctionState } from '../../../context/auctionContext';
import { AUCTION_STATUS } from '../../../utilities/constants';

/**
 * @typedef NextItemButtonProps
 * @property {Function} onClick
 */

/**
 * @component
 * @param {NextItemButtonProps} props 
 */
function NextItemButton(props) {

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const { status } = useAuctionState();

  useEffect(() => {
    if (status === AUCTION_STATUS.BIDDING || status === AUCTION_STATUS.INITIAL || status === AUCTION_STATUS.END) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }

    setLoading(false);
  }, [status]);

  const onClick = () => {
    setLoading(true);
    props.onClick();
  }

  return (
    <Button
      type='primary'
      disabled={disabled}
      loading={loading}
      onClick={onClick}
    >
      Next Item (Random)
    </Button>
  );
}

export default NextItemButton;