import React, { useState, useEffect } from 'react';

import { InputNumber, Switch, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import { SETTING_TYPES } from '../../utilities/constants';
import { useSettingsDispatch, useSettingsState } from '../../context/leagueSettingsContext';

function Setting(props) {

  const [value, setValue] = useState(props.serverValue);

  const { newSettings } = useSettingsState();
  const settingsDispatch = useSettingsDispatch();

  useEffect(() => {
    // updates the setting values to match the server
    setValue(props.serverValue);
  }, [props.serverValue]);

  const onChange = (value) => {

    setValue(value);

    let newSetting = {
      settingParameterId: props.settingId,
      settingValue: props.suffix == '%' ? +value / 100 : value
    };

    let updatedSettings = newSettings?.length ? [...newSettings] : [];
    
    let currentIndex = updatedSettings.findIndex(obj => obj?.settingParameterId == props.settingId);

    if (currentIndex === -1) {
      updatedSettings.push(newSetting);
    } else {
      updatedSettings[currentIndex] = newSetting;
    }

    settingsDispatch({ type: 'update', key: 'newSettings', value: updatedSettings });
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
            // defaultValue={props.serverValue == '' ? undefined : +props.serverValue}
            value={value == '' ? undefined : +value}
            precision={props.precision}
            formatter={value => `${props.prefix == '' ? props.prefix : props.prefix + ' '}${value}${props.suffix == '' ? props.suffix : ' ' + props.suffix}`}
            parser={value => value.replace(/\$\s?|\s?\%/g, '')} // hard-coding the $ and % in the parser for now
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
            checked={props.settingValue}
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