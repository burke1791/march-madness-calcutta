import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useAuctionState } from '../../../context/auctionContext';
import { AUCTION_STATUS } from '../../../utilities/constants';

/**
 * @typedef ResetClockButtonProps
 * @property {Function} onClick
 */

/**
 * @component
 * @param {ResetClockButtonProps} props 
 */
function ResetClockButton(props) {

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(true);

  const { status } = useAuctionState();

  useEffect(() => {
    if (status === AUCTION_STATUS.INITIAL || status === AUCTION_STATUS.END) {
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
      Reset Clock
    </Button>
  );
}

export default ResetClockButton;