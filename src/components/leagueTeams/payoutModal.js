import React, { useEffect, useState } from 'react';
import { Button, Col, message, Modal, Row, Space, Typography } from 'antd';
import { formatMoney } from '../../utilities/helper';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import LeagueTeamPayoutTable from './leagueTeamPayoutTable';

const { Title } = Typography;

const payoutTemplate = {
  PayoutAmount: null,
  PayoutDescription: null,
  UpdatedByUsername: null,
  UpdatedByUserId: null,
  IsDeleted: false,
  editable: true
}

/**
 * @typedef TeamPayoutModalProps
 * @property {String} teamName
 * @property {Number} teamId
 * @property {String} ownerUsername
 * @property {Array} payouts
 * @property {Boolean} open
 * @property {Function} dismiss
 * @property {Function} refreshPayouts
 * @property {Number} refreshView
 */

/**
 * @component
 * @param {TeamPayoutModalProps} props 
 */
function TeamPayoutModal(props) {

  const [width, setWidth] = useState('75%');
  const [tableData, setTableData] = useState([]);
  const [updatedPayouts, setUpdatedPayouts] = useState([]);
  const [newPayoutNumber, setNewPayoutNumber] = useState(0);
  const [totalPayout, setTotalPayout] = useState(null);
  const [updateEvent, setUpdateEvent] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const { roleId, leagueId } = useLeagueState();
  const { authenticated, alias, userId } = useAuthState();

  const [payoutSet, payoutSetReturnDate, setPayouts] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.SET_LEAGUE_TEAM_PAYOUTS}/${leagueId}`,
    method: 'POST',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (props.open) {
      if (props.payouts.length > 0) {
        setTableData([...props.payouts]);
      }
      setUpdatedPayouts([]);
      setUpdateEvent(new Date().valueOf());
    }
  }, [props.open]);

  useEffect(() => {
    setUpdatedPayouts([]);
    setTableData([...props.payouts]);
    setUpdateEvent(new Date().valueOf());
  }, [props.refreshView]);

  useEffect(() => {
    if (updateEvent) {
      updateTotalPayouts();
    }
  }, [updateEvent]);

  useEffect(() => {
    if (window.innerWidth > 720) {
      setWidth('75%');
    } else {
      setWidth('100%');
    }
  }, [window.innerWidth]);

  useEffect(() => {
    if (payoutSetReturnDate) {
      props.refreshPayouts();
      if (payoutSet && payoutSet.length && payoutSet.Error) {
        message.error(payoutSet[0].Error);
      }
      setSaveLoading(false);
    }
  }, [payoutSetReturnDate]);

  const addPayout = () => {
    const newPayoutTemplate = structuredClone(payoutTemplate);
    newPayoutTemplate.LeagueTeamPayoutId = `newPayout_${newPayoutNumber}`;
    newPayoutTemplate.UpdatedByUsername = alias;

    setTableData([...tableData, newPayoutTemplate]);
    setNewPayoutNumber(newPayoutNumber + 1);
  }

  const updateTotalPayouts = () => {
    if (tableData.length > 0) {
      let totalPayout = 0;
      tableData.forEach(payout => {
        if (!payout.IsDeleted) {
          totalPayout += payout.PayoutAmount;
        }
      });
      setTotalPayout(totalPayout);
    } else {
      setTotalPayout(0);
    }
  }

  const savePayouts = () => {
    setSaveLoading(true);

    const payouts = [];

    for (let name of updatedPayouts) {
      const payout = tableData.find(p => p.LeagueTeamPayoutId == name);
      const id = payout.LeagueTeamPayoutId.includes('newPayout_') ? null : payout.LeagueTeamPayoutId;

      payouts.push({
        LeagueTeamPayoutId: id,
        TeamId: props.teamId,
        PayoutAmount: payout.PayoutAmount,
        PayoutDescription: payout.PayoutDescription,
        UpdatedByUserId: userId,
        IsDeleted: !!payout.IsDeleted
      });
    }

    setPayouts({ payouts: payouts });
  }

  const payoutChanged = (id, key, newValue) => {
    // add this payout to the updatedPayouts array (if not already there)
    if (updatedPayouts.indexOf(id) == -1) {
      setUpdatedPayouts([...updatedPayouts, id]);
    }

    // update tableData with the new value
    const payouts = [...tableData];

    const updatedPayout = payouts.find(p => p.LeagueTeamPayoutId == id);
    updatedPayout[key] = newValue;

    setTableData(payouts);
    setUpdateEvent(new Date().valueOf());
  }

  const generateAdminButtons = () => {
    if (roleId == 1 || roleId == 2) {
      return (
        <Row justify='center'>
          <Space>
            <Button
              type='primary'
              size='small'
              onClick={addPayout}
            >
              Add Payout
            </Button>
            <Button
              disabled={!updateEvent}
              type='primary'
              size='small'
              onClick={savePayouts}
              loading={saveLoading}
            >
              Save
            </Button>
          </Space>
        </Row>
      );
    }

    return null;
  }

  const dismiss = () => {
    setTableData([]);
    setSaveLoading(false);
    setUpdatedPayouts([]);
    setNewPayoutNumber(0);
    setUpdateEvent(null);
    props.dismiss();
  }

  return (
    <Modal
      title='Set Payouts'
      open={props.open}
      onCancel={dismiss}
      footer={null}
      width={width}
    >
      <Row justify='center'>
        <Title level={2}>{props.teamName}</Title>
      </Row>
      <Row justify='center'>
        <Title level={3}>Total Payout: {formatMoney(totalPayout)}</Title>
      </Row>
      {generateAdminButtons()}
      <Row justify='center'>
        <Col span={24}>
          <LeagueTeamPayoutTable
            teamId={props.teamId}
            payouts={tableData}
            payoutChanged={payoutChanged}
          />
        </Col>
      </Row>
    </Modal>
  );
}

export default TeamPayoutModal;