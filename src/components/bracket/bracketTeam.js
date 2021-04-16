import React from 'react';
import { Row, Typography } from 'antd';
import { formatMoney } from '../../utilities/helper';

const { Text } = Typography;

function BracketTeamPopover(props) {

  return (
    <div>
      <Row>
        <Text>Owner: {props.team.owner}</Text>
      </Row>
      <Row>
        <Text>Price: {formatMoney(props.team.price)}</Text>
      </Row>
      <Row>
        <div>
          <Text>Payout: </Text>
          <Text type={props.team.payout >= props.team.price ? 'success' : 'danger'}>{formatMoney(props.team.payout)}</Text>
        </div>
      </Row>
      <Row>
        <div>
          <Text>Status: </Text>
          <Text type={props.team.eliminated ? 'danger' : 'success'}>{props.team.eliminated ? 'Eliminated' : 'Alive'}</Text>
        </div>
      </Row>
    </div>
  )
}

export default BracketTeamPopover;