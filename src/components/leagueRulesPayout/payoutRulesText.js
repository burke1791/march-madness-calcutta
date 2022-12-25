import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Input, message, Row, Skeleton } from 'antd';
import { useLeagueState } from '../../context/leagueContext';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';

function PayoutRulesText(props) {

  const [value, setValue] = useState(null);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const { leagueId, roleId } = useLeagueState();
  const { authenticated } = useAuthState();

  const [payoutInfo, payoutInfoReturnDate, getPayoutInfo] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_MANUAL_PAYOUT_INFO}/${leagueId}`,
    method: 'GET',
    conditions: [leagueId, authenticated]
  });

  const [payoutInfoSet, setPayoutInfoReturnDate, setPayoutInfo] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.SET_MANUAL_PAYOUT_INFO}/${leagueId}`,
    method: 'POST',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (authenticated && leagueId) {
      getPayoutInfo();
    }
  }, [authenticated, leagueId]);

  useEffect(() => {
    // User must be a league admin to update payout data
    if (roleId === 1 || roleId === 2) {
      setEditable(true);
    }
  }, [roleId]);

  useEffect(() => {
    if (payoutInfoReturnDate) {
      const payoutText = payoutInfo.length == 0 ? '' : payoutInfo[0].PayoutInfo;
      setValue(payoutText);
      setLoading(false);
      setIsChanged(false);
    }
  }, [payoutInfoReturnDate]);

  useEffect(() => {
    if (setPayoutInfoReturnDate) {
      if (payoutInfoSet?.length > 0 && payoutInfoSet[0]?.Error) {
        message.error(payoutInfoSet[0].Error);
      } else {
        setLoading(true);
        getPayoutInfo();
      }
      setButtonLoading(false);
    }
  }, [setPayoutInfoReturnDate]);

  const onChange = (event) => {
    if (editable) {
      setValue(event.target.value);
      setIsChanged(true);
    } else {
      message.warning('You cannot edit payout info');
    }
  }

  const updatePayoutInfo = () => {
    const payload = {
      payoutInfo: value
    };

    setButtonLoading(true);
    setPayoutInfo(payload);
  }

  return (
    <Fragment>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} xs={24}>
          {
            loading ?
              <Skeleton active />
            :
              <Input.TextArea
                value={value}
                onChange={onChange}
                placeholder='Payout structure'
                autoSize={{ minRows: 8, maxRows: 16 }}
              />
          }
        </Col>
      </Row>
      { roleId == 1 || roleId == 2 ?
        <Row justify='center'>
          <Button
            disabled={!isChanged}
            type='primary'
            loading={buttonLoading}
            onClick={updatePayoutInfo}
            style={{ marginTop: 8 }}
          >
            Save Payout Info
          </Button>
        </Row>
        :
        null
      }
    </Fragment>
  )
}

export default PayoutRulesText;