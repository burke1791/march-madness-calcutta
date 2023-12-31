import React, { useState, useEffect } from 'react';

import { Layout, Table, Row, Typography, message } from 'antd';

import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import LeagueService from '../../services/league/league.service';
import { formatMoney, teamDisplayName } from '../../utilities/helper';
import { useLeagueState } from '../../context/leagueContext';
import { leagueServiceHelper } from '../../services/league/helper';
import { useAuthState } from '../../context/authContext';
import { useLocation } from 'react-router-dom';
import useData from '../../hooks/useData';
import { parseLeagueUserTeams } from '../../parsers/league';

const { Header, Content } = Layout;
const { Text, Title } = Typography;

const columns = [
  {
    title: 'Team Name',
    dataIndex: 'name',
    align: 'left',
    width: 250,
    render: (text, record) => {
      if (record.seed != null) {
        return <Text delete={record.eliminated}>{teamDisplayName(text, record.seed)}</Text>;
      }
      return <Text delete={record.eliminated}>{text}</Text>;
    }
  },
  {
    title: 'Price',
    dataIndex: 'price',
    align: 'center',
    width: 150,
    render: (text) => {
      return formatMoney(text);
    }
  },
  {
    title: 'Payout',
    dataIndex: 'payout',
    align: 'center',
    width: 150,
    render: (text) => {
      return formatMoney(text);
    }
  },
  {
    title: 'Net Return',
    dataIndex: 'netReturn',
    align: 'center',
    responsive: ['md'],
    width: 150,
    render: (text, record) => {
      return <Text type={record.netReturn < 0 ? 'danger' : ''}>{formatMoney(text)}</Text>;
    }
  }
];

function MemberPage(props) {

  const [alias, setAlias] = useState('');
  const [teams, setTeams] = useState([]);
  const [userId, setUserId] = useState(null);
  const [numTeams, setNumTeams] = useState(0);
  const [totalBuyIn, setTotalBuyIn] = useState(0);
  const [taxBuyIn, setTaxBuyIn] = useState(0);
  const [payout, setPayout] = useState(0);
  const [loading, setLoading] = useState(true);

  const { leagueId } = useLeagueState();
  const { authenticated } = useAuthState();
  const location = useLocation();

  const [userMetadata, userMetadataReturnDate, fetchUserMetadata] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_LEAGUE_USER_METADATA}/${leagueId}/${userId}`,
    method: 'GET',
    processData: null,
    conditions: [authenticated, userId, leagueId]
  });

  const [userTeams, userTeamsReturnDate, fetchUserTeams] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.LEAGUE_USER_TEAMS}/${leagueId}/${userId}`,
    method: 'GET',
    processData: parseLeagueUserTeams,
    conditions: [authenticated, userId, leagueId]
  });

  useEffect(() => {
    // cannot use lookbehind on mobile because reasons (ugh)
    const userIdPath = location.pathname.match(/\/member\/\d{1,}($|(?=\/))/ig)[0];
    const parsedUserId = Number(userIdPath.substring(8));
    if (parsedUserId && !isNaN(parsedUserId)) {
      setUserId(parsedUserId);
    }
  }, [JSON.stringify(location)]);

  useEffect(() => {
    if (userMetadata && userMetadataReturnDate) {
      setAlias(userMetadata.alias);
      setNumTeams(userMetadata.numTeams);
      setTotalBuyIn(userMetadata.totalBuyIn);
      setTaxBuyIn(userMetadata.taxBuyIn);
      setPayout(userMetadata.totalReturn);
    }
  }, [userMetadata, userMetadataReturnDate]);

  useEffect(() => {
    console.log(userTeams);
    if (userTeams?.length && userTeamsReturnDate) {
      setTeams(userTeams);
      setLoading(false);
    } else if (userTeams?.length == 0) {
      setTeams([]);
      setLoading(false);
    }
  }, [userTeams, userTeamsReturnDate]);

  useEffect(() => {
    if (authenticated && userId && leagueId) {
      fetchUserMetadata();
      fetchUserTeams();
    }
  }, [authenticated, userId, leagueId]);

  const groupTeamsTable = (groupTeams) => {
    const columns = [
      { width: 25 }, // I don't like this, but it's a quick fix for now
      {
        title: 'Team Name',
        dataIndex: 'name',
        render: (text, record) => {
          if (record.seed != null) {
            return <Text delete={record.eliminated}>{teamDisplayName(text, record.seed)}</Text>;
          }
          return <Text delete={record.eliminated}>{text}</Text>;
        }
      },
      {
        title: 'Payout',
        dataIndex: 'payout',
        render: (text) => <Text>{formatMoney(text)}</Text>
      }
    ];

    return (
      <Table
        columns={columns}
        dataSource={groupTeams}
        pagination={false}
        rowKey='id'
        rowClassName='pointer'
        onRow={
          (record, index) => {
            return {
              onClick: (event) => {
                message.info('Team page coming soon');
              }
            };
          }
        }
      />
    );
  };

  return (
    <Layout>
      <Header style={{ background: 'none', textAlign: 'center' }}>
        <Title level={1} style={{ margin: 0 }}>{alias}</Title>
      </Header>
      <Content>
        <Row type='flex' justify='center'>
          <Table
            columns={columns}
            dataSource={teams}
            rowClassName='pointer'
            size='small'
            pagination={false}
            loading={loading}
            rowKey='id'
            onRow={
              (record, index) => {
                if (!record.groupFlag) {
                  return {
                    onClick: (event) => {
                      message.info('Team page coming soon');
                    }
                  };
                }
              }
            }
            expandable={{ 
              expandedRowRender: record => groupTeamsTable(record.groupTeams),
              rowExpandable: record => record.groupFlag,
              expandRowByClick: true,
              defaultExpandAllRows: true
            }}
          />
        </Row>
      </Content>
    </Layout>
  );
}

export default MemberPage;