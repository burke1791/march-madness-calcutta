import React from 'react';
import { Checkbox } from 'antd';

function AuctionRuleCheckboxCell(props) {

  const getDefaultChecked = () => {
    if (props.rule.SettingValue == 'false' || props.rule.SettingValue == undefined) {
      return false;
    }

    return true;
  }

  const onChange = (event) => {
    event.stopPropagation();
    const value = event.target.checked;

    props.onChange(props.rule.SettingParameterId, value);
  }

  return (
    <Checkbox
      defaultChecked={getDefaultChecked()}
      onChange={onChange}
    />
  );
}

export default AuctionRuleCheckboxCell;