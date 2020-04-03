import React, { useState, useEffect } from 'react';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import { Menu, Layout } from 'antd';
import 'antd/dist/antd.css';
import { navigate } from '@reach/router';
import { useLeagueState } from '../../context/leagueContext';

const { Sider } = Layout;

function LeagueNav() {

  const [displaySider, setDisplaySider] = useState(true);

  const { leagueId } = useLeagueState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_MENU_TOGGLE, LeagueNav, handleMenuToggle);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_MENU_TOGGLE, LeagueNav);
    });
  }, []);

  const handleMenuToggle = () => {
    setDisplaySider(!displaySider);
  }

  const handleLeagueNavClick = (event) => {
    if (leagueId) {
      if (event.key == 'leagueHome') {
        navigate(`/leagues/${leagueId}`);
      } else if (event.key == 'auction') {
        navigate(`/leagues/${leagueId}/auction`);
      } else if (event.key == 'messageBoard') {
        // navigate(`/leagues/${leagueId}/message_board`)
      }
    } else {
      console.log('leagueId is falsy');
    }
  }

  if (displaySider) {
    return (
      <Sider width={200}>
        <Menu
          mode='inline'
          onClick={handleLeagueNavClick}
          defaultSelectedKeys={['leagueHome']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key='leagueHome'>
            League Home
          </Menu.Item>
          <Menu.Item key='auction'>
            Auction Room
          </Menu.Item>
          <Menu.Item key='myTeams' disabled>
            My Teams
          </Menu.Item>
          <Menu.Item key='messageBoard' disabled>
            Message Board
          </Menu.Item>
          <Menu.Item key='settings' disabled>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
    );
  } else {
    return (
      <Menu
        mode='horizontal'
        onClick={handleLeagueNavClick}
        defaultSelectedKeys={['leagueHome']}
        style={{ lineHeight: '48px', padding: '0 70px' }}
      >
        <Menu.Item key='leagueHome'>
          League Home
        </Menu.Item>
        <Menu.Item key='auction'>
          Auction Room
        </Menu.Item>
        <Menu.Item key='myTeams'>
          My Teams
        </Menu.Item>
        <Menu.Item key='messageBoard'>
          Message Board
        </Menu.Item>
        <Menu.Item key='settings'>
          Settings
        </Menu.Item>
      </Menu>
    );
  }
}

export default LeagueNav;