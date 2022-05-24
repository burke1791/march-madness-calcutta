import React, { Fragment, useEffect, useState } from 'react';
import { Menu } from 'antd';
import { Navigate, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useLeagueState } from '../../context/leagueContext';
import GeneralSettings from './generalSettings';
import MembershipSettings from './membershipSettings';
import AuctionSettings from './auctionSettings';

function LeagueSettings() {

  const [selectedKeys, setSelectedKeys] = useState([]);

  const navigate = useNavigate();
  const { leagueId } = useLeagueState();
  const location = useLocation();

  useEffect(() => {
    setSelectedKeys([getSelectedMenuItem()]);
  }, [location.pathname]);

  const getSelectedMenuItem = () => {
    const parsedSettingPath = location.pathname.match(/(?<=\/leagues\/\d{1,}\/settings\/)\w{1,}($|(?=\/))/ig);
    if (!parsedSettingPath) {
      return 'general';
    }
    return parsedSettingPath[0];
  }

  const handleSettingMenuClick = (event) => {
    if (event.key == 'general') {
      navigate(`/leagues/${leagueId}/settings`);
    } else {
      navigate(`/leagues/${leagueId}/settings/${event.key}`);
    }
  }

  return (
    <Fragment>
      <Menu
        mode='horizontal'
        defaultSelectedKeys={['general']}
        onClick={handleSettingMenuClick}
        selectedKeys={selectedKeys}
      >
        <Menu.Item key='general'>
          General
        </Menu.Item>
        <Menu.Item key='roster'>
          Roster
        </Menu.Item>
        <Menu.Item key='auction'>
          Auction
        </Menu.Item>
        <Menu.Item key='payouts'>
          Payout Rules
        </Menu.Item>
      </Menu>
      <Routes>
        <Route path='/' element={<GeneralSettings />} />
        <Route path='/roster' element={<MembershipSettings />} />
        <Route path='/auction' element={<AuctionSettings />} />

        <Route path='*' element={<Navigate to={`/leagues/${leagueId}/settings`} replace />} />
      </Routes>
    </Fragment>
  );
}

export default LeagueSettings;