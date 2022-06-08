import React, { Fragment, useRef, useState } from 'react';
import { Table, Tooltip } from 'antd';
import './auctionRules.css';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';
import { useLeagueState } from '../../context/leagueContext';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import AuctionRuleInputNumberCell from './auctionRuleInputNumberCell';
import AuctionRuleCheckboxCell from './auctionRuleCheckboxCell';
import AuctionRulesDisplay from './auctionRulesDisplay';
import AuctionRules from './auctionRules';

const { Column } = Table;

function GeneralRulesTest() {

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

  }

  return (
    <AuctionRules
      getEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS}/${leagueId}`}
      postEndpoint={LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_SETTINGS}
      ruleKey='SettingParameterId'
      isRuleChanged={!!ruleChangedEvent}
      getNewRules={packageChangedRules}
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

export default GeneralRulesTest;