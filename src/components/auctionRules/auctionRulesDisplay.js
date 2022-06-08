import React, { Fragment } from 'react';
import { Row, Col, Table, Button } from 'antd';

/**
 * @typedef AuctionRulesDisplayProps
 * @property {Boolean} tableLoading
 * @property {Array<Object>} dataSource
 * @property {String} rowKey
 * @property {Boolean} updateLoading
 * @property {Boolean} isRuleChanged
 * @property {Function} sendUpdateRulesRequest
 * @property {Array<any>} children - list of antd <Column /> components
 */

/**
 * @component AuctionRulesDisplay
 * @param {AuctionRulesDisplayProps} props 
 */
function AuctionRulesDisplay(props) {

  return (
    <Fragment>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Table
            loading={props.tableLoading}
            dataSource={props.dataSource}
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