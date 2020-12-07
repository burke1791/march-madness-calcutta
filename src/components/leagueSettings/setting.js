import React, { useState } from 'react';

import { InputNumber, Switch, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { SETTING_TYPES } from '../../utilities/constants';

function Setting(props) {

  const [newValue, setNewValue] = useState();

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
            defaultValue={props.serverValue == '' ? undefined : +props.serverValue}
            precision={props.precision}
            formatter={value => `${props.prefix == '' ? props.prefix : props.prefix + ' '}${value}${props.suffix == '' ? props.suffix : ' ' + props.suffix}`}
            parser={value => value.replace(/\$\s?|\s?\%/g, '')}
            min={props.minVal == null ? undefined : props.minVal}
            max={props.maxVal == null ? undefined : props.maxVal}
            size='small'
            onChange={onChange}
            style={{ width: '90%' }}
          />
        </div>
      );
    } else if (props.type === SETTING_TYPES.BOOLEAN) {
      return (
        <div className='settingInput' style={{ textAlign: 'center' }}>
          <Switch 
            defaultChecked={props.settingValue}
            size='small'
            onChange={onChange}
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