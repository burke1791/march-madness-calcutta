import React from 'react';

import { Row, Col, Card, Table } from 'antd';
import 'antd/dist/antd.css';
import './memberList.css';

import { formatMoney } from '../../utilities/helper';

const columns = [
  {
    align: 'left',
    width: 20,
    render: () => <PulseCircle color='green' />
  },
  {
    title: 'Member',
    dataIndex: 'alias',
    key: 'alias',
    align: 'left',
    width: '70%'
  },
  {
    title: 'Total Paid',
    dataIndex: 'totalBuyIn',
    key: 'totalBuyIn',
    align: 'right',
    width: '30%',
    render: (value) => formatMoney(value),
  }
];

// @TODO add some sort of animation on the table rows that update, e.g. highlight then fade
function MemberList(props) {
  return (
    <Row style={{ height: 'calc(50vh - 70px)', marginTop: '12px' }}>
      <Col>
        <Card style={{ height: '100%', width: '100%' }} bodyStyle={{ padding: '0' }} size='small'>
          <Table
            columns={columns}
            dataSource={props.users}
            rowKey='userId'
            pagination={false}
            size='small'
            bordered={false}
            scroll={{ y: 'calc(50vh - 107px)' }}
            style={{ border: 'none' }}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default MemberList;

/**
 * @typedef PulseCircleProps
 * @property {('green'|'orange'|'blue'|'rose')} color
 */

/**
 * @component
 * @param {PulseCircleProps} props 
 */
function PulseCircle(props) {

  return (
    <div className={`circle pulse ${props.color || 'green'}`}></div>
  );
}