import React, { useState, useEffect } from 'react';

import { InputNumber, Switch, Col } from 'antd';
import 'antd/dist/antd.css';
import SettingText from './settingText';
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
      group: props.settingGroup,
      settingParameterId: props.settingId,
      settingValue: props.suffix == '%' ? +value / 100 : value
    };

    if (props.settingGroup == 'auction') {
      newSetting.type = props.settingGroup;
    } else if (props.settingGroup == 'payout' && props.settingIndex == 0) {
      newSetting.type = 'payoutRate';
    } else if (props.settingGroup == 'payout' && props.settingIndex == 1) {
      newSetting.type = 'payoutThreshold';
    }

    let updatedSettings = newSettings?.length ? [...newSettings] : [];
    
    let currentIndex = updatedSettings.findIndex(obj => {
      return obj?.settingParameterId == props.settingId &&
             obj?.group == newSetting.group &&
             obj?.type == newSetting.type
    });

    if (currentIndex === -1) {
      updatedSettings.push(newSetting);
    } else {
      updatedSettings[currentIndex] = newSetting;
    }

    settingsDispatch({ type: 'update', key: 'newSettings', value: updatedSettings });
  }

  const generateSettingInput = () => {
    if (props.type === SETTING_TYPES.INPUT_NUMBER) {

      return (
        <div className='settingInput' style={{ textAlign: 'center' }}>
          <InputNumber
            // defaultValue={props.serverValue == '' ? undefined : +props.serverValue}
            value={value == '' ? undefined : value}
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
            checked={String(value).toLowerCase() == 'true' ? true : false} // hack-job
            size='small'
            onChange={onChange}
          />
        </div>
      );
    }
  }

  return (
    <React.Fragment>
      <SettingText text={props.leadingText} textAlign='right' />
      <Col span={2}>
        {generateSettingInput()}
      </Col>
      <SettingText text={props.trailingText} textAlign='left' />
    </React.Fragment>
  );
}

export default Setting;