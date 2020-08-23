import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { UserOutlined, ClockCircleOutlined, DollarTwoTone, FundTwoTone } from '@ant-design/icons';
import 'antd/dist/antd.css';

const { Meta } = Card;

function LeagueHomeCards(props) {

  let roi = props.buyIn == props.payout ? 0 : (props.payout - props.buyIn) / props.buyIn * 100;

  let roiColor = roi >= 0 ? '#3f8600' : '#cf1322';
  
  return (
    <Row type='flex' justify='center' gutter={[12, 8]}>
      <Col xs={0} md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }} bodyStyle={{ padding: '24px 12px' }}>
          <Statistic title='Users' value={props.userCount} prefix={<UserOutlined />} />
        </Card>
      </Col>
      <Col xs={0} md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }} bodyStyle={{ padding: '24px 12px' }}>
          <Statistic title='Prizepool' value={props.prizepool} precision={2} prefix={<DollarTwoTone />} />
        </Card>
      </Col>
      <Col xs={0} md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }} bodyStyle={{ padding: '24px 12px' }}>
          <Statistic title='Remaining Teams' value={props.remainingTeams} prefix={<ClockCircleOutlined />} />
        </Card>
      </Col>
      <Col xs={0} md={5} xxl={3}>
        <Card style={{ textAlign: 'center' }} bodyStyle={{ padding: '24px 12px' }}>
          <Statistic
            title='ROI'
            value={roi}
            precision={1}
            valueStyle={{ color: roiColor }}
            prefix={<FundTwoTone />}
            suffix="%"
          />
        </Card>
      </Col>
    </Row>
  )
}

export default LeagueHomeCards;