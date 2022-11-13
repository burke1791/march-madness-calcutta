import React, { useState, useRef } from 'react';
import { Table } from 'antd';
import { useLeagueState } from '../../context/leagueContext';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import AuctionRules from '../auctionRules/auctionRules';
import { AuctionTaxRuleInputNumberCell } from './auctionTaxRuleInputNumberCell';
import { AuctionTaxRuleDeleteCell } from './auctionTaxRuleDeleteCell';

const { Column } = Table;

const taxRuleTemplate = {
  MinThresholdExclusive: 0,
  MaxThresholdInclusive: 0,
  TaxRate: 0,
  IsNewRule: true
};

function TaxRules() {

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
      <AuctionTaxRuleInputNumberCell
        ruleId={ruleId}
        name={name}
        value={value}
        addonBefore={name == 'taxRate' ? null : '$'}
        addonAfter={name =='taxRate' ? '%' : null}
        precision={2}
        isDeleted={rulesRef.current[ruleId]?.isDeleted || false}
        onChange={ruleValueChanged}
      />
    )
  }

  const renderRuleDeleteCell = (ruleId, isNewRule, deleteNewRule) => {
    return (
      <AuctionTaxRuleDeleteCell
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
        auctionTaxRuleId: ruleId.includes('newRule') ? null : ruleId,
        minThreshold: rulesRef.current[ruleId].minThresholdExclusive != undefined ? rulesRef.current[ruleId].minThresholdExclusive : null,
        maxThreshold: rulesRef.current[ruleId].maxThresholdInclusive != undefined ? rulesRef.current[ruleId].maxThresholdInclusive : null,
        taxRate: +rulesRef.current[ruleId]?.taxRate != undefined ? +rulesRef.current[ruleId]?.taxRate / 100 : null,
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
      getEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.AUCTION_TAX_RULE}/${leagueId}`}
      postEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.AUCTION_TAX_RULE}/${leagueId}`}
      ruleKey='AuctionTaxRuleId'
      isRuleChanged={!!ruleChangedEvent}
      getNewRules={packageChangedRules}
      clearRulesRef={clearRulesRef}
      showNewRuleButton
      newRuleButtonText='New Tax Bracket'
      newRuleTemplate={taxRuleTemplate}
    >
      <Column
        title='Lower Bound'
        dataIndex='MinThresholdExclusive'
        render={(text, record) => renderRuleValueCell(record.AuctionTaxRuleId, 'minThresholdExclusive', record.MinThresholdExclusive)}
      />
      <Column
        title='Upper Bound'
        dataIndex='MaxThresholdInclusive'
        render={(text, record) => renderRuleValueCell(record.AuctionTaxRuleId, 'maxThresholdInclusive', record.MaxThresholdInclusive)}
      />
      <Column
        title='Tax Rate'
        dataIndex='TaxRate'
        render={(text, record) => renderRuleValueCell(record.AuctionTaxRuleId, 'taxRate', +record.TaxRate * 100)}
      />
      <Column
        render={(text, record) => renderRuleDeleteCell(record.AuctionTaxRuleId, record.IsNewRule, record.deleteNewRule)}
      />
    </AuctionRules>
  );
}

export default TaxRules;