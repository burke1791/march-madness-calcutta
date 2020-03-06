import React from 'react';

import { Row, Card, Table } from 'antd';
import 'antd/dist/antd.css';

import { formatMoney } from '../../utilities/helper';

const columns = [
  {
    title: 'My Teams',
    dataIndex: 'name',
    key: 'name',
    align: 'left'
  },
  {
    title: 'Paid',
    dataIndex: 'price',
    key: 'price',
    render: (value) => formatMoney(value),
    align: 'right'
  }
];

// @TODO add some sort of animation on the table rows that update, e.g. highlight then fade
function MyTeams(props) {
  return (
    <Row style={{ height: 'calc(50vh - 70px)' }}>
      <Card style={{ height: '100%' }} bodyStyle={{ padding: '0', height: '100%' }} size='small'>
        <Table
          columns={columns}
          dataSource={props.myTeams}
          rowKey='teamId'
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

export default MyTeams;