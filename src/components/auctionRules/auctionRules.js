import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Row, Col, Button, Table, Tooltip } from 'antd';
import './auctionRules.css';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';
import { useLeagueState } from '../../context/leagueContext';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import AuctionRuleInputNumberCell from './auctionRuleInputNumberCell';
import AuctionRuleCheckboxCell from './auctionRuleCheckboxCell';

const { Column } = Table;

function AuctionRules() {

  const [loading, setLoading] = useState(true);
  const [ruleChangedEvent, setRuleChangedEvent] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const { authenticated } = useAuthState();
  const { leagueId } = useLeagueState();

  const rulesRef = useRef({});

  const [rules, rulesFetchDate, getRules] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated]
  });

  const [rulesUpdate, rulesUpdateReturnDate, updateRules] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_SETTINGS,
    method: 'POST',
    conditions: [authenticated]
  });

  useEffect(() => {
    if (authenticated && leagueId) {
      getRules();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    console.log(rules);
    if (rulesFetchDate != undefined) {
      setLoading(false);
      rulesRef.current = {};
    }
  }, [rulesFetchDate]);

  useEffect(() => {
    console.log(rulesUpdate);
    setUpdateLoading(false);
    if (rulesUpdateReturnDate != undefined) {
      rulesRef.current = {};
      setLoading(true);
      getRules();
    }
  }, [rulesUpdateReturnDate]);

  const ruleValueChanged = (settingParameterId, value) => {
    rulesRef.current[settingParameterId] = value;
    setRuleChangedEvent(new Date().valueOf());
    console.log(rulesRef);
  }

  const getRowClassName = (record) => {
    if (isChanged(record.SettingParameterId)) return 'rule-changed';

    return '';
  }

  const isChanged = (settingParameterId) => {
    if (rulesRef.current[settingParameterId] == undefined) {
      return false;
    }

    return true;
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

  const sendUpdateRulesRequest = () => {
    setUpdateLoading(true);

    // get all updated rules changes
    const settingIds = Object.keys(rulesRef.current);

    const newRules = settingIds.map(settingId => {
      return {
        settingParameterId: settingId,
        settingValue: rulesRef.current[settingId]
      };
    });

    const payload = {
      leagueId: leagueId,
      settings: newRules
    }

    updateRules(payload);
  }

  return (
    <Fragment>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Table
            loading={loading}
            dataSource={rules}
            rowKey='SettingParameterId'
            rowClassName={getRowClassName}
            size='small'
            pagination={false}
            style={{ width: '100%' }}
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
  );
}

export default AuctionRules;