import React from 'react';
import { Typography } from 'antd';
import AlivePie from '../../alivePie/alivePie';
import { formatMoney } from '../../../utilities/helper';
import { userId } from '../../../utilities/leagueService';

const { Text } = Typography

export const userColumns = [
  {
    title: 'Rank',
    dataIndex: 'rank',
    align: 'center',
    width: 75,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <Text>{text}</Text>
        }
      }
      return <Text>{text}</Text>;
    }
  },
  {
    title: 'Name',
    dataIndex: 'name',
    align: 'center',
    width: 250,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <Text>{text}</Text>
        }
      }
      return <Text>{text}</Text>;
    }
  },
  {
    title: 'Buy In',
    dataIndex: 'buyIn',
    align: 'center',
    width: 150,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <Text>{formatMoney(record.buyIn)}</Text>
        }
      }
      return <Text>{formatMoney(record.buyIn)}</Text>;
    }
  },
  {
    title: 'Current Payout',
    dataIndex: 'payout',
    align: 'center',
    width: 150,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <Text>{formatMoney(record.payout)}</Text>
        }
      }
      return <Text>{formatMoney(record.payout)}</Text>;
    }
  },
  {
    title: 'Net Return',
    dataIndex: 'return',
    align: 'center',
    width: 150,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <Text type={record.return < 0 ? 'danger' : ''}>{formatMoney(record.return)}</Text>
        }
      }
      return <Text type={record.return < 0 ? 'danger' : ''}>{formatMoney(record.return)}</Text>
    }
  },
  {
    dataIndex: 'teamsAlive',
    align: 'center',
    width: 75,
    render: (text, record) => {
      if (record.id == userId) {
        return {
          props: {
            style: {
              backgroundColor: '#b7daff'
            }
          },
          children: <AlivePie numTeamsAlive={record.numTeamsAlive} numTeams={record.numTeams} />
        }
      }
      return <AlivePie numTeamsAlive={record.numTeamsAlive} numTeams={record.numTeams} />;
    }
  }
];