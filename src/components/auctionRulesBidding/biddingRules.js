import React, { useRef, useState } from 'react';
import { Table, Typography } from 'antd';
import { useLeagueState } from '../../context/leagueContext';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import AuctionRules from '../auctionRules/auctionRules';
import AuctionBidRuleInputNumberCell from './auctionBidRuleInputNumberCell';
import AuctionBidRuleDeleteCell from './auctionBidRuleDeleteCell';

const { Column } = Table;
const { Text } = Typography;

const bidRuleTemplate = {
  MinThresholdExclusive: null,
  MaxThresholdInclusive: null,
  MinIncrement: null,
  IsNewRule: true
};

function BiddingRules() {

  const [ruleChangedEvent, setRuleChangedEvent] = useState(null);

  const { leagueId, roleId } = useLeagueState();

  const rulesRef = useRef({});

  const ruleValueChanged = (ruleId, name, value) => {
    if (rulesRef.current[ruleId] === undefined) {
      rulesRef.current[ruleId] = { [name]: value }
    } else {
      rulesRef.current[ruleId][name] = value;
    }

    setRuleChangedEvent(new Date().valueOf());
  }

  const renderRuleValueCell = (ruleId, name, value) => {
    const changedRule = rulesRef.current[ruleId];
    let ruleValue = value;

    if (changedRule !== undefined && changedRule[name] !== undefined) {
      ruleValue = changedRule[name];
    }

    const precision = ruleValue % 1 == 0 ? 0 : 2;

    if (roleId == 1 || roleId == 2) {
      return (
        <AuctionBidRuleInputNumberCell
          ruleId={ruleId}
          name={name}
          value={ruleValue}
          addonBefore='$'
          precision={precision}
          isDeleted={rulesRef.current[ruleId]?.isDeleted || false}
          onChange={ruleValueChanged}
        />
      );
    } else {
      const ruleText = ruleValue !== null ? `$${Number(ruleValue).toFixed(precision)}` : '';
      return <Text>{ruleText}</Text>;
    }
    
  }

  const renderRuleDeleteCell = (ruleId, isNewRule, deleteNewRule) => {
    return (
      <AuctionBidRuleDeleteCell
        ruleId={ruleId}
        isDeleted={rulesRef.current[ruleId]?.isDeleted || false}
        isNewRule={!!isNewRule}
        deleteNewRule={deleteNewRule}
        onClick={handleRuleDelete}
      />
    );
  }

  const handleRuleDelete = (ruleId, isNewRule = false) => {
    if (isNewRule) {
      clearRulesRef(ruleId);
    } else {
      const currentFlag = rulesRef.current[ruleId]?.isDeleted || false;
      ruleValueChanged(ruleId, 'isDeleted', !currentFlag);
    }
  }

  const packageChangedRules = () => {
    const payload = { leagueId: leagueId };
    const keys = Object.keys(rulesRef.current);

    const newRules = keys.map(ruleId => {
      const minThreshold = rulesRef.current[ruleId].minThresholdExclusive !== null ? rulesRef.current[ruleId].minThresholdExclusive : 0;
      const maxThreshold = rulesRef.current[ruleId].maxThresholdInclusive !== null ? rulesRef.current[ruleId].maxThresholdInclusive : 0;
      const minIncrement = rulesRef.current[ruleId].minIncrement !== null ? rulesRef.current[ruleId].minIncrement : 0;

      return {
        auctionBidRuleId: ruleId.includes('newRule') ? null : ruleId,
        minThreshold: minThreshold == 0 ? -1 : minThreshold,
        maxThreshold: maxThreshold == 0 ? -1 : maxThreshold,
        minIncrement: minIncrement == 0 ? -1 : minIncrement,
        isDeleted: !!rulesRef.current[ruleId].isDeleted
      };
    });

    payload.rules = newRules;

    return payload;
  }

  const clearRulesRef = (ruleId) => {
    if (ruleId != undefined) {
      rulesRef.current[ruleId] = undefined;
    } else {
      rulesRef.current = {};
    }

    setRuleChangedEvent(null);
  }

  return (
    <AuctionRules
      getEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.GET_AUCTION_BID_RULES}/${leagueId}`}
      postEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.SET_AUCTION_BID_RULES}/${leagueId}`}
      ruleKey='AuctionBidRuleId'
      isRuleChanged={!!ruleChangedEvent}
      getNewRules={packageChangedRules}
      clearRulesRef={clearRulesRef}
      showNewRuleButton={true}
      newRuleButtonText='New Bid Rule'
      newRuleTemplate={bidRuleTemplate}
    >
      <Column
        title='Lower Bound'
        dataIndex='MinThresholdExclusive'
        render={(text, record) => renderRuleValueCell(record.AuctionBidRuleId, 'minThresholdExclusive', record.MinThresholdExclusive)}
      />
      <Column
        title='Upper Bound'
        dataIndex='MaxThresholdInclusive'
        render={(text, record) => renderRuleValueCell(record.AuctionBidRuleId, 'maxThresholdInclusive', record.MaxThresholdInclusive)}
      />
      <Column
        title='Min Bid Increment'
        dataIndex='MinIncrement'
        render={(text, record) => renderRuleValueCell(record.AuctionBidRuleId, 'minIncrement', record.MinIncrement)}
      />
      { roleId == 1 || roleId == 2 ?
        <Column
          render={(text, record) => renderRuleDeleteCell(record.AuctionBidRuleId, record.IsNewRule, record.deleteNewRule)}
        />
        :
        null
      }
    </AuctionRules>
  )
}

export default BiddingRules;