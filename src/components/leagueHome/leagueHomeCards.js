import React from 'react';
import { Card, Avatar, Row, Col, Statistic } from 'antd';
import { UserOutlined, DollarOutlined, DollarTwoTone } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { formatMoney } from '../../utilities/helper';

const { Meta } = Card;

function LeagueHomeCards(props) {
  
  return (
    <Row type='flex' justify='center' gutter={[12, 8]}>
      <Col md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }}>
          <Statistic title='Users' value={props.userCount} prefix={<UserOutlined />} />
        </Card>
      </Col>
      <Col md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }}>
          <Statistic title='Prizepool' value={props.prizepool} precision={2} prefix={<DollarTwoTone />} />
        </Card>
      </Col>
      <Col md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }}>
          <Statistic title='Users' value={props.userCount} prefix={<UserOutlined />} />
        </Card>
      </Col>
      <Col md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }}>
          <Statistic title='Prizepool' value={props.prizepool} precision={2} prefix={<DollarTwoTone />} />
        </Card>
      </Col>
    </Row>
  )
}

export default LeagueHomeCards;