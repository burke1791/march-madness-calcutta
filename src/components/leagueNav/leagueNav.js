import React, { useState, useEffect } from 'react';
import { Menu, Layout } from 'antd';
import 'antd/dist/antd.css';
import { useLeagueState } from '../../context/leagueContext';
import { parseLeaguePathName } from '../../utilities/helper';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const TOP_LEVEL_MENU_ITEMS = {
  HOME: 'leagueHome',
  AUCTION: 'auction',
  BRACKET: 'bracket',
  MESSAGE_BOARD: 'messageBoard',
  SETTINGS: 'settings',
  SETTINGS_SUB: 'settingSub'
};

function LeagueNav() {

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const { leagueId, hasBracketPage } = useLeagueState();

  const location = useLocation();
  const navigate = useNavigate();

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
      } else if (event.key == TOP_LEVEL_MENU_ITEMS.SETTINGS) {
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
        <Menu.Item key='settings'>
          Settings
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default LeagueNav;