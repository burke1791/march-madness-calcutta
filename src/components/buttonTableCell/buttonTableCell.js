import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import 'antd/dist/antd.css';


/**
 * @typedef {Object} ButtonTableCellProps
 * @property {('primary'|'ghost'|'dashed'|'link'|'text'|'default')} type - button type
 * @property {Boolean} danger - danger status
 * @property {('small'|'middle'|'large')} size - button size
 * @property {Function} onClick - function to run after the button is clicked
 * @property {Boolean} [animated] - whether or not to display the loading animation when clicked
 * @property {Number} cancelLoading - stops the loading animation when changed
 * @property {Object} children - any valid react component
 */

/**
 * @component ButtonTableCell
 * @param {ButtonTableCellProps} props 
 */
function ButtonTableCell(props) {

  const [loading, setLoading] = useState(false);

  const buttonClicked = (event) => {
    if (props.animated == undefined || props.animated) {
      setLoading(true);
    }

    props.onClick(event);
  }

  useEffect(() => {
    if (props.cancelLoading) {
      setLoading(false);
    }
  }, [props.cancelLoading]);

  return (
    <Button
      type={props.type}
      danger={props.danger}
      size={props.size}
      loading={loading}
      onClick={buttonClicked}
    >
      {props.children}
    </Button>
  );
}

export default ButtonTableCell;