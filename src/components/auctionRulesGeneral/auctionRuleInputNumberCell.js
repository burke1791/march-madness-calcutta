import React from 'react';
import { InputNumber } from 'antd';

/**
 * @typedef AuctionRule
 * @property {Number} SettingParameterId
 * @property {String} [DisplayPrefix]
 * @property {String} [DisplaySuffix]
 * @property {String} [TrailingText]
 * @property {String} SettingValue
 * @property {Number} [DecimalPrecision]
 * @property {Number} [MinValue]
 * @property {Number} [MaxValue]
 */

/**
 * @typedef AuctionRuleInputNumberCellProps
 * @property {Object} rule
 * @property {Function} onChange
 * @property {Boolean} disabled
 */

/**
 * @component
 * @param {AuctionRuleInputNumberCellProps} props 
 */
function AuctionRuleInputNumberCell(props) {

  const onChange = (value) => {
    props.onChange(props.rule.SettingParameterId, value);
  }

  const formatter = (value) => {
    const { DisplayPrefix, DisplaySuffix, TrailingText } = props.rule;

    const prefix = DisplayPrefix == null ? '' : DisplayPrefix + ' ';
    const suffix = DisplaySuffix == null ? '' : ' ' + DisplaySuffix;
    const trailingText = TrailingText == null ? '' : ' ' + TrailingText;

    return `${prefix}${value}${suffix}${trailingText}`;
  }

  return (
    <InputNumber
      defaultValue={props.rule.SettingValue == '' ? undefined : props.rule.SettingValue}
      precision={props.rule.DecimalPrecision}
      formatter={formatter}
      disabled={props.disabled}
      parser={value => value.replace(/\$\s?|\s?\%/g, '')} // hard-coding the $ and % in the parser for now
      min={props.rule.MinValue == null ? undefined : props.rule.MinValue}
      max={props.rule.MaxValue == null ? undefined : props.rule.MaxValue}
      size='small'
      onChange={onChange}
      style={{ width: '90%' }}
    />
  );
}

export default AuctionRuleInputNumberCell;