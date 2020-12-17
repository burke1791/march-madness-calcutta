import React from 'react';
import './App.css';
import { Router } from '@reach/router';

import Topnav from './components/topnav/topnav';
import Main from './components/main/main';

import { Layout } from 'antd';
import League from './components/league/league';
import LandingPage from './landingPage/landingPage';
import Admin from './components/adminPage/admin';
import { LeagueProvider } from './context/leagueContext';
import { AuthProvider } from './context/authContext';
import { SettingsProvider } from './context/leagueSettingsContext';
import { TournamentProvider } from './context/tournamentContext';

const { Header } = Layout;

function App() {

  return (
    <div className="App">
      <Layout style={{ height: '100vh' }}>
        <AuthProvider>
          <Header style={{ padding: 0 }}>
            <Topnav />
          </Header>
      
          <LeagueProvider>
            <SettingsProvider>
              <TournamentProvider>
                <Router>
                  <LandingPage path='/' />
                  <Admin path='/admin' />
                  <Main path='/home' />
                  <League path='/leagues/:leagueId/*' />
                </Router>
              </TournamentProvider>
            </SettingsProvider>
          </LeagueProvider>
        </AuthProvider>
      </Layout>
    </div>
  );
}

export default App;
