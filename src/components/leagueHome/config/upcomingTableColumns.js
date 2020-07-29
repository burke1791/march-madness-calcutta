import React from 'react';
import { Typography } from "antd";
import { formatDateTime } from '../../../utilities/helper';
import { userId } from '../../../services/league/endpoints';

const { Text } = Typography

export const upcomingColumns = [
  {
    title: 'Upcoming Games',
    dataIndex: 'homeTeamName',
    colSpan: 2,
    align: 'center',
    width: 200,
    render: (text, record) => {
      let teamName = record.homeTeamName == null ? 'TBD' : `(${record.homeTeamSeed}) ${record.homeTeamName}`;

      if (record.homeTeamOwnerId == userId) {
        return <Text strong>{teamName}</Text>;
      }
      return <Text>{teamName}</Text>;
    }
  },
  {
    title: 'Away',
    dataIndex: 'awayTeamName',
    colSpan: 0,
    align: 'center',
    width: 200,
    render: (text, record) => {
      let teamName = record.awayTeamName == null ? 'TBD' : `(${record.awayTeamSeed}) ${record.awayTeamName}`;

      if (record.awayTeamOwnerId == userId) {
        return <Text strong>{teamName}</Text>;
      }
      return <Text>{teamName}</Text>;
    }
  },
  {
    title: 'Date',
    dataIndex: 'eventDate',
    align: 'center',
    width: 250,
    render: (text, record) => {
      return <Text>{formatDateTime(record.eventDate)}</Text>
    }
  }
]