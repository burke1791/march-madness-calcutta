import React, { Fragment, useRef, useState } from 'react';
import { Table, Tooltip } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import { useLeagueState } from '../../context/leagueContext';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import AuctionRules from '../auctionRules/auctionRules';

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
        payoutRate: rulesRef.current[ruleId].payoutRate,
        payoutThreshold: rulesRef.current[ruleId].payoutThreshold
      }
    });

    payload.settings = newRules;

    return payload;
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
        width='50%'
        render={(text, record) => {
          return (
            <Fragment>
              <span>{record.PayoutName}</span>
              <Tooltip placement='top' title={record.Tooltip}>
                <QuestionCircleTwoTone />
              </Tooltip>
            </Fragment>
          );
        }}
      />
      <Column
        title='Payout'
        dataIndex='PayoutRateValue'
        width='25%'
        render={(text, record) => {
          
        }}
    </AuctionRules>
  );
}

export default PayoutRules;