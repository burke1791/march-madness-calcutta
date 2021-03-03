import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import 'antd/dist/antd.css';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';
import NewSeedGroup from '../forms/newSeedGroup';

function SeedGroupModal() {

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.SEED_GROUP_MODAL_SHOW, SeedGroupModal, showModal);
    Pubsub.subscribe(NOTIF.SEED_GROUP_MODAL_DISMISS, SeedGroupModal, handleCancel);

    return (() => {
      Pubsub.unsubscribe(NOTIF.SEED_GROUP_MODAL_SHOW, SeedGroupModal);
      Pubsub.unsubscribe(NOTIF.SEED_GROUP_MODAL_DISMISS, SeedGroupModal);
    });
  }, []);

  const showModal = () => {
    setVisible(true);
  }

  const handleCancel = () => {
    setVisible(false);
  }

  return (
    <Modal
      title='New Seed Group'
      visible={visible}
      onCancel={handleCancel}
      style={{ maxWidth: 320, top: 50 }}
      footer={null}
    >
      <NewSeedGroup />
    </Modal>
  );
}

export default SeedGroupModal;