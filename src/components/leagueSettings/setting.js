import React from 'react';

import { InputNumber, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { SETTING_TYPES } from '../../utilities/constants';

function Setting(props) {

  const onChange = (value) => {
    console.log(value);
  }

  const generateLabelText = () => {
    return (
      <div className='settingLabel' style={{ textAlign: 'right' }}>
        <span>{props.labelText}</span>
      </div>
    );
  }

  const generateSettingInput = () => {
    if (props.type === SETTING_TYPES.INPUT_NUMBER) {
      return (
        <div className='settingInput' style={{ textAlign: 'center' }}>
          <InputNumber
            min={props.minVal}
            max={props.maxVal}
            size='small'
            onChange={onChange}
            style={{ width: '90%' }}
          />
        </div>
      );
    }
  }

  const generateTrailingText = () => {
    if (props.trailingText !== undefined) {
      return (
        <div className='settingTrailingText' style={{ textAlign: 'left' }}>
          <span>{props.trailingText}</span>
        </div>
      );
    }
  }

  return (
    <Row justify='center' gutter={[0, 16]}>
      <Col span={4}>
        {generateLabelText()}
      </Col>
      <Col span={4}>
        {generateSettingInput()}
      </Col>
      <Col span={4}>
        {generateTrailingText()}
      </Col>
    </Row>
  );
}

export default Setting;