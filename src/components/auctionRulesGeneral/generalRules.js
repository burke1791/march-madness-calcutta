import React, { Fragment, useRef, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import AuctionRuleInputNumberCell from './auctionRuleInputNumberCell';
import AuctionRuleCheckboxCell from './auctionRuleCheckboxCell';
import AuctionRules from '../auctionRules/auctionRules';

const { Column } = Table;

function GeneralRules() {

  const [ruleChangedEvent, setRuleChangedEvent] = useState(null);

  const { leagueId } = useLeagueState();

  const rulesRef = useRef({});

  const ruleValueChanged = (settingParameterId, value) => {
    rulesRef.current[settingParameterId] = value;
    setRuleChangedEvent(new Date().valueOf());
  }

  const renderRuleValueCell = (text, record) => {
    if (record.DataType == 'Number') {
      return (
        <AuctionRuleInputNumberCell
          rule={record}
          onChange={ruleValueChanged}
        />
      );
    } else if (record.DataType == 'Boolean') {
      return (
        <AuctionRuleCheckboxCell
          rule={record}
          onChange={ruleValueChanged}
        />
      );
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
      getEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS}/${leagueId}?settingClass=Auction`}
      postEndpoint={LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_SETTINGS}
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