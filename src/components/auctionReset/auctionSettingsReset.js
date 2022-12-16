import React, { useEffect, useState } from 'react';
import { Button, Col, message, Popconfirm, Row, Typography } from 'antd';
import useData from '../../hooks/useData';
import { API_CONFIG, AUCTION_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';

const { Title } = Typography;

function AuctionSettingsReset(props) {

  const [loading, setLoading] = useState(false);

  const { leagueId } = useLeagueState();
  const { authenticated } = useAuthState();

  const [resetAuctionResponse, resetAuctionReturnDate, resetAuction] = useData({
    baseUrl: API_CONFIG.AUCTION_SERVICE_BASE_URL,
    endpoint: `${AUCTION_SERVICE_ENDPOINTS.RESET_AUCTION}/${leagueId}`,
    method: 'POST',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (resetAuctionReturnDate && resetAuctionResponse) {
      console.log(resetAuctionResponse);

      if (resetAuctionResponse?.error) {
        message.error(resetAuctionResponse.error);
      } else if (resetAuctionResponse?.message) {
        message.success(resetAuctionResponse.message);
      }

      setLoading(false);
    }
  }, [resetAuctionReturnDate, resetAuctionResponse]);

  const sendResetAuctionRequest = () => {
    setLoading(true);
    resetAuction();
  }

  return (
    <Row justify='center' style={{ marginTop: 8 }}>
      <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
        <Row justify='space-between'>
          <Col>
            <Title level={4}>Reset Auction</Title>
          </Col>
          <Col>
            <Popconfirm
              title='Are you sure? This cannot be undone.'
              onConfirm={sendResetAuctionRequest}
              okText='Reset'
              okButtonProps={{ danger: true }}
            >
              <Button
                type='primary'
                danger
                loading={loading}
              >
                Reset
              </Button>
            </Popconfirm>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default AuctionSettingsReset;