import React from 'react';

import { Row, Col, Card, Table } from 'antd';
import 'antd/dist/antd.css';

import { formatMoney } from '../../utilities/helper';

const columns = [
  {
    title: 'Member',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Total Paid',
    dataIndex: 'buyInFormatted',
    key: 'buyIn'
  }
];

// @TODO add some sort of animation on the table rows that update, e.g. highlight then fade
function MemberList(props) {
  return (
    <Row style={{ height: 'calc(50vh - 70px)', marginTop: '12px' }}>
      <Card style={{ height: '100%' }} bodyStyle={{ padding: '0' }} size='small'>
        <Table
          columns={columns}
          dataSource={props.users}
          pagination={false}
          size='small'
          bordered={false}
          scroll={{ y: 'calc(50vh - 107px)' }}
          style={{ border: 'none' }}
        />
      </Card>
    </Row>
  );
}

export default MemberList;