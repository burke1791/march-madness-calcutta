import React, { useEffect, useState } from 'react';
import { Button, List, message, Row, Table } from 'antd';
import 'antd/dist/antd.css';
import { useLeagueState } from '../../context/leagueContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { leagueServiceHelper } from '../../services/league/helper';
import { teamDisplayName } from '../../utilities/helper';
import { useAuthState } from '../../context/authContext';

function SeedGroupSettings(props) {

  const seedGroupColumns = [
    {
      title: 'Group Name',
      dataIndex: 'groupName',
      width: 350
    },
    {
      title: 'Teams',
      dataIndex: 'teams',
      width: 300,
      render: (text, record) => {
        return (
          <List
            dataSource={record.teams}
            size='small'
            renderItem={item => {
              return (
                <List.Item key={item.slotId} size='small'>
                  {teamDisplayName(item.teamName, item.seed)}
                </List.Item>
              );
            }}
          />
        );
      }
    },
    {
      key: 'delete',
      render: (text, record) => {
        return (
          <Button
            type='primary'
            danger
            onClick={() => deleteSeedGroup(record.groupId)}
            loading={deleteLoading}
          >
            Delete
          </Button>
        )
      }
    }
  ]

  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  const { leagueId, seedGroupsRefresh } = useLeagueState();
  const { authenticated } = useAuthState();

  useEffect(() => {
    if (leagueId && authenticated) {
      fetchSeedGroups();
    }
  }, [leagueId, seedGroupsRefresh, authenticated]);

  const fetchSeedGroups = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SEED_GROUPS, { leagueId }).then(response => {
      let groups = leagueServiceHelper.packageLeagueSeedGroups(response.data);
      console.log(groups);
      setGroups(groups);
      setLoading(false);
    }).catch(error => {
      setLoading(false);
      console.log(error);
    });
  }

  const deleteSeedGroup = (groupId) => {
    setDeleteLoading(true);

    let payload = {
      leagueId: leagueId,
      groupId: groupId
    };

    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.DELETE_LEAGUE_SEED_GROUP, { payload }).then(response => {
      console.log(response);
      setDeleteLoading(false);

      if (response.data && response.data[0]?.Error != undefined) {
        message.error(response.data[0].Error);
      } else {
        fetchSeedGroups();
      }
    }).catch(error => {
      setDeleteLoading(false);
      console.log(error);
    });
  }

  return (
    <Row justify='center'>
      <Table
        columns={seedGroupColumns}
        dataSource={groups}
        loading={loading}
        rowKey='groupId'
        rowClassName='pointer'
        size='small'
        pagination={false}
      />
    </Row>
  )
}

export default SeedGroupSettings;