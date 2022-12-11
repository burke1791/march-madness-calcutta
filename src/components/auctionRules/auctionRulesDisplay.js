import React, { Fragment, useEffect, useState } from 'react';
import { Row, Col, Table, Button } from 'antd';

/**
 * @typedef AuctionRulesDisplayProps
 * @property {Boolean} tableLoading
 * @property {Array<Object>} dataSource
 * @property {Number} dataSourceChanged
 * @property {String} rowKey
 * @property {Boolean} updateLoading
 * @property {Boolean} isRuleChanged
 * @property {Function} sendUpdateRulesRequest
 * @property {Boolean} [showNewRuleButton]
 * @property {String} [newRuleButtonText]
 * @property {any} [newRuleTemplate]
 * @property {Array<any>} children - list of antd <Column /> components
 */

/**
 * @component AuctionRulesDisplay
 * @param {AuctionRulesDisplayProps} props 
 */
function AuctionRulesDisplay(props) {

  const [tableData, setTableData] = useState([]);
  const [newRuleNumber, setNewRuleNumber] = useState(0);

  useEffect(() => {
    if (props.dataSource?.length > 0) {
      setTableData([...props.dataSource]);
    } else {
      setTableData([]);
    }
  }, [props.dataSourceChanged]);

  const addNewRule = () => {
    const newRuleTemplate = structuredClone(props.newRuleTemplate);
    const ruleId = 'newRule_' + newRuleNumber;
    newRuleTemplate[props.rowKey] = ruleId;
    newRuleTemplate.deleteNewRule = () => { removeRule(ruleId) };

    setTableData([...tableData, newRuleTemplate]);
    setNewRuleNumber(newRuleNumber + 1);
  }

  const removeRule = (ruleId) => {
    const newTableData = tableData.filter(record => {
      console.log(ruleId);
      console.log(record);
    
      return !(record[props.rowKey] == ruleId);
    });

    setTableData(newTableData);
  }

  const renderNewRuleButton = () => {
    if (props.showNewRuleButton && props.newRuleTemplate != undefined) {
      return (
        <Button
          type='primary'
          style={{ marginTop: 8, marginRight: 8 }}
          onClick={addNewRule}
        >
          {props.newRuleButtonText || 'New Rule'}
        </Button>
      );
    }

    return null;
  }

  return (
    <Fragment>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Table
            loading={props.tableLoading}
            dataSource={tableData}
            rowKey={props.rowKey}
            size='small'
            pagination={false}
            style={{ width: '100%' }}
          >
            {props.children}
          </Table>
        </Col>
      </Row>
      <Row justify='center'>
        {renderNewRuleButton() || null}
        <Button
          type='primary'
          style={{ marginTop: 8 }}
          disabled={!props.isRuleChanged}
          onClick={props.sendUpdateRulesRequest}
          loading={props.updateLoading}
        >
          Save Changes
        </Button>
      </Row>
    </Fragment>
  )
}

export default AuctionRulesDisplay;