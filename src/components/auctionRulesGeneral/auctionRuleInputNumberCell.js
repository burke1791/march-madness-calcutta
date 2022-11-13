import React from 'react';
import { InputNumber } from 'antd';

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