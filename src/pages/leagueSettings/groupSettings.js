import React, { Fragment, useState } from 'react';
import { Button, Col, Row } from 'antd';
import AuctionGroupTable from '../../components/auctionRulesGroup/auctionGroupTable';
import AuctionGroupModal from '../../components/auctionRulesGroup/auctionGroupModal';
import SettingsDivider from '../../components/settingsDivider/settingsDivider';
import { useLeagueState } from '../../context/leagueContext';

function GroupSettings() {

  const [modalVisible, setModalVisible] = useState(false);
  const [modalIsEditMode, setModalIsEditMode] = useState(false);
  const [modalGroup, setModalGroup] = useState(null);

  const { roleId } = useLeagueState();

  const showGroupModal = (data) => {
    if (data) {
      setModalGroup(data);
      setModalIsEditMode(true);
    }

    setModalVisible(true);
  }

  const hideGroupModal = () => {
    setModalVisible(false);
    setModalGroup(null);
    setModalIsEditMode(false);
  }

  return (
    <Fragment>
      <SettingsDivider justify='center' dividerOrientation='left'>Auction Groups</SettingsDivider>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={24}>
          <AuctionGroupTable showModal={showGroupModal} />
        </Col>
      </Row>
      { roleId == 1 || roleId == 2 ? (
        <Fragment>
          <Row justify='center'>
            <Button
              type='primary'
              onClick={() => { showGroupModal() }}
              style={{ marginTop: 8 }}
            >
              New Group
            </Button>
          </Row>
          <AuctionGroupModal
            visible={modalVisible}
            dismiss={hideGroupModal}
            isEditMode={modalIsEditMode}
            group={modalGroup}
          />
        </Fragment>
      ) : null
      }
    </Fragment>
  );
}

export default GroupSettings;