import { InputNumber } from 'antd';
import React from 'react';

/**
 * @typedef CommissionerFeeInputProps
 * @property {('percent'|'absolute')} inputType
 * @property {Number} [minValue]
 * @property {Number} [maxValue]
 * @property {Number} [feeValue]
 * @property {Function} feeValueChange
 */

/**
 * @component
 * @param {CommissionerFeeInputProps} props 
 */
function CommissionerFeeInput(props) {

  return (
    <InputNumber
      addonBefore={props.inputType == 'absolute' ? '$' : null}
      addonAfter={props.inputType == 'percent' ? '%' : null}
      size='small'
      value={props.feeValue}
      onChange={props.feeValueChange}
      style={{ width: '100%' }}
    />
  );
}

export default CommissionerFeeInput;