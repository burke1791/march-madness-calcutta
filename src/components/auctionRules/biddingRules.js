import React, { useEffect, useRef, useState, Fragment } from 'react';
import { Row, Col, Button, Table } from 'antd';
import './auctionRules.css';
import { useAuthState } from '../../context/authContext';
import { useLeagueState } from '../../context/leagueContext';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';

const { Column } = Table;

function BiddingRules() {

  const [loading, setLoading] = useState(true);
  const [ruleChangedEvent, setRuleChangedEvent] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const { leagueId } = useLeagueState();
  const { authenticated } = useAuthState();

  const rulesRef = useRef({});

  const [rules, rulesFetchDate, getRules] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_AUCTION_BID_RULES}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated]
  });

  const [rulesUpdate, rulesUpdateReturnDate, updateRules] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.SET_AUCTION_BID_RULES}/${leagueId}`,
    method: 'POST',
    conditions: [authenticated]
  });

  useEffect(() => {
    if (authenticated && leagueId) {
      downloadRules();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    if (rulesFetchDate != undefined) {
      setLoading(false);
    }
  }, [rulesFetchDate]);

  useEffect(() => {
    console.log(rulesUpdate);
    setUpdateLoading(false);
    if (rulesUpdateReturnDate != undefined) {
      downloadRules();
    }
  }, [rulesUpdateReturnDate]);

  const downloadRules = () => {
    rulesRef.current = {};
    setLoading(true);
    getRules();
  }

  const ruleValueChanged = (ruleId, name, value) => {
    rulesRef.current[ruleId][name] = value;
    setRuleChangedEvent(new Date().valueOf());
  }

  const getRowClassName = (record) => {
    if (isChanged(record.ruleId)) return 'rule-changed';

    return '';
  }

  const isChanged = (ruleId) => {
    if (rulesRef.current[ruleId] == undefined) {
      return false;
    }

    return true;
  }

  // const renderRuleValueCell = (text, record) => {
  //   if (record.DataType == 'Number') {
  //     return (
  //       <AuctionRuleInputNumberCell
  //         rule={record}
  //         onChange={ruleValueChanged}
  //       />
  //     );
  //   } else if (record.DataType == 'Boolean') {
  //     return (
  //       <AuctionRuleCheckboxCell
  //         rule={record}
  //         onChange={ruleValueChanged}
  //       />
  //     );
  //   } else {
  //     return text;
  //   }
  // }

  const sendUpdateRulesRequest = () => {
    setUpdateLoading(true);

    // get all updated rules changes
    const ruleIds = Object.keys(rulesRef.current);

    const newRules = ruleIds .map(ruleId => {
      return {
        auctionBidRuleId: ruleId,
        minThreshold: rulesRef.current[ruleId]
      }
    })
  }

  return (
    <Fragment>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Table
            loading={loading}
            dataSource={rules}
            rowKey='AuctionBidRuleId'
            rowClassName={getRowClassName}
            size='small'
            pagination={false}
            style={{ width: '100%' }}
          >
            <Column
              title='Minimum (Exclusive)'
              dataIndex='MinThresholdExclusive'
              render={renderRuleValueCell}
            />
            <Column
              dataIndex='SettingValue'
              width='30%'
              render={renderRuleValueCell}
            />
          </Table>
        </Col>
      </Row>
      <Row justify='center'>
        <Button
          type='primary'
          style={{ marginTop: 8 }}
          disabled={!ruleChangedEvent}
          onClick={sendUpdateRulesRequest}
          loading={updateLoading}
        >
          Save Changes
        </Button>
      </Row>
    </Fragment>
  )
}

export default BiddingRules;