import React from 'react';
import { DeleteTwoTone } from '@ant-design/icons';
import { InputNumber } from 'antd';

/**
 * @typedef AuctionBidRuleInputNumberCellProps
 * @property {Number} ruleId
 * @property {String} name
 * @property {Number} value
 * @property {Boolean} isDeleted
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
      status={props.isDeleted ? 'warning' : null}
      prefix={props.isDeleted ? <DeleteTwoTone /> : null}
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