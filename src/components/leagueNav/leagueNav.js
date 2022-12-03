import React, { useState, useEffect } from 'react';
import { Menu, Layout } from 'antd';
import 'antd/dist/antd.css';
import { useLeagueState } from '../../context/leagueContext';
import { parseLeaguePathName } from '../../utilities/helper';
import { useNavigate, useLocation } from 'react-router-dom';

const menuItems = {
  start: [
    { key: '', label: 'League Home' },
    { key: 'auction', label: 'Auction Room' },
    { key: 'teams', label: 'Teams' }
  ],
  tail: [
    { key: 'settings', label: 'Settings' }
  ]
};

const { Sider } = Layout;

function LeagueNav() {

  const [collapsed, setCollapsed] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState([]);

  const { leagueId, hasBracketPage, supplementalPages, supplementalPagesSync } = useLeagueState();

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
    const pathData = parseLeaguePathName(location.pathname);

    return [pathData.menuItem || ''];
  }

  const handleLeagueNavClick = (event) => {
    handleCollapse(true, 'menuClick');
    // setSelectedKeys([event.key]);

    if (leagueId) {
      navigate(`/leagues/${leagueId}/${event.key}`);
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

  const generateSupplementalPageMenuItems = () => {
    if (supplementalPages && supplementalPages.length > 0) {
      return supplementalPages.map(page => {
        return { key: page.path, label: page.displayName };
      });
    }

    return null;
  }

  const getMenuItems = () => {
    const supplementalItems = generateSupplementalPageMenuItems();

    if (supplementalItems && supplementalItems.length > 0) {
      return [
        ...menuItems.start,
        ...supplementalItems,
        ...menuItems.tail
      ];
    } else {
      return [
        ...menuItems.start,
        ...menuItems.tail
      ];
    }
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
        items={getMenuItems()}
      >
        {/* <Menu.Item key=''>
          League Home
        </Menu.Item>
        <Menu.Item key='auction'>
          Auction Room
        </Menu.Item>
        {generateSupplementalPageMenuItems()}
        <Menu.Item key='settings'>
          Settings
        </Menu.Item> */}
      </Menu>
    </Sider>
  );
}

export default LeagueNav;