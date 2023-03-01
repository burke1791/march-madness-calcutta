import React, { useEffect, useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { useAuctionState } from '../../../context/auctionContext';

/**
 * @typedef ResetAuctionButtonProps
 * @property {Function} onClick
 */

/**
 * @component
 * @param {ResetAuctionButtonProps} props 
 */
function ResetAuctionButton(props) {

  const [loading, setLoading] = useState(false);

  const { resetAuctionTriggered } = useAuctionState();

  useEffect(() => {
    if (resetAuctionTriggered) {
      setLoading(false);
    }
  }, [resetAuctionTriggered]);

  const onClick = () => {
    setLoading(true);

    props.onClick();
  }

  return (
    <Popconfirm
      okText='Yes'
      okButtonProps={{
        danger: true
      }}
      cancelText='Cancel'
      title='Are you sure? This cannot be undone!'
      onConfirm={onClick}
    >
      <Button
        type='primary'
        loading={loading}
        danger
      >
        Reset All Auction Data
      </Button>
    </Popconfirm>
  )
}

export default ResetAuctionButton;