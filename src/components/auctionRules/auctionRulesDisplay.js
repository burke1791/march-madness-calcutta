import React, { Fragment, useEffect, useRef, useState } from 'react';
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

  useEffect(() => {
    if (props.dataSource?.length > 0) {
      setTableData([...props.dataSource]);
    }
  }, [props.dataSourceChanged]);

  const addNewRule = () => {
    const newRuleTemplate = props.newRuleTemplate;
    newRuleTemplate[props.rowKey] = `newRule_${tableData.length + 1}`;

    setTableData([...tableData, newRuleTemplate]);
  }

  const renderNewRuleButton = () => {
    if (props.showNewRuleButton && props.newRuleTemplate != undefined) {
      return (
        <Button
          type='primary'
          style={{ marginTop: 8 }}
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