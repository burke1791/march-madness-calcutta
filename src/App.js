import React from 'react';
import './App.css';
import { Router } from '@reach/router';

import Topnav from './components/topnav/topnav';
import Main from './components/main/main';

import { Layout } from 'antd';
import League from './components/league/league';
import LandingPage from './landingPage/landingPage';
import Admin from './components/adminPage/admin';

const { Header, Footer, Content } = Layout;

function App() {

  return (
    <div className="App">
      <Layout style={{ height: '100vh' }}>
        <Header style={{ padding: '0 25px' }}>
          <Topnav />
        </Header>
        <Content style={{ margin: '0' }}>
          <Router>
            <LandingPage path='/' />
            <Admin path='/admin' />
            <Main path='/home' />
            <League path='leagues/:leagueId/*' />
          </Router>
        </Content>
      </Layout>
    </div>
  );
}

export default App;
