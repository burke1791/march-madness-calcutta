import React, { useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import 'antd/dist/antd.css';
import { useAuthState } from '../../context/authContext';
import { useLeagueState } from '../../context/leagueContext';

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
            onClick={() => kickLeagueMember(record.userId)}
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

  useEffect(() => {
    if (userList && userList.length) {
      setLoading(false);
    }
  }, [userList]);

  const fetchLeagueRoster = () => {

  }

  const kickLeagueMember = (userId) => {
    setKickLoading(true);


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