import React, { Fragment, useRef, useState } from 'react';
import { Table, Tooltip, Typography } from 'antd';
import { API_CONFIG, DATA_SYNC_SERVICE_ENDPOINTS, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import AuctionRuleInputNumberCell from './auctionRuleInputNumberCell';
import AuctionRuleCheckboxCell from './auctionRuleCheckboxCell';
import AuctionRules from '../auctionRules/auctionRules';

const { Column } = Table;
const { Text } = Typography;

function GeneralRules() {

  const [ruleChangedEvent, setRuleChangedEvent] = useState(null);

  const { leagueId, roleId } = useLeagueState();

  const rulesRef = useRef({});

  const ruleValueChanged = (settingParameterId, value) => {
    rulesRef.current[settingParameterId] = value;
    setRuleChangedEvent(new Date().valueOf());
  }

  const renderRuleValueCell = (text, record) => {
    if (record.DataType == 'Number') {
      if (roleId == 1 || roleId == 2) {
        return (
          <AuctionRuleInputNumberCell
            rule={record}
            onChange={ruleValueChanged}
          />
        );
      } else {
        let ruleText = '';
        if (record.DisplayPrefix) ruleText += record.DisplayPrefix;
        ruleText += `${Number(record.SettingValue)}`;
        if (record.DisplaySuffix) ruleText += record.DisplaySuffix;
        if (record.TrailingText) ruleText += ` ${record.TrailingText}`;
        // const ruleText = `${record.DisplayPrefix}${Number(record.SettingValue).toFixed(record.DecimalPrecision || 0)}${record.DisplaySuffix} ${record.TrailingText}`;
        return (
          <Text>{ruleText}</Text>
        );
      }
    } else if (record.DataType == 'Boolean') {
      if (roleId == 1 || roleId == 2) {
        return (
          <AuctionRuleCheckboxCell
            rule={record}
            onChange={ruleValueChanged}
          />
        );
      } else {
        const ruleText = record.SettingValue == 'false' || record.SettingValue == undefined ? 'No' : 'Yes';
        return (
          <Text>{ruleText}</Text>
        )
      }
    } else {
      return text;
    }
  }

  const packageChangedRules = () => {
    const payload = {
      leagueId: leagueId
    };

    const newRulesKeys = Object.keys(rulesRef.current);
    const newRules = newRulesKeys.map(ruleId => {
      return {
        settingParameterId: ruleId,
        settingValue: rulesRef.current[ruleId]
      };
    });

    payload.settings = newRules;

    return payload;
  }

  const clearRulesRef = () => {
    rulesRef.current = {}
  }

  const rulesParser = (rules) => {
    if (rules.settings && rules.settings.length) {
      return rules.settings;
    }

    return null;
  }

  return (
    <AuctionRules
      getBaseUrl={API_CONFIG.LEAGUE_SERVICE_BASE_URL}
      getEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS}/${leagueId}?settingClass=Auction`}
      postBaseUrl={API_CONFIG.DATA_SYNC_SERVICE_BASE_URL}
      postEndpoint={DATA_SYNC_SERVICE_ENDPOINTS.UPDATE_LEAGUE_SETTINGS}
      getPostProcess={rulesParser}
      ruleKey='SettingParameterId'
      isRuleChanged={!!ruleChangedEvent}
      getNewRules={packageChangedRules}
      clearRulesRef={clearRulesRef}
    >
      <Column
        title='Rule'
        dataIndex='Name'
        width='70%'
        render={(text, record) => {
          return (
            <Fragment>
              <span>{record.Name} </span>
              <Tooltip placement='top' title={record.Description}>
                <QuestionCircleTwoTone />
              </Tooltip>
            </Fragment>
          );
        }}
      />
      <Column
        dataIndex='SettingValue'
        width='30%'
        render={renderRuleValueCell}
      />
    </AuctionRules>
  );
}

export default GeneralRules;