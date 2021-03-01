import React, { useEffect, useState } from 'react';
import { List, Row, Table } from 'antd';
import 'antd/dist/antd.css';
import { useLeagueState } from '../../context/leagueContext';
import LeagueService from '../../services/league/league.service';
import { LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { leagueServiceHelper } from '../../services/league/helper';
import { teamDisplayName } from '../../utilities/helper';

function SeedGroupSettings(props) {

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  const { leagueId } = useLeagueState();

  useEffect(() => {
    if (leagueId) {
      fetchSeedGroups();
    }
  }, [leagueId]);

  const fetchSeedGroups = () => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SEED_GROUPS, { leagueId }).then(response => {
      let groups = leagueServiceHelper.packageLeagueSeedGroups(response.data);
      setGroups(groups);
      setLoading(false);
    }).catch(error => {
      setLoading(false);
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
          renderItem={item => {
            return (
              <List.Item key={item.teamId}>
                {teamDisplayName(item.teamName, item.seed)}
              </List.Item>
            );
          }}
        />
      );
    }
  }
]