import React, { useState, useEffect } from 'react';

import { Row, Col, Card, Table } from 'antd';
import 'antd/dist/antd.css';

import { formatMoney } from '../../utilities/helper';
import useData from '../../hooks/useData';
import { API_CONFIG, AUCTION_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { parseAuctionTeams } from '../../parsers/auction';
import { useAuthState } from '../../context/authContext';
import { useLeagueState } from '../../context/leagueContext';
import { useAuctionState } from '../../context/auctionContext';

const { Column } = Table;

// @TODO (Tracked by MMC-105) add some sort of animation on the table rows that update, e.g. highlight then fade
function MyTeams() {

  const [loading, setLoading] = useState(true);
  const [teamsArr, setTeamsArr] = useState([]);

  const { authenticated, userId } = useAuthState();
  const { leagueId } = useLeagueState();
  const { connected, newItemTimestamp, taxBuyIn, refreshData } = useAuctionState();

  const [teams, teamsReturnDate, fetchTeams] = useData({
    baseUrl: API_CONFIG.AUCTION_SERVICE_BASE_URL,
    endpoint: `${AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_TEAMS}/${leagueId}?userId=${userId}`,
    method: 'GET',
    processData: parseAuctionTeams,
    conditions: [authenticated, leagueId, userId]
  });

  useEffect(() => {
    if (authenticated && leagueId && userId) {
      setLoading(true);
      fetchTeams();
    }
  }, [authenticated, leagueId, connected, userId, newItemTimestamp]);

  useEffect(() => {
    if (refreshData) {
      fetchTeams();
    }
  }, [refreshData]);

  useEffect(() => {
    if (teamsReturnDate) setLoading(false);

    if (teamsReturnDate && teams?.length) {
      if (taxBuyIn > 0) {
        const taxArray = [{
          displayName: 'Tax',
          price: taxBuyIn,
          itemId: -1
        }];
        setTeamsArr([...teams, ...taxArray]);
      } else {
        setTeamsArr([...teams]);
      }
    }
  }, [teamsReturnDate, taxBuyIn]);

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