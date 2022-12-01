import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Input, Modal, Row, Space, Table, Typography } from 'antd';
import { formatMoney } from '../../utilities/helper';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import { InputNumberCell, InputCell } from '../tableCells';

const { Column } = Table;
const { Text, Title } = Typography;

const payoutTemplate = {
  PayoutAmount: null,
  PayoutDescription: null,
  UpdatedByUsername: null,
  UpdatedByUserId: null,
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
 */

/**
 * @component
 * @param {TeamPayoutModalProps} props 
 */
function TeamPayoutModal(props) {

  const payoutsRef = useRef([]);

  const [width, setWidth] = useState('75%');
  const [tableData, setTableData] = useState([]);
  const [newPayoutNumber, setNewPayoutNumber] = useState(0);
  const [totalPayout, setTotalPayout] = useState(null);
  const [updateEvent, setUpdateEvent] = useState(null);

  const { roleId } = useLeagueState();
  const { authenticated, alias, userId } = useAuthState();

  useEffect(() => {
    if (props.open) {
      setTableData(props.payouts);
      payoutsRef.current = props.payouts;
      updateTotalPayouts();
    }
  }, [JSON.stringify(props.payouts), props.open]);

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

  const addPayout = () => {
    const newPayoutTemplate = structuredClone(payoutTemplate);
    newPayoutTemplate.LeagueTeamPayoutId = `newPayout_${newPayoutNumber}`;
    newPayoutTemplate.UpdatedByUsername = alias;

    payoutsRef.current = [...payoutsRef.current, newPayoutTemplate];
    setTableData([...payoutsRef.current, newPayoutTemplate]);
    setNewPayoutNumber(newPayoutNumber + 1);
  }

  const updateTotalPayouts = () => {
    console.log(payoutsRef.current);
    if (payoutsRef.current.length > 0) {
      let totalPayout = 0;
      payoutsRef.current.forEach(payout => {
        totalPayout += payout.PayoutAmount;
      });
      setTotalPayout(totalPayout);
    } else {
      setTotalPayout(0);
    }
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
            >
              Save
            </Button>
          </Space>
        </Row>
      );
    }

    return null;
  }

  const payoutChanged = (name, value) => {
    const payout = payoutsRef.current.find(p => p.LeagueTeamPayoutId === name);
    payout.PayoutAmount = value;
    setUpdateEvent(new Date().valueOf());
  }

  const payoutDescriptionChanged = (name, value) => {
    const payout = payoutsRef.current.find(p => p.LeagueTeamPayoutId === name);
    payout.PayoutDescription = value;
    setUpdateEvent(new Date().valueOf());
  }

  const dismiss = () => {
    setTableData([]);
    payoutsRef.current = [];
    setNewPayoutNumber(0);
    props.dismiss();
  }

  const savePayouts = () => {
    console.log(payoutsRef.current);
    const payload = payoutsRef.current.map(p => {
      
    })
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
          <Table
            dataSource={payoutsRef.current}
            pagination={false}
            size='small'
            rowKey='LeagueTeamPayoutId'
          >
            <Column
              title='Paid By'
              dataIndex='UpdatedByUsername'
            />
            <Column
              title='Amount'
              dataIndex='PayoutAmount'
              render={(value, record) => {
                if (record.editable) {
                  return (
                    <InputNumberCell
                      name={record.LeagueTeamPayoutId}
                      value={record.PayoutAmount}
                      precision={2}
                      addonBefore='$'
                      onChange={payoutChanged}
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
                if (record.editable) {
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
          </Table>
        </Col>
      </Row>
    </Modal>
  );
}

export default TeamPayoutModal;