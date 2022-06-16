import React, { useRef, useState, Fragment } from 'react';
import { Row, Col, Button, Table } from 'antd';
import { useLeagueState } from '../../context/leagueContext';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import AuctionRules from '../auctionRules/auctionRules';
import AuctionBidRuleInputNumberCell from './auctionBidRuleInputNumberCell';

const { Column } = Table;

const bidRuleTemplate = {
  MinThresholdExclusive: null,
  MaxThresholdInclusive: null,
  MinIncrement: null
};

function BiddingRules() {

  const [ruleChangedEvent, setRuleChangedEvent] = useState(null);

  const { leagueId } = useLeagueState();

  const rulesRef = useRef({});

  const ruleValueChanged = (ruleId, name, value) => {
    console.log(rulesRef.current);
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
        onChange={ruleValueChanged}
      />
    );
  }

  const packageChangedRules = () => {
    
  }

  const clearRulesRef = () => {
    rulesRef.current = {};
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
        render={(text, record) => renderRuleValueCell(record.AuctionBidRuleId, 'MinThresholdExclusive', record.MinThresholdExclusive)}
      />
      <Column
        title='Upper Bound'
        dataIndex='MaxThresholdInclusive'
        render={(text, record) => renderRuleValueCell(record.AuctionBidRuleId, 'MaxThresholdInclusive', record.MaxThresholdInclusive)}
      />
      <Column
        title='Min Bid Increment'
        dataIndex='MinIncrement'
        render={(text, record) => renderRuleValueCell(record.AuctionBidRuleId, 'MinIncrement', record.MinIncrement)}
      />
    </AuctionRules>
  )
}

export default BiddingRules;