import React, { useEffect, useState, Fragment } from 'react';
import { Button, message, Row, Table } from 'antd';
import 'antd/dist/antd.css';
import { useAuthState } from '../../context/authContext';
import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { leagueServiceHelper } from '../../services/league/helper';
import useData from '../../hooks/useData';
import { API_CONFIG } from '../../utilities/constants';
import { sortRoster } from '../../services/league/parsers/leagueRoster';
import RoleSelection from './roleSelection';
import { ButtonCell } from '../tableCells';

const { Column } = Table;

function LeagueRoster() {

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [dataChangedEvent, setDataChangedEvent] = useState(null);
  const [updatedRoles, setUpdatedRoles] = useState([]);

  const { authenticated, userId } = useAuthState();
  const { leagueId, roleId } = useLeagueState();

  const [roster, rosterFetchDate, getRoster] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_ROSTER}/${leagueId}`,
    method: 'GET',
    processData: sortRoster,
    conditions: [authenticated, leagueId]
  });

  const [rolesUpdate, rolesUpdateReturnDate, updateRoles] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.SET_LEAGUE_MEMBER_ROLES}/${leagueId}`,
    method: 'POST',
    conditions: [authenticated, leagueId]
  });

  const [kickMemberResponse, kickMemberReturnDate, kickMember] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: LEAGUE_SERVICE_ENDPOINTS.KICK_LEAGUE_MEMBER,
    method: 'POST',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (authenticated && leagueId) {
      getRoster();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    setLoading(false);
  }, [rosterFetchDate]);

  useEffect(() => {
    if (rolesUpdateReturnDate) {
      setSaveLoading(false);
      refreshRoster();
    }
  }, [rolesUpdateReturnDate]);

  useEffect(() => {
    if (kickMemberReturnDate) {
      console.log(kickMemberResponse);
      
      if (kickMemberResponse && kickMemberResponse[0]?.Error != undefined) {
        message.error(kickMemberResponse[0].Error);
      } else {
        refreshRoster();
      }
    }
  }, [kickMemberReturnDate]);

  const kickLeagueMember = (kickedUserId) => {
    const payload = {
      leagueId: leagueId,
      userId: kickedUserId
    };

    kickMember(payload);
  }

  const refreshRoster = () => {
    setDataChangedEvent(null)
    setUpdatedRoles([]);
    setLoading(true);
    getRoster();
  }

  const roleChanged = (userId, roleId) => {
    const roles = [...updatedRoles];
    const userRole = roles.find(r => r.userId == userId);

    if (userRole == undefined) {
      setUpdatedRoles([...roles, { leagueId: leagueId, userId: userId, roleId: roleId }]);
    } else {
      userRole.roleId = roleId;
      setUpdatedRoles(roles);
    }

    setDataChangedEvent(new Date().valueOf());
  }

  const saveChanges = () => {
    setSaveLoading(true);
    updateRoles({ roles: updatedRoles });
  }

  return (
    <Fragment>
      <Table
        dataSource={roster}
        loading={loading}
        rowKey='UserId'
        size='small'
        pagination={false}
        style={{ width: '100%' }}
      >
        <Column
          title='Username'
          dataIndex='Username'
          width='60%'
        />
        <Column
          title='Role'
          dataIndex='RoleName'
          width='40%'
          render={(text, record) => {
            return (
              <RoleSelection
                userId={record.UserId}
                roleId={record.RoleId}
                roleName={text}
                roleOptions={record.AllowedRoles}
                roleChanged={roleChanged}
              />
            );
          }}
        />
        <Column
          key='kick'
          render={(text, record) => {
            let disabled = true;

            // Creator can remove anyone
            if (roleId == 1) {
              disabled = false;
            } else if (roleId == 2 && record.RoleId > 2) {
              // Admins can remove any non-admin (or creator)
              disabled = false;
            }

            // User cannot kick themselves
            if (+record.UserId == userId) {
              disabled = true;
            }
            
            return (
              <ButtonCell
                type='primary'
                size='small'
                danger
                disabled={disabled}
                onClick={() => kickLeagueMember(record.UserId)}
                cancelLoading={kickMemberReturnDate}
              >
                Remove
              </ButtonCell>
            );
          }}
        />
      </Table>
      <Row justify='center'>
        <Button
          type='primary'
          size='small'
          loading={saveLoading}
          onClick={saveChanges}
          disabled={!dataChangedEvent}
          style={{ margin: '8px 0' }}
        >
          Save Changes
        </Button>
      </Row>
    </Fragment>
  );
}

export default LeagueRoster;