import React from 'react';

import { Layout } from 'antd'
import 'antd/dist/antd.css';

import LeagueHeader from '../league/leagueHeader';
import Bracket from '../bracket/bracket';
import { useLeagueState } from '../../context/leagueContext';

const { Content } = Layout;

function Tournament() {

  const { leagueName, tournamentName, tournamentRegimeName } = useLeagueState();

  const secondaryHeaderText = () => {
    let text = tournamentName;

    if (tournamentRegimeName != null) {
      text += ' - ' + tournamentRegimeName;
    }

    return text;
  }

  return (
    <Layout>
      <LeagueHeader class='primary' text={leagueName} />
      <LeagueHeader class='secondary' text={secondaryHeaderText()} />
      <Content style={{ textAlign: 'center', height: '100%' }}>
        <Bracket />
      </Content>
    </Layout>
  );
}

export default Tournament;