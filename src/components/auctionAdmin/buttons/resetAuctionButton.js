import React, { useState } from 'react';
import { Button, Popconfirm } from 'antd';

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

  const onClick = () => {
    setLoading(true);

    props.onClick();
  }

  return (
    <Popconfirm
      okText='Yes'
      cancelText='Cancel'
      title='Are you sure? This cannot be undone!'
      onConfirm={onClick}
    >
      <Button
        type='primary'
        loading={loading}
      >
        Reset All Auction Data
      </Button>
    </Popconfirm>
  )
}

export default ResetAuctionButton;