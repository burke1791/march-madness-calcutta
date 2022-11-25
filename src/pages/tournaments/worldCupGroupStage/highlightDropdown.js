import React, { useEffect, useState } from 'react';
import { Button, Row, Select } from 'antd';
import { useLeagueState } from '../../../context/leagueContext';
import { useAuthState } from '../../../context/authContext';
import useData from '../../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../../utilities/constants';
import { useTournamentDispatch } from '../../../context/tournamentContext';
import { leagueServiceHelper } from '../../../services/league/helper';

const { Option } = Select;

/**
 * @typedef HighlightDropdownProps
 * @property {String} selectedUserKey
 * @property {String} [selectPlaceholder]
 */

/**
 * @component
 * @param {HighlightDropdownProps} props
 */
function HighlightDropdown(props) {

  const [selectedUser, setSelectedUser] = useState(null);
  const [usersDownloaded, setUsersDownloaded] = useState(null);

  const { leagueId } = useLeagueState();
  const { authenticated } = useAuthState();
  const tournamentDispatch = useTournamentDispatch();

  const [users, usersReturnDate, fetchUsers] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES}/${leagueId}`,
    method: 'GET',
    processData: leagueServiceHelper.packageLeagueUserInfo,
    conditions: [authenticated, leagueId]
  });

  const generateLeagueUserOptions = () => {
    if (users && users.length) {
      users.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
        return 0;
      });

      return users.map(user => {
        return (
          <Option key={user.id} value={user.id}>{user.name}</Option>
        );
      });
    }

    return null;
  }

  useEffect(() => {
    if (leagueId && authenticated) {
      fetchUsers();
    }

    return (() => {
      cleanupContext();
    });
  }, [leagueId, authenticated]);

  useEffect(() => {
    if (usersReturnDate) setUsersDownloaded(usersReturnDate);
  }, [usersReturnDate]);

  const cleanupContext = () => {
    tournamentDispatch({ type: 'clear' });
  }

  const userSelected = (value) => {
    setSelectedUser(value);
    tournamentDispatch({ type: 'update', key: props.selectedUserKey, value: value });
  }

  const clearSelection = () => {
    setSelectedUser(null);
    tournamentDispatch({ type: 'update', key: props.selectedUserKey, value: null });
  }

  return (
    <Row justify='center'>
      <Select
        style={{ width: 200 }}
        placeholder={props.selectPlaceholder || null}
        value={selectedUser}
        onSelect={userSelected}
      >
        {generateLeagueUserOptions()}
      </Select>
      <Button type='primary' onClick={clearSelection}>
        Clear
      </Button>
    </Row>
  )
}

export default HighlightDropdown;