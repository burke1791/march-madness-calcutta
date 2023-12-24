import React, { useState, useEffect } from 'react';

import { Row, Col, Card, Table } from 'antd';

import { formatMoney } from '../../utilities/helper';
import { useAuthState } from '../../context/authContext';
import { useAuctionState } from '../../context/auctionContext';

const { Column } = Table;


// @TODO (Tracked by MMC-105) add some sort of animation on the table rows that update, e.g. highlight then fade
function MyTeams() {

  const [loading, setLoading] = useState(true);
  const [teamsArr, setTeamsArr] = useState([]);

  const { userId } = useAuthState();
  const { taxBuyIn, teams, teamsDownloadedDate, confirmedSoldTimestamp } = useAuctionState();

  useEffect(() => {
    if (teamsDownloadedDate) setLoading(false);

    if (teamsDownloadedDate && teams?.length) {
      const myTeams = teams.filter(t => t.owner == userId);

      if (taxBuyIn > 0) {
        const taxArray = [{
          displayName: 'Tax',
          price: taxBuyIn,
          itemId: -1
        }];
        setTeamsArr([...myTeams, ...taxArray]);
      } else {
        setTeamsArr([...myTeams]);
      }
    }
  }, [teamsDownloadedDate, taxBuyIn]);

  useEffect(() => {
    if (confirmedSoldTimestamp && confirmedSoldTimestamp > teamsDownloadedDate) {
      setLoading(true);
    }
  }, [confirmedSoldTimestamp, teamsDownloadedDate]);

  return (
    <Row style={{ height: 'calc(50vh - 70px)' }}>
      <Col span={24}>
        <Card style={{ height: '100%' }} bodyStyle={{ padding: '0', height: '100%' }} size='small'>
          <Table
            dataSource={teamsArr}
            rowKey='itemId'
            pagination={false}
            loading={loading}
            size='small'
            bordered={false}
            scroll={{ y: 'calc(50vh - 107px)' }}
            style={{ border: 'none' }}
          >
            <Column
              title='My Teams'
              dataIndex='displayName'
              key='itemId'
              align='left'
              width='70%'
              render={(text, record) => {
                if (record.itemId == -1) {
                  return <span style={{ fontWeight: 'bold', color: 'red' }}>{text}</span>;
                } else {
                  return text;
                }
              }}
            />
            <Column
              title='Paid'
              dataIndex='price'
              key='price'
              align='right'
              width='30%'
              render={(text, record) => {
                if (record.itemId == -1) {
                  return <span style={{ fontWeight: 'bold', color: 'red' }}>{formatMoney(text)}</span>;
                } else {
                  return formatMoney(text);
                }
              }}
            />
          </Table>
        </Card>
      </Col>
    </Row>
  );
}

export default MyTeams;