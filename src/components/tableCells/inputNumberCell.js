import React from 'react';
import { InputNumber } from 'antd';

/**
 * @typedef InputNumberCellProps
 * @property {Number} value
 * @property {String} name
 * @property {Function} [formatter]
 * @property {Function} [parser]
 * @property {Number} [precision]
 * @property {Any} [addonBefore]
 * @property {Any} [addonAfter]
 * @property {Function} onChange
 */

/**
 * @component
 * @param {InputNumberCellProps} props 
 */
function InputNumberCell(props) {

  const onChange = (value) => {
    props.onChange(props.name, value);
  }

  const parser = (value) => {
    return value;
  }

  return (
    <InputNumber
      defaultValue={props.value}
      precision={props.precision || 0}
      formatter={props.formatter}
      parser={props.parser || parser}
      addonBefore={props.addonBefore}
      addonAfter={props.addonAfter}
      size='small'
      onChange={onChange}
      style={{ width: '90%' }}
    />
	);
}

export default InputNumberCell;