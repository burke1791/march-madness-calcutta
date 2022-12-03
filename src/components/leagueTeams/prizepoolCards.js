import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { DollarCircleTwoTone } from '@ant-design/icons';
import { formatMoney } from '../../utilities/helper';

const { Meta } = Card;

/**
 * @typedef PrizepoolCardsProps
 * @property {Number} prizepool
 * @property {Number} totalAwarded
 */

/**
 * @component
 * @param {PrizepoolCardsProps} props 
 */
function PrizepoolCards(props) {

  const getValueStyle = () => {
    if (props.totalAwarded > props.prizepool) return { color: '#cf1322' };
    return null;
  }

  return (
    <Row type='flex' justify='center' gutter={[12, 8]}>
      <Col xs={0} md={5} xxl={4}>
        <PrizepoolCardItem
          title='Prizepool'
          value={formatMoney(props.prizepool, true)}
          prefix={<DollarCircleTwoTone />}
        />
      </Col>
      <Col xs={0} md={5} xxl={4}>
        <PrizepoolCardItem
          title='Awarded'
          value={formatMoney(props.totalAwarded, true)}
          prefix={<DollarCircleTwoTone />}
          valueStyle={getValueStyle()}
        />
      </Col>
      <Col xs={0} md={5} xxl={4}>
        <PrizepoolCardItem
          title='Remaining'
          value={formatMoney(props.prizepool - props.totalAwarded, true)}
          prefix={<DollarCircleTwoTone />}
          valueStyle={getValueStyle()}
        />
      </Col>
    </Row>
  );
}

/**
 * @typedef PrizepoolCardItemProps
 * @property {String} title
 * @property {String} value
 * @property {Function} prefix
 * @property {Object} valueStyle
 */

/**
 * @component
 * @param {PrizepoolCardItemProps} props 
 */
function PrizepoolCardItem(props) {

  return (
    <Card style={{ textAlign: 'center' }} bodyStyle={{ padding: '24px 12px' }}>
      <Statistic
        title={props.title}
        value={props.value}
        precision={2}
        prefix={props.prefix}
        valueStyle={props.valueStyle}
      />
    </Card>
  );
}

export default PrizepoolCards;