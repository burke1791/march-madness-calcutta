import React, { useState } from 'react';
import { Row } from 'antd';
import 'antd/dist/antd.css';
import { useLeagueState } from '../../context/leagueContext';

function SeedGroupSettings(props) {

  const [loading, setLoading] = useState(false);

  const { leagueId, leagueName } = useLeagueState();

  return (
    <Row justify='center'>
      Hello
    </Row>
  )
}

export default SeedGroupSettings;