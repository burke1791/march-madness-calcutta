import React from 'react';
import { Card, Avatar, Row, Col, Statistic } from 'antd';
import { UserOutlined, ClockCircleOutlined, DollarTwoTone, FundTwoTone } from '@ant-design/icons';
import 'antd/dist/antd.css';
import { formatMoney } from '../../utilities/helper';

const { Meta } = Card;

function LeagueHomeCards(props) {

  let roi = props.buyIn == props.payout ? 0 : (props.payout - props.buyIn) / props.buyIn * 100;

  let roiColor = roi >= 0 ? '#3f8600' : '#cf1322';
  
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
          <Statistic title='Remaining Games' value={props.remainingGames} prefix={<ClockCircleOutlined />} />
        </Card>
      </Col>
      <Col md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }}>
          <Statistic
            title='ROI'
            value={roi}
            precision={1}
            valueStyle={{ color: roiColor }}
            prefix={<FundTwoTone />}
            suffix="%"
          />
          {/* <Statistic title='Prizepool' value={props.prizepool} precision={2} prefix={<FundTwoTone />} /> */}
        </Card>
      </Col>
    </Row>
  )
}

export default LeagueHomeCards;