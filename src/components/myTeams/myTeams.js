import React, { useState, useEffect } from 'react';

import { Row, Card, Table } from 'antd';
import 'antd/dist/antd.css';

import { formatMoney } from '../../utilities/helper';

const columns = [
  {
    title: 'My Teams',
    dataIndex: 'name',
    key: 'name',
    align: 'left',
    render: (text, record) => {
      if (record.teamId == -1) {
        return <span style={{ fontWeight: 'bold', color: 'red' }}>{text}</span>;
      } else {
        return text;
      }
    }
  },
  {
    title: 'Paid',
    dataIndex: 'price',
    key: 'price',
    align: 'right',
    render: (text, record) => {
      if (record.teamId == -1) {
        return <span style={{ fontWeight: 'bold', color: 'red' }}>{formatMoney(text)}</span>;
      } else {
        return formatMoney(text);
      }
    }
  }
];

// @TODO add some sort of animation on the table rows that update, e.g. highlight then fade
function MyTeams(props) {

  const [teamsArr, setTeamsArr] = useState([]);

  useEffect(() => {
    if (props.myTax > 0) {
      let taxArray = [{
        name: 'Tax',
        price: props.myTax,
        teamId: -1
      }];
      setTeamsArr([...props.myTeams, ...taxArray]);
    } else {
      setTeamsArr(props.myTeams);
    }
  }, [props.myTeams, props.myTax]);

  return (
    <Row style={{ height: 'calc(50vh - 70px)' }}>
      <Card style={{ height: '100%' }} bodyStyle={{ padding: '0', height: '100%' }} size='small'>
        <Table
          columns={columns}
          dataSource={teamsArr}
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