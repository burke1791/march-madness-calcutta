import React, { useEffect, useState, Fragment } from 'react';
import { Col, Popover, Row, Table, Typography } from 'antd';
import './worldCupGroup.css';
import 'antd/dist/antd.css';
import { useTournamentState } from '../../../context/tournamentContext';
import Team from '../../../components/team/team';
import { formatMoney } from '../../../utilities/helper';

const { Column } = Table;
const { Text } = Typography;

/**
 * @typedef WorldCupTableProps
 * @property {String} groupName
 * @property {Array<import('../../../services/tournament/helper.js').WorldCupTableTeam>} teams
 * @property {Number} teamsParsed
 */

/**
 * @component
 * @param {WorldCupTableProps} props 
 */
function WorldCupTable(props) {

  const [loading, setLoading] = useState(true);

  const { worldCupSelectedUser } = useTournamentState();

  useEffect(() => {
    if (props.teamsParsed) {
      setLoading(false);
    }
  }, [props.teamsParsed]);

  const getRowClass = (record) => {
    if (worldCupSelectedUser) {
      if (worldCupSelectedUser == record.TeamOwnerUserId) return 'highlight';
      return null;
    }
    if (record.Position <= 2) return 'pos-advanced';
    if (record.IsEliminated) return 'eliminated';
    return null;
  }

  return (
    <Row justify='center' style={{ margin: props.margin || '6px 0' }}>
      <Col xs={24} lg={18} xl={16} xxl={12}>
        <Table
          dataSource={props.teams}
          bordered
          rowKey='TeamId'
          rowClassName={getRowClass}
          size='small'
          pagination={false}
          loading={loading}
        >
          <Column
            title={props.groupName}
            dataIndex='TeamName'
            render={(text, record) => {
              return (
                <Popover
                  placement='right'
                  trigger='hover'
                  title={
                    <Team
                      imageSrc={record.LogoUrl}
                      style={{ fontSize: 18 }}
                      imgStyle={{ maxWidth: 25 }}
                      name={`${record.Position} ${record.TeamName}`}
                    />
                  }
                  content={
                    <TableTeamPopover
                      name={record.TeamName}
                      ownerUsername={record.TeamOwnerName}
                      price={record.Price}
                      payout={record.Payout}
                      isEliminated={record.IsEliminated}
                    />
                  }
                >
                  {/* 
                    The span tag here is required because the mouseenter event
                    does not bubble up to the Popover component without it. I am
                    not sure why and I do not want to take the time to figure it out
                  */}
                  <span>
                    <Team
                      imageSrc={record.LogoUrl}
                      style={{ fontSize: 14, textAlign: 'left' }}
                      imgStyle={{ maxWidth: 20 }}
                      name={`${record.Position} ${record.TeamName}`}
                    />
                  </span>
                </Popover>
              );
            }}
          />
          <Column
            title='W'
            dataIndex='Wins'
          />
          <Column
            title='D'
            dataIndex='Draws'
          />
          <Column
            title='L'
            dataIndex='Losses'
          />
          <Column
            title='GF'
            dataIndex='GoalsFor'
          />
          <Column
            title='GA'
            dataIndex='GoalsAgainst'
          />
          <Column
            title='GD'
            dataIndex='GoalDifferential'
          />
          <Column
            title='P'
            dataIndex='Points'
          />
        </Table>
      </Col>
    </Row>
  )
}

/**
 * @typedef TableTeamPopoverProps
 * @property {String} name
 * @property {String} ownerUsername
 * @property {Number} price
 * @property {Number} payout
 * @property {Boolean} isEliminated
 */

/**
 * @component
 * @param {TableTeamPopoverProps} props 
 */
function TableTeamPopover(props) {

  const getEliminatedText = () => {
    if (props.name == null) {
      return null;
    } else if (props.isEliminated) {
      return 'Eliminated';
    } else {
      return 'Alive';
    }
  }

  const getEliminatedType = () => {
    if (props.name == null) {
      return null;
    } else if (props.isEliminated) {
      return 'danger';
    } else {
      return 'success';
    }
  }

  return (
    <Fragment>
      <Row>
        <Text>Owner: {props.ownerUsername}</Text>
      </Row>
      <Row>
        <Text>Price: {formatMoney(props.price)}</Text>
      </Row>
      <Row>
        <div>
          <Text>Payout: </Text>
          <Text type={props.payout >= props.price ? 'success' : 'danger'}>{formatMoney(props.payout)}</Text>
        </div>
      </Row>
      <Row>
        <div>
          <Text>Status: </Text>
          <Text type={getEliminatedType()}>{getEliminatedText()}</Text>
        </div>
      </Row>
    </Fragment>
  );
}

export default WorldCupTable;