import React, { Fragment, useEffect, useState } from 'react';
import { Menu } from 'antd';
import { Navigate, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useLeagueState } from '../../context/leagueContext';
import GeneralSettings from './generalSettings';
import MembershipSettings from './membershipSettings';
import AuctionSettings from './auctionSettings';
import GroupSettings from './groupSettings';
import PayoutSettings from './payoutSettings';

const menuItems = [
  { key: 'general',  label: 'General' },
  { key: 'roster', label: 'Roster' },
  { key: 'auction', label: 'Auction' },
  { key: 'auction-groups', label: 'Auction Groups' },
  { key: 'payout-rules', label: 'Payout Rules' }
];

function LeagueSettings() {

  const [selectedKeys, setSelectedKeys] = useState([]);

  const navigate = useNavigate();
  const { leagueId } = useLeagueState();
  const location = useLocation();

  useEffect(() => {
    setSelectedKeys([getSelectedMenuItem()]);
  }, [location.pathname]);

  const getSelectedMenuItem = () => {
    // cannot use lookbehind on mobile (ugh)
    const parsedSettingPath = location.pathname.match(/\/settings\/(\w|-){1,}($|(?=\/))/ig);
    if (!parsedSettingPath) {
      return 'general';
    }
    return parsedSettingPath[0].substring(10);
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
        items={menuItems}
      />
      <Routes>
        <Route path='/' element={<GeneralSettings />} />
        <Route path='/roster' element={<MembershipSettings />} />
        <Route path='/auction' element={<AuctionSettings />} />
        <Route path='/auction-groups' element={<GroupSettings />} />
        <Route path='/payout-rules' element={<PayoutSettings />} />

        <Route path='*' element={<Navigate to={`/leagues/${leagueId}/settings`} replace />} />
      </Routes>
    </Fragment>
  );
}

export default LeagueSettings;