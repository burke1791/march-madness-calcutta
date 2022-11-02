import React, { Fragment, useState } from 'react';
import { Button, Col, Row } from 'antd';
import AuctionGroupTable from '../../components/auctionRulesGroup/auctionGroupTable';
import AuctionGroupModal from '../../components/auctionRulesGroup/auctionGroupModal';
import SettingsDivider from '../../components/settingsDivider/settingsDivider';

function GroupSettings() {

  const [modalVisible, setModalVisible] = useState(false);

  const showGroupModal = () => {
    setModalVisible(true);
  }

  const hideGroupModal = () => {
    setModalVisible(false);
  }

  return (
    <Fragment>
      <SettingsDivider justify='center' dividerOrientation='left'>Auction Groups</SettingsDivider>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <AuctionGroupTable />
        </Col>
      </Row>
      <Row justify='center'>
        <Button
          type='primary'
          onClick={showGroupModal}
          style={{ marginTop: 8 }}
        >
          New Group
        </Button>
      </Row>
      <AuctionGroupModal visible={modalVisible} dismiss={hideGroupModal} />
    </Fragment>
  );
}

export default GroupSettings;