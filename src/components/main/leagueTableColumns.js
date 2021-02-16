import React from 'react';
import { Typography } from 'antd';
import { formatMoney } from '../../utilities/helper';

const { Text } = Typography;

export const leagueTableColumns = [
  {
    title: 'League Name',
    dataIndex: 'name',
    align: 'left',
    width: 250
  },
  {
    title: 'Buy In',
    dataIndex: 'buyIn',
    align: 'center',
    width: 150,
    render: (text) => {
      if (text === null) return '';
      return formatMoney(+text);
    }
  },
  {
    title: 'Current Payout',
    dataIndex: 'payout',
    align: 'center',
    width: 150,
    render: (text) => {
      if (text === null) return '';
      return formatMoney(+text);
    }
  },
  {
    title: 'Net Return',
    dataIndex: 'netReturn',
    align: 'center',
    responsive: ['md'],
    width: 150,
    render: (text, record) => {
      if (text === null) return '';
      return <Text type={+text < 0 ? 'danger' : ''}>{formatMoney(+text)}</Text>;
    }
  }
];