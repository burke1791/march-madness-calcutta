import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useAuthState } from '../../context/authContext';
import { useLeagueState } from '../../context/leagueContext';
import useData from '../../hooks/useData';
import { API_CONFIG } from '../../utilities/constants';
import AuctionRulesDisplay from './auctionRulesDisplay';

/**
 * @typedef AuctionRulesProps
 * @property {String} getEndpoint
 * @property {Function} [getPostProcess]
 * @property {String} postEndpoint
 * @property {String} ruleKey
 * @property {Boolean} isRuleChanged
 * @property {Function} getNewRules - packages the changed rules into a payload to send to the postEndpoint
 * @property {Function} clearRulesRef - clears the ref containing the updated rules values
 * @property {Boolean} [showNewRuleButton]
 * @property {String} [newRuleButtonText]
 * @property {any} [newRuleTemplate]
 * @property {Array<any>} children - List of antd <Column /> components
 */

/**
 * @component AuctionRules
 * @param {AuctionRulesProps} props
 */
function AuctionRules(props) {

  const [dataLoading, setDataLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const { authenticated } = useAuthState();
  const { leagueId } = useLeagueState();

  const [rules, rulesFetchDate, getRules] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: props.getEndpoint,
    method: 'GET',
    processData: props.getPostProcess || null,
    conditions: [authenticated]
  });

  const [rulesUpdate, rulesUpdateReturnDate, updateRules] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: props.postEndpoint,
    method: 'POST',
    conditions: [authenticated]
  });

  useEffect(() => {
    if (authenticated) {
      downloadRules();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    if (rulesFetchDate != undefined) {
      console.log(rules);
      setDataLoading(false);
      props.clearRulesRef();
    }
  }, [rulesFetchDate]);

  useEffect(() => {
    // display the error message from the server
    setUpdateLoading(false);

    if (rulesUpdate && rulesUpdate.length > 0 && rulesUpdate[0]?.Error) {
      message.error(rulesUpdate[0].Error, 5);
    } else if (rulesUpdate && rulesUpdate.length > 0 && rulesUpdate[0]?.Info) {
      message.info(rulesUpdate[0].Info, 5);
      downloadRules();
    } else if (rulesUpdateReturnDate != undefined) {
      downloadRules();
    }
  }, [rulesUpdateReturnDate]);

  const downloadRules = () => {
    setDataLoading(true);
    getRules();
  }

  const sendUpdateRulesRequest = () => {
    setUpdateLoading(true);
    const payload = props.getNewRules();
    updateRules(payload);
  }

  return (
    <AuctionRulesDisplay
      tableLoading={dataLoading}
      dataSource={rules}
      dataSourceChanged={rulesFetchDate?.valueOf()}
      rowKey={props.ruleKey}
      updateLoading={updateLoading}
      isRuleChanged={props.isRuleChanged}
      sendUpdateRulesRequest={sendUpdateRulesRequest}
      showNewRuleButton={props.showNewRuleButton}
      newRuleButtonText={props.newRuleButtonText}
      newRuleTemplate={props.newRuleTemplate}
    >
      {props.children}
    </AuctionRulesDisplay>
  );
}

export default AuctionRules;