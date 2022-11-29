import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Modal, Row, Space, Table, Typography } from 'antd';
import { formatMoney } from '../../utilities/helper';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import InputNumberCell from '../tableCells/inputNumberCell';

const { Column } = Table;
const { Text, Title } = Typography;

const payoutTemplate = {
  PayoutAmount: null,
  PayoutDescription: null,
  UpdatedByUsername: null,
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

  const [tableData, setTableData] = useState([]);
  const [newPayoutNumber, setNewPayoutNumber] = useState(0);
  const [totalPayout, setTotalPayout] = useState(null);
  const [updateEvent, setUpdateEvent] = useState(null);

  const { roleId } = useLeagueState();
  const { authenticated, alias, userId } = useAuthState();

  useEffect(() => {
    setTableData(props.payouts);
    payoutsRef.current = props.payouts;
    updateTotalPayouts();
  }, [JSON.stringify(props.payouts)]);

  useEffect(() => {
    if (updateEvent) {
      updateTotalPayouts();
    }
  }, [updateEvent]);

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
    console.log(name);
    console.log(value);
    setUpdateEvent(new Date().valueOf());
  }

  const dismiss = () => {
    setTableData([]);
    payoutsRef.current = [];
    setNewPayoutNumber(0);
    props.dismiss();
  }

  const savePayouts = () => {
    // do nothing for now
  }

  return (
    <Modal
      title='Set Payouts'
      open={props.open}
      onCancel={dismiss}
      footer={null}
      width={720}
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
                    // create a new component called TableInputNumberCell
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
            />
          </Table>
        </Col>
      </Row>
    </Modal>
  );
}

export default TeamPayoutModal;