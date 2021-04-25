import React from 'react';
import { Row, Typography } from 'antd';
import { formatMoney } from '../../utilities/helper';

const { Text } = Typography;

function BracketTeamPopover(props) {

  const getEliminatedText = () => {
    if (props.team.teamName == null) {
      return null;
    } else if (props.team.eliminated) {
      return 'Eliminated';
    } else {
      return 'Alive';
    }
  }

  const getEliminatedType = () => {
    if (props.team.teamName == null) {
      return null;
    } else if (props.team.eliminated) {
      return 'danger';
    } else {
      return 'success';
    }
  }

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
          <Text type={getEliminatedType()}>{getEliminatedText()}</Text>
        </div>
      </Row>
    </div>
  )
}

export default BracketTeamPopover;