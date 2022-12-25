import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import { SeedGroupForm } from '../forms';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';

/**
 * @typedef AuctionGroupModalProps
 * @property {Boolean} visible
 * @property {Function} dismiss
 * @property {Object} group
 * @property {Boolean} isEditMode
 */

/**
 * @component
 * @param {AuctionGroupModalProps} props 
 */
function AuctionGroupModal(props) {

  const [teamsLoading, setTeamsLoading] = useState(true);

  const { leagueId, seedGroupsRefresh } = useLeagueState();
  const { authenticated } = useAuthState();

  const [teams, teamsReturnDate, getTeams] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_TEAMS}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (leagueId && authenticated) {
      setTeamsLoading(true);
      getTeams();
    }
  }, [leagueId, authenticated, seedGroupsRefresh]);

  useEffect(() => {
    if (teamsReturnDate) {
      setTeamsLoading(false);
    }
  }, [teamsReturnDate]);

  const groupName = props.group?.groupName || '';
  const groupTeams = props.group?.teams || [];

  return (
    <Modal
      title={props.isEditMode ? 'Update Group' : 'New Group'}
      open={props.visible}
      destroyOnClose
      onCancel={props.dismiss}
      style={{ maxWidth: 320, top: 50 }}
      footer={null}
    >
      <SeedGroupForm
        tournamentTeams={teams}
        teamsLoading={teamsLoading}
        isEditMode={props.isEditMode}
        groupId={props.group?.groupId || null}
        groupName={groupName}
        groupTeams={groupTeams}
        group={props.group}
      />
    </Modal>
  )
}

export default AuctionGroupModal;