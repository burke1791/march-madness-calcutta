import React from 'react';
import { Input } from 'antd';

/**
 * @typedef InputCellProps
 * @property {String} value
 * @property {String} name
 * @property {Function} onChange
 */

/**
 * @component
 * @param {InputCellProps} props 
 */
function InputCell(props) {

  const onChange = (event) => {
    props.onChange(props.name, event.target.value)
  }

  return (
    <Input
      allowClear
      defaultValue={props.value}
      size='small'
      onChange={onChange}
      style={{ width: '90%' }}
    />
  );
}

export default InputCell;