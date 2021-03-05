import React, { useEffect, useState } from 'react';
import { Button, message, Table } from 'antd';
import 'antd/dist/antd.css';
import { useAuthState } from '../../context/authContext';
import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { leagueServiceHelper } from '../../services/league/helper';

function LeagueRoster() {

  const columns = [
    {
      title: 'Username',
      dataIndex: 'name',
      width: '80%'
    },
    {
      title: 'Role',
      dataIndex: 'role',
      width: '20%'
    },
    {
      key: 'kick',
      width: 100,
      render: (text, record) => {
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
      }
    }
  ];

  const [loading, setLoading] = useState(true);
  const [kickLoading, setKickLoading] = useState(false);

  const { authenticated, userId } = useAuthState();
  const { leagueId, userList } = useLeagueState();

  const leagueDispatch = useLeagueDispatch();

  useEffect(() => {
    if (authenticated && leagueId) {
      fetchLeagueRoster();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    if (userList && userList.length) {
      setLoading(false);
    }
  }, [userList]);

  const fetchLeagueRoster = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_SUMMARIES, { leagueId }).then(response => {
      let leagueUsers = leagueServiceHelper.packageLeagueUserInfo(response.data);
      leagueDispatch({ type: 'update', key: 'userList', value: leagueUsers });
    }).catch(error => {
      console.log(error);
    });
  }

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
        fetchLeagueRoster();
      }

      setKickLoading(false);
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <Table
      columns={columns}
      dataSource={userList}
      loading={loading}
      rowKey='id'
      size='small'
      pagination={false}
      style={{ width: '100%' }}
    />
  );
}

export default LeagueRoster;