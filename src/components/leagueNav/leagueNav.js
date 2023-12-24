import React, { useState, useEffect } from 'react';
import { Menu, Layout, Button, message, Popconfirm } from 'antd';
import { useLeagueState } from '../../context/leagueContext';
import { parseLeaguePathName } from '../../utilities/helper';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../../context/authContext';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';

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

  const { leagueId, supplementalPages } = useLeagueState();

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

    if (leagueId && event.key != 'leave') {
      navigate(`/leagues/${leagueId}/${event.key}`);
    } else {
      console.debug('LeagueNav: leagueId is falsy');
    }
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
        ...menuItems.tail,
        { key: 'leave', label: <LeaveButton hidden={collapsed} />, style: { position: 'absolute', bottom: 8, paddingTop: 0, paddingRight: 16, paddingBottom: 0, paddingLeft: 16 } }
      ];
    } else {
      return [
        ...menuItems.start,
        ...menuItems.tail,
        { key: 'leave', label: <LeaveButton hidden={collapsed} />, style: { position: 'absolute', bottom: 8, paddingTop: 0, paddingRight: 16, paddingBottom: 0, paddingLeft: 16 } }
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
      />
    </Sider>
  );
}

function LeaveButton (props) {

  const [loading, setLoading] = useState(false);

  const { leagueId } = useLeagueState();
  const { authenticated } = useAuthState();
  const navigate = useNavigate();

  const [leaveLeagueResponse, leaveLeagueReturnDate, leaveLeague] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.LEAVE_LEAGUE}/${leagueId}`,
    method: 'POST',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (leaveLeagueReturnDate) {
      setLoading(false);
      if (leaveLeagueResponse && leaveLeagueResponse.length > 0 && leaveLeagueResponse[0]?.Error) {
        message.error(leaveLeagueResponse[0].Error);
      } else {
        navigate('/home');
      }
    }
  }, [leaveLeagueReturnDate])

  const sendLeaveLeagueRequest = () => {
    setLoading(true);
    leaveLeague();
  }

  return (
    <Popconfirm
      title='Are you sure?'
      onConfirm={sendLeaveLeagueRequest}
      okText='Leave'
      okButtonProps={{ danger: true }}
    >
      <Button
        type='primary'
        danger
        hidden={props.hidden}
        loading={loading}
        style={{
          width: '100%'
        }}
      >
        Leave
      </Button>
    </Popconfirm>
  );
}

export default LeagueNav;