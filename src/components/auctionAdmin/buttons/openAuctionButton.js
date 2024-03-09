import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'antd';
import { useAuctionState } from '../../../context/auctionContext';
import { AUCTION_STATUS } from '../../../utilities/constants';

/**
 * @typedef OpenAuctionButtonProps
 * @property {Function} onClick
 * @property {Boolean} isReopen
 */

/**
 * @component
 * @param {OpenAuctionButtonProps} props 
 */
function OpenAuctionButton(props) {

  const [loading, setLoading] = useState(false);

  const openAuction = () => {
    setLoading(true);
    props.onClick(props.isReopen);
  }

  if (props.isReopen) {
    return (
      <Tooltip placement='top' title='This will not start another round of bidding'>
        <Button
          type='primary'
          loading={loading}
          onClick={openAuction}
        >
          Reopen Auction
        </Button>
      </Tooltip>
    );
  } else {
    return (
      <Button
        type='primary'
        loading={loading}
        onClick={openAuction}
      >
        Open Auction (Random Item)
      </Button>
    );
  }
}

export default OpenAuctionButton;