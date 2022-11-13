import React from 'react';
import { Button } from 'antd';

/**
 * @typedef AuctionBidRuleDeleteCellProps
 * @property {Number} ruleId
 * @property {Boolean} isDeleted
 * @property {Boolean} isNewRule
 * @property {Function} deleteNewRule
 * @property {Function} onClick
 */

/**
 * @component AuctionBidRuleDeleteCell
 * @param {AuctionBidRuleDeleteCellProps} props 
 */
function AuctionBidRuleDeleteCell(props) {

  const onClick = () => {
    if (props.isNewRule) props.deleteNewRule();
    
    props.onClick(props.ruleId, props.isNewRule);
  }

  if (props.isDeleted) {
    return (
      <Button
        type='link'
        size='small'
        onClick={onClick}
      >
        Undo
      </Button>
    );
  }

  return (
    <Button
      type='primary'
      size='small'
      danger
      onClick={onClick}
    >
      Delete
    </Button>
  );
}

export default AuctionBidRuleDeleteCell;