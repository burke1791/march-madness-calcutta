import React, { Fragment, useState } from 'react';
import { Button, Col, Divider, Row } from 'antd';
import AuctionGroupTable from './auctionGroupTable';
import AuctionGroupModal from './auctionGroupModal';

function AuctionGroup() {

  const [modalVisible, setModalVisible] = useState(false);

  const showGroupModal = () => {
    setModalVisible(true);
  }

  const hideGroupModal = () => {
    setModalVisible(false);
  }

  return (
    <Fragment>
      <Row justify='center'>
        <Col xxl={12} xl={14} lg={16} md={18} sm={20} xs={22}>
          <Divider orientation='left'>Auction Groups</Divider>
        </Col>
      </Row>
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

export default AuctionGroup;