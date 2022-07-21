import React from 'react';
import { Button } from 'antd';

/**
 * @typedef AuctionGroupDeleteButtonCellProps
 * @property {Number} groupId
 * @property {Function} onClick
 */

/**
 * @component
 * @param {AuctionGroupDeleteButtonCellProps} props 
 */
function AuctionGroupDeleteButtonCell(props) {

  const onClick = () => {
    props.onClick(props.groupId);
  }

  return (
    <Button
      type='primary'
      danger
      size='small'
      onClick={onClick}
    >
      Delete
    </Button>
  );
}

export default AuctionGroupDeleteButtonCell;