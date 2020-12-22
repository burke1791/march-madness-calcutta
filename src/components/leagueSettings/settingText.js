import React from 'react';

import { Col } from 'antd';
import 'antd/dist/antd.css';

function SettingText(props) {

  return (
    <Col flex={0}>
      <div style={{ textAlign: props.textAlign }}>
        <span>{props.text}</span>
      </div>
    </Col>
  );
}

export default SettingText;