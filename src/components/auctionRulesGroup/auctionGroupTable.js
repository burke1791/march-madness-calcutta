import React, { useEffect, useState } from 'react';
import { List, Table } from 'antd';
import 'antd/dist/antd.css';
import { useLeagueState } from '../../context/leagueContext';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { leagueServiceHelper } from '../../services/league/helper';
import { teamDisplayName } from '../../utilities/helper';
import { useAuthState } from '../../context/authContext';
import AuctionGroupDeleteButtonCell from './auctionGroupDeleteButtonCell';
import useData from '../../hooks/useData';

const { Column } = Table;

function AuctionGroupTable() {

  const [loading, setLoading] = useState(true);

  const { leagueId, seedGroupsRefresh } = useLeagueState();
  const { authenticated } = useAuthState();

  const [groups, groupsReturnDate, fetchGroups] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_SEED_GROUPS}/${leagueId}`,
    method: 'GET',
    processData: leagueServiceHelper.packageLeagueSeedGroups,
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (leagueId && authenticated) {
      fetchGroups();
    }
  }, [leagueId, seedGroupsRefresh, authenticated]);

  useEffect(() => {
    if (groupsReturnDate != undefined) {
      setLoading(false);
    }
  }, [groupsReturnDate]);

  return (
    <Table
      dataSource={groups}
      loading={loading}
      rowKey='groupId'
      rowClassName='pointer'
      size='small'
      pagination={false}
    >
      <Column
        title='Group Name'
        dataIndex='groupName'
        width={350}
      />
      <Column
        title='Teams'
        dataIndex='teams'
        width={300}
        render={(text, record) => {
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
        }}
      />
      <Column
        key='delete'
        render={(text, record) => {
          return (
            <AuctionGroupDeleteButtonCell groupId={record.groupId} />
          );
        }}
      />
    </Table>
  )
}

export default AuctionGroupTable;