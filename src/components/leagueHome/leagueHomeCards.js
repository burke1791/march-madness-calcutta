import React from 'react';
import { Card, Avatar, Row, Col } from 'antd';
import { UserOutlined, DollarOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { formatMoney } from '../../utilities/helper';

const { Meta } = Card;

function LeagueHomeCards(props) {
  
  return (
    <Row type='flex' justify='center' gutter={[12, 8]}>
      <Col md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }}>
          <Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={`${props.userCount} Users`}
          />
        </Card>
      </Col>
      <Col md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }}>
          <Meta
            avatar={<Avatar icon={<DollarOutlined />} />}
            title={formatMoney(props.prizepool)}
          />
        </Card>
      </Col>
      <Col md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }}>
          <Meta
            avatar={<Avatar icon={<UserOutlined />} />}
            title={`${props.userCount} Users`}
          />
        </Card>
      </Col>
      <Col md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }}>
          <Meta
            avatar={<Avatar icon={<DollarOutlined />} />}
            title={formatMoney(props.prizepool)}
          />
        </Card>
      </Col>
    </Row>
  )
}

export default LeagueHomeCards;