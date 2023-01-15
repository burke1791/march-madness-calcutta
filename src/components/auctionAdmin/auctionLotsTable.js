import React, { useEffect, useState } from 'react';
import { Popconfirm, Table, Button } from 'antd';
import { useAuctionState } from '../../context/auctionContext';
import { useLeagueState } from '../../context/leagueContext';
import { AUCTION_STATUS } from '../../utilities/constants';
import { formatMoney } from '../../utilities/helper';

const { Column } = Table;

function AuctionLotsTable(props) {

  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  const { leagueId } = useLeagueState();
  const { teams, teamsDownloadedDate } = useAuctionState();

  useEffect(() => {
    if (teamsDownloadedDate) {
      setLoading(false);

      // parse teams into tableData
      if (teams.length) {
        const teamArr = teams.map(team => {
          return {
            itemId: team.itemId,
            displayName: team.displayName,
            ownerAlias: team.ownerAlias,
            price: team.price,
            displayClass: team.displayClass
          };
        });

        setTableData(teamArr);
      }
    }
  }, [teamsDownloadedDate]);

  const setNextItem = (itemId) => {

  }

  return (
    <Table
      dataSource={tableData}
      loading={loading}
      pagination={false}
      size='small'
      scroll={{ y: 400 }}
      rowKey='itemId'
    >
      <Column
        title='Name'
        dataIndex='displayName'
        align='left'
      />
      <Column
        title='Owner'
        dataIndex='ownerAlias'
        align='left'
      />
      <Column
        title='Price'
        dataIndex='price'
        render={(text, record) => formatMoney(text)}
      />
      <Column
        render={(text, record) => {
          if (record.displayClass == 'purchased' || record.displayClass == 'unsold') {
            return (
              <ResetItemButton
                itemId={record.itemId}
              />
            );
          } else {
            return (
              <SetNextItemButton
                itemId={record.itemId}
                onClick={setNextItem}
              />
            )
          }
        }}
      />
    </Table>
  )
}

export default AuctionLotsTable;

/**
 * @typedef SetNextItemButtonProps
 * @property {Number} itemId
 * @property {Function} onClick
 */

/**
 * @component
 * @param {SetNextItemButtonProps} props 
 */
function SetNextItemButton(props) {

  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const { status } = useAuctionState();

  useEffect(() => {
    setLoading(false);

    if (status === AUCTION_STATUS.BIDDING || status === AUCTION_STATUS.END) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [status]);

  const onClick = () => {
    props.onClick(props.itemId);
  }

  return (
    <Button
      type='primary'
      size='small'
      onClick={onClick}
      loading={loading}
      disabled={disabled}
    >
      Set Next Item
    </Button>
  );
}

/**
 * @typedef ResetItemButtonProps
 * @property {Number} itemId
 */

/**
 * @component
 * @param {ResetItemButtonProps} props 
 */
function ResetItemButton(props) {

  const [loading, setLoading] = useState(false);

  const onClick = () => {

  }
  
  return (
    <Popconfirm
      okText='Yes'
      cancelText='Cancel'
      title='Are you sure? This cannot be undone!'
      onConfirm={onClick}
    >
      <Button
        type='primary'
        size='small'
        loading={loading}
        danger
      >
        Reset
      </Button>
    </Popconfirm>
  );
}