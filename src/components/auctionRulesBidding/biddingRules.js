import React, { useRef, useState } from 'react';
import { Table } from 'antd';
import { useLeagueState } from '../../context/leagueContext';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import AuctionRules from '../auctionRules/auctionRules';
import AuctionBidRuleInputNumberCell from './auctionBidRuleInputNumberCell';
import AuctionBidRuleDeleteCell from './auctionBidRuleDeleteCell';

const { Column } = Table;

const bidRuleTemplate = {
  MinThresholdExclusive: null,
  MaxThresholdInclusive: null,
  MinIncrement: null,
  IsNewRule: true
};

function BiddingRules() {

  const [ruleChangedEvent, setRuleChangedEvent] = useState(null);

  const { leagueId } = useLeagueState();

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
    return (
      <AuctionBidRuleInputNumberCell
        ruleId={ruleId}
        name={name}
        value={value}
        addonBefore='$'
        isDeleted={rulesRef.current[ruleId]?.isDeleted || false}
        onChange={ruleValueChanged}
      />
    );
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
      return {
        auctionBidRuleId: ruleId.includes('newRule') ? null : ruleId,
        minThreshold: rulesRef.current[ruleId].minThresholdExclusive != undefined ? rulesRef.current[ruleId].minThresholdExclusive : null,
        maxThreshold: rulesRef.current[ruleId].maxThresholdInclusive != undefined ? rulesRef.current[ruleId].maxThresholdInclusive : null,
        minIncrement: rulesRef.current[ruleId].minIncrement != undefined ? rulesRef.current[ruleId].minIncrement : null,
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
      <Column
        render={(text, record) => renderRuleDeleteCell(record.AuctionBidRuleId, record.IsNewRule, record.deleteNewRule)}
      />
    </AuctionRules>
  )
}

export default BiddingRules;