import { Modal } from 'antd';
import React from 'react';
import NewSeedGroup from '../forms/newSeedGroup';

/**
 * @typedef AuctionGroupModalProps
 * @property {Boolean} visible
 * @property {Function} dismiss
 */

/**
 * @component
 * @param {AuctionGroupModalProps} props 
 */
function AuctionGroupModal(props) {

  return (
    <Modal
      title='New Group'
      open={props.visible}
      onCancel={props.dismiss}
      style={{ maxWidth: 320, top: 50 }}
      footer={null}
    >
      <NewSeedGroup />
    </Modal>
  )
}

export default AuctionGroupModal;