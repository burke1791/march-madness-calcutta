import React, { useState, useEffect } from 'react';
import { Router } from '@reach/router';

import { Layout, Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import ScoreEntry from './scoreEntry';

import AdminService from '../../utilities/adminService';
import Pubsub from '../../utilities/pubsub';

const { Header, Content, Footer, Sider } = Layout;

function Admin(props) {

  const [categoryKey, setCategoryKey] = useState('results');
  const [tournamentKey, setTournamentKey] = useState('mm-2019');

  useEffect(() => {
    if (tournamentKey.includes('mm-')) {
      // fetch data from tournament_* tables
      let year = tournamentKey.match(/\d{4}$/g)[0];
      AdminService.fetchMarchMadnessGames(year);
    } else if (tournamentKey.includes('btt-')) {
      // fetch data from big_ten_tournament_* tables
    }
  }, [tournamentKey]);

  const categorySelected = (key) => {
    // use this to change what options show up in the sidebar
    setCategoryKey(key);
  }

  const tournamentSelected = (key) => {
    setTournamentKey(key);
  }

  const generateSidebar = () => {
    // eventually use the database to determine what to populate here
    return (
      <Menu theme='dark' mode='inline' defaultSelectedKeys={['mm-2019']}>
        <Menu.Item key='mm-2019' onClick={(e) => {tournamentSelected(e.key)}}>
          <span className='nav-text'>March Madness 2019</span>
        </Menu.Item>
        <Menu.Item key='btt-2020' onClick={(e) => {tournamentSelected(e.key)}}>
          <span className='nav-text'>B1G Tournament 2020</span>
        </Menu.Item>
        <Menu.Item key='mm-2020' onClick={(e) => {tournamentSelected(e.key)}}>
          <span className='nav-text'>March Madness 2020</span>
        </Menu.Item>
      </Menu>
    );  
  }

  const generateHeaderMenu = () => {
    // eventually use the database to determine what to populate here (?)
    return (
      <Menu theme='light' mode='horizontal' defaultSelectedKeys={['results']}>
        <Menu.Item key='results' onClick={(e) => {categorySelected(e.key)}}>
          <span className='nav-text'>Enter Results</span>
        </Menu.Item>
        <Menu.Item key='teams' onClick={(e) => {categorySelected(e.key)}}>
          <span className='nav-text'>Enter Teams/Seeds</span>
        </Menu.Item>
      </Menu>
    );
  }

  const generateEntryForm = () => {
    if (categoryKey === 'results') {
      let year = tournamentKey.match(/\d{4}$/g)[0]
      return <ScoreEntry year={year} />;
    } else if (categoryKey === 'teams') {
      // return <SelectionSundayForm tournamentKey={tournamentKey} />
    }

    return null;
  }

  return (
    <Layout>
      <Sider
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        {generateSidebar()}
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        {/* <Header style={{ background: '#fff', padding: 0 }}> */}
          {generateHeaderMenu()}
        {/* </Header> */}
        <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
            {generateEntryForm()}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>** Placeholder **</Footer>
      </Layout>
    </Layout>
  );
}

export default Admin;