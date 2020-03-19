import React from 'react';
import { Card, Avatar, Row } from 'antd';
import { UserOutlined, DollarOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { formatMoney } from '../../utilities/helper';

const { Meta } = Card;

function LeagueHomeCards(props) {
  
  return (
    <Row type='flex' justify='center'>
      <Card style={{ width: '200px', textAlign: 'center' }}>
        <Meta
          avatar={<Avatar icon={<UserOutlined />} />}
          title={`${props.userCount} Users`}
        />
      </Card>
      <Card style={{ width: '200px', textAlign: 'center' }}>
        <Meta
          avatar={<Avatar icon={<DollarOutlined />} />}
          title={formatMoney(props.prizepool)}
        />
      </Card>
      <Card style={{ width: '200px', textAlign: 'center' }}>
        <Meta
          avatar={<Avatar icon={<UserOutlined />} />}
          title={`${props.userCount} Users`}
        />
      </Card>
      <Card style={{ width: '200px', textAlign: 'center' }}>
        <Meta
          avatar={<Avatar icon={<DollarOutlined />} />}
          title={formatMoney(props.prizepool)}
        />
      </Card>
    </Row>
  )
}

export default LeagueHomeCards;