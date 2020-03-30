import React, { useState, useEffect } from 'react';

import { Layout, Table, Row, Typography } from 'antd';
import 'antd/dist/antd.css';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import { Data, fetchUserTeams, clearUserTeams } from '../../utilities/leagueService';
import { formatMoney } from '../../utilities/helper';
import { useLeagueState } from '../../context/leagueContext';

const { Header, Content } = Layout;
const { Text } = Typography;

const columns = [
  {
    title: 'Team Name',
    dataIndex: 'name',
    align: 'center',
    width: 250,
    render: (text, record) => {
      if (record.seed != null) {
        return `(${record.seed}) ${text}`;
      }
      return text;
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
    width: 150,
    render: (text, record) => {
      return <Text type={record.netReturn < 0 ? 'danger' : ''}>{formatMoney(text)}</Text>;
    }
  }
];

function MemberPage(props) {

  const [alias, setAlias] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const { leagueId } = useLeagueState();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_USER_TEAMS_FETCHED, MemberPage, handleTeams);

    fetchUserTeams(leagueId, props.location.state.userId);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_USER_TEAMS_FETCHED, MemberPage);
      clearUserTeams();
    });
  }, []);

  const handleTeams = () => {
    setAlias(Data.userAlias);
    setTeams(Data.userTeams);
    setLoading(false);
  }

  return (
    <Layout>
      <Header style={{ background: 'none', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px' }}>{alias}</h1>
      </Header>
      <Content>
        <Row type='flex' justify='center'>
          <Table
            columns={columns}
            dataSource={teams}
            size='middle'
            pagination={false}
            loading={loading}
            rowKey='teamId'
            onRow={
              (record, index) => {
                return {
                  onClick: (event) => {
                    console.log('team page coming soon?');
                  }
                };
              }
            }
          />
        </Row>
      </Content>
    </Layout>
  );
}

export default MemberPage;