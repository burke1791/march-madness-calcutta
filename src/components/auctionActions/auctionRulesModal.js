import React, { useState, useEffect, Fragment } from 'react';
import { Col, Divider, Modal, Row, Table, Typography, Tooltip } from 'antd';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import { QuestionCircleTwoTone } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Column } = Table;

/**
 * @typedef AuctionRulesModalProps
 * @property {Boolean} open
 * @property {Function} dismiss
 */

/**
 * @component
 * @param {AuctionRulesModalProps} props 
 */
function AuctionRulesModal(props) {

  return (
    <Modal
      title='Auction Rules'
      open={props.open}
      onCancel={props.dismiss}
      footer={null}
      styles={{ body: { paddingTop: 0 }}}
    >
      <Divider orientation='left'>General Rules</Divider>
      <Row>
        <GeneralRulesTable />
      </Row>
      <Divider orientation='left'>Bid Rules</Divider>
      <Row>
        <BidRulesTable />
      </Row>
      <Divider orientation='left'>Tax Brackets</Divider>
      <Row>
        <TaxBracketsTable />
      </Row>
    </Modal>
  );
}

/**
 * @typedef RulesTableWrapperProps
 * @property {String} endpoint
 * @property {String} rowKey
 * @property {String} [queryString]
 * @property {Function} [processData]
 */

/**
 * @component
 * @param {RulesTableWrapperProps} props 
 */
function RulesTableWrapper(props) {

  const [loading, setLoading] = useState(true);

  const { leagueId } = useLeagueState();
  const { authenticated } = useAuthState();

  const [rules, rulesFetchDate, getRules] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${props.endpoint}/${leagueId}${props.queryString || ''}`,
    processData: props.processData,
    method: 'GET',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (rulesFetchDate) {
      console.log(rules);
      setLoading(false);
    }
  }, [rulesFetchDate]);

  useEffect(() => {
    if (leagueId && authenticated) {
      getRules();
    }
  }, [leagueId, authenticated]);

  return (
    <Table
      dataSource={rules}
      rowKey={props.rowKey}
      size='small'
      pagination={false}
      loading={loading}
      style={{ width: '100%' }}
    >
      {props.children}
    </Table>
  );
}

function GeneralRulesTable() {

  const renderRuleValueCell = (text, record) => {
    if (record.DataType == 'Number') {
      let ruleText = '';
      if (record.DisplayPrefix) ruleText += record.DisplayPrefix;
      ruleText += `${Number(record.SettingValue)}`;
      if (record.DisplaySuffix) ruleText += record.DisplaySuffix;
      if (record.TrailingText) ruleText += ` ${record.TrailingText}`;
      // const ruleText = `${record.DisplayPrefix}${Number(record.SettingValue).toFixed(record.DecimalPrecision || 0)}${record.DisplaySuffix} ${record.TrailingText}`;
      return (
        <Text>{ruleText}</Text>
      );
    } else if (record.DataType == 'Boolean') {
      const ruleText = record.SettingValue == 'false' || record.SettingValue == undefined ? 'No' : 'Yes';
      return (
        <Text>{ruleText}</Text>
      );
    } else {
      return text;
    }
  }

  const filterRules = (rules) => {
    const desiredRules = [
      'AUCTION_INTERVAL',
      'MIN_BUYIN',
      'UNCLAIMED_ALLOWED'
    ];

    if (rules.settings && rules.settings.length) {
      return rules.settings.filter(rule => {
        return desiredRules.includes(rule.Code);
      });
    }

    return [];
  }

  return (
    <RulesTableWrapper
      endpoint={LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SETTINGS}
      processData={filterRules}
      queryString='?=settingClass=Auction'
      rowKey='SettingParameterId'
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
    </RulesTableWrapper>
  )
}

function BidRulesTable() {

  const renderRuleValueCell = (value) => {
    if (value !== null) {
      const precision = value % 1 == 0 ? 0 : 2;
      const ruleText = `$${Number(value).toFixed(precision)}`;
      
      return <Text>{ruleText}</Text>;
    } else {
      return <Text></Text>;
    }
  }

  return (
    <RulesTableWrapper
      endpoint={LEAGUE_SERVICE_ENDPOINTS.GET_AUCTION_BID_RULES}
      rowKey='AuctionBidRuleId'
    >
      <Column
        title='Lower Bound'
        dataIndex='MinThresholdExclusive'
        render={(text, record) => renderRuleValueCell(record.MinThresholdExclusive)}
      />
      <Column
        title='Upper Bound'
        dataIndex='MaxThresholdInclusive'
        render={(text, record) => renderRuleValueCell(record.MaxThresholdInclusive)}
      />
      <Column
        title='Min Bid Increment'
        dataIndex='MinIncrement'
        render={(text, record) => renderRuleValueCell(record.MinIncrement)}
      />
    </RulesTableWrapper>
  );
}

function TaxBracketsTable() {

  const renderRuleValueCell = (name, value) => {
    const precision = value % 1 == 0 ? 0 : 2;

    let ruleText = '';

    if (value !== null) {
      if (name != 'taxRate') ruleText += '$';
      ruleText += `${Number(value).toFixed(precision)}`;
      if (name == 'taxRate') ruleText += ' %';
    }
    
    return <Text>{ruleText}</Text>;
  }

  return (
    <RulesTableWrapper
      endpoint={LEAGUE_SERVICE_ENDPOINTS.AUCTION_TAX_RULE}
      rowKey='AuctionTaxRuleId'
    >
      <Column
        title='Lower Bound'
        dataIndex='MinThresholdExclusive'
        render={(text, record) => renderRuleValueCell('minThresholdExclusive', record.MinThresholdExclusive)}
      />
      <Column
        title='Upper Bound'
        dataIndex='MaxThresholdInclusive'
        render={(text, record) => renderRuleValueCell('maxThresholdInclusive', record.MaxThresholdInclusive)}
      />
      <Column
        title='Tax Rate'
        dataIndex='TaxRate'
        render={(text, record) => renderRuleValueCell('taxRate', +record.TaxRate * 100)}
      />
    </RulesTableWrapper>
  );
}

export default AuctionRulesModal;