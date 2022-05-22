import React, { useState, useEffect } from 'react';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import { Menu, Layout } from 'antd';
import 'antd/dist/antd.css';
import { useLeagueState } from '../../context/leagueContext';
import { parseLeaguePathName } from '../../utilities/helper';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;

const TOP_LEVEL_MENU_ITEMS = {
  HOME: 'leagueHome',
  AUCTION: 'auction',
  BRACKET: 'bracket',
  MESSAGE_BOARD: 'messageBoard',
  SETTINGS: 'settingSub'
};

const SETTINGS_SUBMENU_ITEMS = {
  LEAGUE: 'settings/league',
  AUCTION: 'settings/auction',
  SEED_GROUPS: 'settings/seed_groups',
  PAYOUT: 'settings/payout'
}

function LeagueNav() {

  const [displaySider, setDisplaySider] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const { leagueId, hasBracketPage } = useLeagueState();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_MENU_TOGGLE, LeagueNav, handleMenuToggle);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_MENU_TOGGLE, LeagueNav);
    });
  }, []);

  useEffect(() => {
    setSelectedKeys(getSelectedMenuItem());
  }, [location.pathname])

  const handleCollapse = (flag, type) => {
    if (window.innerWidth >= 992) {
      // never collapse if the viewport is wide enough
      setCollapsed(false);
    } else {
      setCollapsed(flag);
    }
  }

  const handleMenuToggle = () => {
    setDisplaySider(!displaySider);
  }

  const getSelectedMenuItem = () => {
    console.log(location);
    const pathData = parseLeaguePathName(location.pathname);

    if (pathData.menuItem == undefined) {
      return [TOP_LEVEL_MENU_ITEMS.HOME];
    }

    if (pathData.subMenuItem == undefined) {
      return [pathData.menuItem];
    }

    return [`${pathData.menuItem}/${pathData.subMenuItem}`];
  }

  const handleLeagueNavClick = (event) => {
    handleCollapse(true, 'menuClick');
    // setSelectedKeys([event.key]);

    if (leagueId) {
      if (event.key == TOP_LEVEL_MENU_ITEMS.HOME) {
        navigate(`/leagues/${leagueId}`);
      } else if (event.key == TOP_LEVEL_MENU_ITEMS.AUCTION) {
        navigate(`/leagues/${leagueId}/auction`);
      } else if (event.key == 'bracket') {
        navigate(`/leagues/${leagueId}/bracket`);
      } else if (event.key == TOP_LEVEL_MENU_ITEMS.MESSAGE_BOARD) {
        // navigate(`/leagues/${leagueId}/message_board`)
      } else if (event.keyPath[1] == TOP_LEVEL_MENU_ITEMS.SETTINGS) {
        navigate(`/leagues/${leagueId}/${event.key}`);
      }
    } else {
      console.debug('LeagueNav: leagueId is falsy');
    }
  }

  const generateBracketMenuItem = () => {
    if (hasBracketPage) {
      return (
        <Menu.Item key='bracket'>
          Bracket
        </Menu.Item>
      );
    }

    return null;
  }

  if (displaySider) {
    return (
      <Sider 
        width={200}
        breakpoint='lg'
        collapsedWidth={0}
        zeroWidthTriggerStyle={{ top: '0px' }}
        collapsed={collapsed}
        onCollapse={handleCollapse}
      >
        <Menu
          mode='inline'
          onClick={handleLeagueNavClick}
          defaultSelectedKeys={['leagueHome']}
          style={{ height: '100%', borderRight: 0 }}
          defaultOpenKeys={['settingSub']}
          selectedKeys={selectedKeys}
        >
          <Menu.Item key='leagueHome'>
            League Home
          </Menu.Item>
          <Menu.Item key='auction'>
            Auction Room
          </Menu.Item>
          {generateBracketMenuItem()}
          {/* <Menu.Item key='myTeams' disabled>
            My Teams
          </Menu.Item>
          <Menu.Item key='messageBoard' disabled>
            Message Board
          </Menu.Item> */}
          <SubMenu key='settingSub' title='Settings'>
            <Menu.Item key='settings/league'>
              League Settings
            </Menu.Item>
            <Menu.Item key='settings/auction'>
              Auction Settings
            </Menu.Item>
            <Menu.Item key='settings/seed_groups'>
              Seed Groups
            </Menu.Item>
            <Menu.Item key='settings/payout'>
              Payout Settings
            </Menu.Item>
          </SubMenu>
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
        {/* <Menu.Item key='tournament' disabled>
          Tournament
        </Menu.Item>
        <Menu.Item key='myTeams' disabled>
          My Teams
        </Menu.Item>
        <Menu.Item key='messageBoard' disabled>
          Message Board
        </Menu.Item> */}
        <SubMenu key='settingSub' title='Settings'>
          <Menu.Item key='settings/auction'>
            Auction Settings
          </Menu.Item>
          <Menu.Item key='settings/payouts'>
            Payout Settings
          </Menu.Item>
        </SubMenu>
      </Menu>
    );
  }
}

export default LeagueNav;