import React from 'react';
import './App.css';

import Topnav from './components/topnav/topnav';
import Main from './components/main/main';

import { Layout } from 'antd';
import League from './components/league/league';
import LandingPage from './landingPage/landingPage';
import { LeagueProvider } from './context/leagueContext';
import { AuthProvider } from './context/authContext';
import { SettingsProvider } from './context/leagueSettingsContext';
import { TournamentProvider } from './context/tournamentContext';
import JoinLeague from './components/league/joinLeague';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const { Header } = Layout;

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Layout style={{ height: '100vh' }}>
          <AuthProvider>
            <Header style={{ padding: 0 }}>
              <Topnav />
            </Header>
        
            <LeagueProvider>
              <SettingsProvider>
                <TournamentProvider>
                  <Routes>
                    <Route path='/' element={<LandingPage />} />
                    <Route path='/home' element={<Main />} />
                    <Route path='/leagues/:leagueId/*' element={<League />} />
                    <Route path='/joinLeague' element={<JoinLeague />} />
                  </Routes>
                </TournamentProvider>
              </SettingsProvider>
            </LeagueProvider>
          </AuthProvider>
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
