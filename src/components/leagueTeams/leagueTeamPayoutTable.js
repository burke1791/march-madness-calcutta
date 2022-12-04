import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { ButtonCell, InputCell, InputNumberCell } from '../tableCells';
import './leagueTeamPayoutTable.css';
import { useLeagueState } from '../../context/leagueContext';
import { formatMoney } from '../../utilities/helper';
import { DeleteOutlined } from '@ant-design/icons';

const { Column } = Table;
const { Text } = Typography;

/**
 * @typedef LeagueTeamPayoutTableProps
 * @property {Number} teamId
 * @property {Array} payouts
 * @property {Function} payoutChanged
 */

/**
 * @component
 * @param {LeagueTeamPayoutTableProps} props 
 */
function LeagueTeamPayoutTable(props) {

  const [tableData, setTableData] = useState([]);

  const { roleId } = useLeagueState();

  useEffect(() => {
    setTableData(props.payouts);
  }, [JSON.stringify(props.payouts)]);

  const getRowClass = (record) => {
    if (record.IsDeleted) {
      return 'deleted'
    }
    return null;
  }

  const payoutValueChanged = (id, value) => {
    props.payoutChanged(id, 'PayoutAmount', value);
  }

  const payoutDescriptionChanged = (id, value) => {
    props.payoutChanged(id, 'PayoutDescription', value);
  }

  const toggleDeletePayout = (id, isDeleted) => {
    props.payoutChanged(id, 'IsDeleted', isDeleted);
  }

  const generateTableButtons = () => {
    if (roleId == 1 || roleId == 2) {
      return (
        <Column
          align='right'
          render={(value, record) => {
            return (
              <ButtonCell
                type='primary'
                danger={record.IsDeleted ? false : true}
                size='small'
                onClick={(event) => {
                  event.stopPropagation();
                  toggleDeletePayout(record.LeagueTeamPayoutId, !record.IsDeleted);
                }}
                animated={false}
              >
                {record.IsDeleted ? 'Undo' : <DeleteOutlined />}
              </ButtonCell>
            );
          }}
        />
      );
    }

    return null;
  }

  return (
    <Table
      dataSource={tableData}
      pagination={false}
      size='small'
      rowKey='LeagueTeamPayoutId'
      rowClassName={getRowClass}
    >
      <Column
        title='Paid By'
        dataIndex='UpdatedByUsername'
        responsive={['sm']}
      />
      <Column
        title='Amount'
        dataIndex='PayoutAmount'
        render={(value, record) => {
          if (roleId == 1 || roleId == 2) {
            return (
              <InputNumberCell
                name={record.LeagueTeamPayoutId}
                value={record.PayoutAmount}
                precision={2}
                addonBefore='$'
                onChange={payoutValueChanged}
              />
            );
          }
          return formatMoney(value);
        }}
      />
      <Column
        title='Description'
        dataIndex='PayoutDescription'
        render={(value, record) => {
          if (roleId == 1 || roleId == 2) {
            return (
              <InputCell
                name={record.LeagueTeamPayoutId}
                value={record.PayoutDescription}
                onChange={payoutDescriptionChanged}
              />
            );
          }
          return <Text>{record.PayoutDescription}</Text>
        }}
      />
      {generateTableButtons()}
    </Table>
  );
}

export default LeagueTeamPayoutTable;