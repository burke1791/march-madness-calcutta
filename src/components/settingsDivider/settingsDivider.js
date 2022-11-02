import React from 'react';
import { Divider } from 'antd';
import SettingsRow from '../settingsRow/settingsRow';

/**
 * @typedef SettingsDividerProps
 * @property {('center'|'left'|'right')} dividerOrientation
 */

/**
 * @component SettingsDivider
 * @param {SettingsDividerProps} props 
 */
function SettingsDivider(props) {

  return (
    <SettingsRow justify='center'>
      <Divider orientation={props.dividerOrientation || 'left'}>
        {props.children}
      </Divider>
    </SettingsRow>
  );
}

export default SettingsDivider;