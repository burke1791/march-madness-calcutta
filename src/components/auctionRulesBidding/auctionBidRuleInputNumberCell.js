import React from 'react';
import { DeleteTwoTone } from '@ant-design/icons';
import { InputNumber } from 'antd';

/**
 * @typedef AuctionBidRuleInputNumberCellProps
 * @property {Number} ruleId
 * @property {String} name
 * @property {Number} value
 * @property {Function} [formatter]
 * @property {Function} [parser]
 * @property {Number} [precision]
 * @property {Any} [addonBefore]
 * @property {Any} [addonAfter]
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
    if (value == '') return value;

    let formattedValue = Number(value);
    if (props.formatter) {
      formattedValue = props.formatter(formattedValue);
    }

    if (props.precision) {
      formattedValue = formattedValue.toFixed(props.precision);
    }

    return formattedValue;
  }

  const parser = (value) => {
    return value.replace(/\$\s/g, '');
  }

	return (
    <InputNumber
      status={props.isDeleted ? 'warning' : null}
      prefix={props.isDeleted ? <DeleteTwoTone /> : null}
      value={props.value}
      formatter={formatter}
      parser={props.parser || parser}
      addonBefore={props.addonBefore}
      addonAfter={props.addonAfter}
      size='small'
      onChange={onChange}
      style={{ width: '90%' }}
    />
	);
}

export default AuctionBidRuleInputNumberCell;