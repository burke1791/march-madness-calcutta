import React from 'react';
import { Col, Row } from 'antd';

/**
 * @typedef SettingsRowProps
 * @property {('start'|'center'|'end'|'space-around'|'space-between'|'space-evenly')} justify 
 * @property {Object} children
 */

/**
 * @component
 * @param {SettingsRowProps} props 
 * @returns 
 */
function SettingsRow(props) {

  return (
    <Row justify={props.justify || 'center'}>
      <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
        {props.children}
      </Col>
    </Row>
  );
}

export default SettingsRow;