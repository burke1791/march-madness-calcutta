import React, { useEffect, useState } from 'react';
import { Popconfirm, Table, Button } from 'antd';
import { useAuctionState } from '../../context/auctionContext';
import { useLeagueState } from '../../context/leagueContext';
import { API_CONFIG, AUCTION_SERVICE_ENDPOINTS, AUCTION_STATUS } from '../../utilities/constants';
import { formatMoney } from '../../utilities/helper';
import useData from '../../hooks/useData';
import { useAuthState } from '../../context/authContext';

const { Column } = Table;

function AuctionLotsTable(props) {

  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  const { leagueId } = useLeagueState();
  const { teams, teamsDownloadedDate, resetItemTriggered } = useAuctionState();

  useEffect(() => {
    if (teamsDownloadedDate) {
      setLoading(false);

      // parse teams into tableData
      if (teams.length) {
        const teamArr = teams.map(team => {
          return {
            itemId: team.itemId,
            itemTypeId: team.itemTypeId,
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

  useEffect(() => {
    if (resetItemTriggered) {
      setLoading(false);
    }
  }, [resetItemTriggered]);

  const setNextItem = (itemId, itemTypeId) => {
    const payload = {
      leagueId: leagueId,
      itemId: itemId,
      itemTypeId: itemTypeId
    };

    props.sendSocketMessage('NEXT_ITEM', payload);
    props.dismissableClick('NEXT_ITEM');
  }

  const resetItem = (itemId, itemTypeId) => {
    const payload = {
      leagueId: leagueId,
      itemId: itemId,
      itemTypeId: itemTypeId
    };

    props.sendSocketMessage('RESET_ITEM', payload);
  }

  return (
    <Table
      dataSource={tableData}
      loading={loading}
      pagination={false}
      size='small'
      scroll={{ y: 400 }}
      rowKey={(record) => `${record.itemId}_${record.itemTypeId}`}
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
        align='right'
        render={(text, record) => {
          if (record.displayClass == 'purchased' || record.displayClass == 'unsold') {
            return (
              <ResetItemButton
                itemId={record.itemId}
                itemTypeId={record.itemTypeId}
                onClick={resetItem}
              />
            );
          } else {
            return (
              <SetNextItemButton
                itemId={record.itemId}
                itemTypeId={record.itemTypeId}
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
 * @property {Number} itemTypeId
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
    setLoading(true);
    props.onClick(props.itemId, props.itemTypeId);
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
 * @property {Number} itemTypeId
 * @property {Function} onClick
 */

/**
 * @component
 * @param {ResetItemButtonProps} props 
 */
function ResetItemButton(props) {

  const [loading, setLoading] = useState(false);

  const { resetItemTriggered } = useAuctionState();

  useEffect(() => {
    if (resetItemTriggered) {
      setLoading(false);
    }
  }, [resetItemTriggered]);

  const onClick = () => {
    setLoading(true);

    props.onClick(props.itemId, props.itemTypeId);
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