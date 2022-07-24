import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';
import { useLeagueState } from '../../context/leagueContext';

/**
 * @typedef AuctionGroupDeleteButtonCellProps
 * @property {Number} groupId
 * @property {Function} [onClick]
 */

/**
 * @component
 * @param {AuctionGroupDeleteButtonCellProps} props 
 */
function AuctionGroupDeleteButtonCell(props) {

  const [loading, setLoading] = useState(false);

  const { authenticated } = useAuthState();
  const { leagueId } = useLeagueState();

  const [deleteGroupResponse, deleteGroupReturnDate, deleteGroup] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: LEAGUE_SERVICE_ENDPOINTS.DELETE_LEAGUE_SEED_GROUP,
    method: 'POST',
    conditions: [authenticated]
  });

  useEffect(() => {
    if (deleteGroupReturnDate != undefined) {
      setLoading(false);
    }
  }, [deleteGroupReturnDate]);

  const onClick = () => {
    setLoading(true);
    const payload = {
      leagueId: leagueId,
      groupId: props.groupId
    };

    deleteGroup(payload);

    if (props.onClick != undefined) {
      props.onClick(props.groupId);
    }
  }

  return (
    <Button
      type='primary'
      danger
      size='small'
      onClick={onClick}
      loading={loading}
    >
      Delete
    </Button>
  );
}

export default AuctionGroupDeleteButtonCell;