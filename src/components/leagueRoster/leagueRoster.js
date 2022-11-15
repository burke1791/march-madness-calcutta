import React, { useEffect, useState } from 'react';
import { Button, message, Table } from 'antd';
import 'antd/dist/antd.css';
import { useAuthState } from '../../context/authContext';
import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { leagueServiceHelper } from '../../services/league/helper';
import useData from '../../hooks/useData';
import { API_CONFIG } from '../../utilities/constants';

const { Column } = Table;

function LeagueRoster() {

  const [loading, setLoading] = useState(true);
  const [kickLoading, setKickLoading] = useState(false);

  const { authenticated, userId } = useAuthState();
  const { leagueId, userList } = useLeagueState();

  const leagueDispatch = useLeagueDispatch();

  const [roster, rosterFetchDate, getRoster] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated],
    processData: leagueServiceHelper.packageLeagueUserInfo
  });

  useEffect(() => {
    console.log(authenticated);
    console.log(leagueId);
    if (authenticated && leagueId) {
      console.log('calling getRoster');
      getRoster();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    console.log(roster);
    console.log(rosterFetchDate);
    if (rosterFetchDate && roster && roster.length > 0) {
      leagueDispatch({ type: 'update', key: 'userList', value: roster });
    }
  }, [rosterFetchDate]);

  useEffect(() => {
    if (userList && userList.length) {
      setLoading(false);
    }
  }, [JSON.stringify(userList)]);

  const kickLeagueMember = (kickedUserId) => {
    setKickLoading(true);

    let payload = {
      leagueId: leagueId,
      userId: kickedUserId
    };

    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.KICK_LEAGUE_MEMBER, { payload }).then(response => {
      console.log(response);

      if (response.data && response.data[0]?.Error != undefined) {
        message.error(response.data[0].Error);
      } else {
        getRoster();
      }

      setKickLoading(false);
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <Table
      dataSource={userList}
      loading={loading}
      rowKey='id'
      size='small'
      pagination={false}
      style={{ width: '100%' }}
    >
      <Column
        title='Username'
        dataIndex='name'
        width='80%'
      />
      <Column
        title='Role'
        dataIndex='role'
        width='20%'
      />
      <Column
        key='kick'
        width={100}
        render={(text, record) => {
          let disabled = false;

          if (record.id == userId) {
            disabled = true;
          }
          
          return (
            <Button
              type='primary'
              danger
              disabled={disabled}
              onClick={() => kickLeagueMember(record.id)}
              loading={kickLoading}
            >
              Remove
            </Button>
          )
        }}
      />
    </Table>
  );
}

export default LeagueRoster;