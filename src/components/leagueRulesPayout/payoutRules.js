import React, { Fragment, useRef, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { useLeagueState } from '../../context/leagueContext';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import AuctionRules from '../auctionRules/auctionRules';
import { LeaguePayoutRuleInputNumberCell } from './leaguePayoutRuleInputNumberCell';

const { Column } = Table;

function PayoutRules() {

  const [ruleChangedEvent, setRuleChangedEvent] = useState(null);

  const { leagueId } = useLeagueState();

  const rulesRef = useRef({});

  const packageChangedRules = () => {
    const payload = {
      leagueId: leagueId
    }

    const newRulesKeys = Object.keys(rulesRef.current);
    const newRules = newRulesKeys.map(ruleId => {
      return {
        tournamentPayoutId: ruleId,
        payoutRate: rulesRef.current[ruleId].payoutRateValue || null,
        payoutThreshold: rulesRef.current[ruleId].payoutThreshold || null
      }
    });

    payload.settings = newRules;

    return payload;
  }

  const payoutRateChanged = (ruleId, name, value) => {
    if (rulesRef.current[ruleId] === undefined) {
      rulesRef.current[ruleId] = { [name]: value / 100 };
    } else {
      rulesRef.current[ruleId][name] = value / 100;
    }

    setRuleChangedEvent(new Date().valueOf());
  }

  const clearRulesRef = () => {
    rulesRef.current = {};
  }

  return (
    <AuctionRules
      getEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_PAYOUT_SETTINGS}/${leagueId}`}
      postEndpoint={`${LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_PAYOUT_SETTINGS}`}
      ruleKey='TournamentPayoutId'
      isRuleChanged={!!ruleChangedEvent}
      getNewRules={packageChangedRules}
      clearRulesRef={clearRulesRef}
    >
      <Column
        title='Rule'
        dataIndex='PayoutName'
        width='60%'
        render={(text, record) => {
          return (
            <Fragment>
              <span>{record.PayoutName} </span>
              <Tooltip placement='top' title={record.Tooltip}>
                <QuestionCircleTwoTone />
              </Tooltip>
            </Fragment>
          );
        }}
      />
      <Column
        title='Payout Rate'
        dataIndex='PayoutRateValue'
        width='40%'
        render={(text, record) => {
          const payoutRate = record.PayoutRateSuffix == '%' ? (record.PayoutRateValue * 100).toFixed(2) : record.PayoutRateValue.toFixed(2);
          return (
            <LeaguePayoutRuleInputNumberCell
              ruleId={record.TournamentPayoutId}
              name='payoutRateValue'
              value={payoutRate}
              addonBefore={record.PayoutRatePrefix}
              addonAfter={record.PayoutRateSuffix}
              precision={record.PayoutRatePrecision}
              onChange={payoutRateChanged}
            />
          );
        }}
      />
    </AuctionRules>
  );
}

export default PayoutRules;