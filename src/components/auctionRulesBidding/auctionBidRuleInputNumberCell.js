import { InputNumber } from 'antd';
import React from 'react';

/**
 * @typedef AuctionBidRuleInputNumberCellProps
 * @property {Number} ruleId
 * @property {String} name
 * @property {Number} value
 * @property {Function} onChange
 */

/**
 * @component AuctionBidRuleInputNumberCell
 * @param {AuctionBidRuleInputNumberCellProps} props
 */
function AuctionBidRuleInputNumberCell(props) {

  const onChange = (value) => {
    props.onChange(props.ruleId, props.name, value);
  }

  const formatter = (value) => {
    return `$ ${value}`
  }

	return (
    <InputNumber
      defaultValue={props.value}
      precision={props.precision || 0}
      formatter={formatter}
      parser={value => value.replace(/\$\s/g, '')}
      size='small'
      onChange={onChange}
      style={{ width: '90%' }}
    />
	);
}

export default AuctionBidRuleInputNumberCell;