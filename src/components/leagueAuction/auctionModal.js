import React, { useState, useEffect } from 'react';
import { NOTIF } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';

import { Modal, Typography } from 'antd';
import 'antd/dist/antd.css';
import { useAuctionDispatch } from '../../context/auctionContext';

const { Text } = Typography;

function AuctionModal(props) {

  const [title, setTitle] = useState(props.title || null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const auctionDispatch = useAuctionDispatch();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.AUCTION_MODAL_SHOW, AuctionModal, showModal);
    Pubsub.subscribe(NOTIF.AUCTION_MODAL_DISMISS, AuctionModal, handleCancel);
  
    return (() => {
      Pubsub.unsubscribe(NOTIF.AUCTION_MODAL_SHOW, AuctionModal);
      Pubsub.unsubscribe(NOTIF.AUCTION_MODAL_DISMISS, AuctionModal);
    });
  }, []);

  const showModal = (config) => {
    if (config?.title) {
      setTitle(config.title);
    }

    setVisible(true);
  }

  const submit = () => {
    setLoading(true);

    auctionDispatch({ type: 'update', key: 'reconnectTrigger', value: new Date().valueOf() });
  }

  const handleCancel = () => {
    setLoading(false);
    setVisible(false);
  }

  return (
    <Modal
      title={title}
      open={visible}
      okText='Reconnect'
      onOk={submit}
      confirmLoading={loading}
      cancelText='Dismiss'
      onCancel={handleCancel}
      style={{ maxWidth: 320, top: 50 }}
    >
      <Text>Reconnect to the auction service?</Text>
    </Modal>
  )
}

export default AuctionModal;
