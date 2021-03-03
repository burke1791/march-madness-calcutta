import React from 'react';
import { Row, Col, Button } from 'antd';
import 'antd/dist/antd.css';

function SettingsUpdateButton(props) {

  return (
    <Row justify='center'>
      <Col span={12} style={{ textAlign: 'center' }}>
        <hr></hr>
        <Button
          type='primary'
          loading={props.loading}
          onClick={props.onClick}
        >
          {props.text}
        </Button>
      </Col>
    </Row>
  );
}

export default SettingsUpdateButton;