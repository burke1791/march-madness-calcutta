import React from 'react';
import { Col, Divider, Row } from 'antd';

/**
 * @typedef SettingsDividerProps
 * @property {('start'|'center'|'end'|'space-around'|'space-between'|'space-evenly')} justify 
 * @property {('center'|'left'|'right')} dividerOrientation
 * @property {Object} children
 */

/**
 * @component SettingsDivider
 * @param {SettingsDividerProps} props 
 */
function SettingsDivider(props) {

  return (
    <Row justify={props.justify || 'center'}>
      <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
        <Divider orientation={props.dividerOrientation || 'left'}>
          {props.children}
        </Divider>
      </Col>
    </Row>
  );
}

export default SettingsDivider;