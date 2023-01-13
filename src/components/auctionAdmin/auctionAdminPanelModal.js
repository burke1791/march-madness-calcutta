import React, { Fragment } from 'react';
import { Modal } from 'antd';

/**
 * @typedef AuctionAdminPanelModalProps
 * @property {Boolean} open
 */

/**
 * @component
 * @param {AuctionAdminPanelModalProps} props 
 */
function AuctionAdminPanelModal(props) {

  return (
    <Modal
      open={props.open}
      footer={null}
    >

    </Modal>
  )
}

export default AuctionAdminPanelModal;

function AuctionAdminPanel(props) {

  return (
    <Fragment>
      {/* Next Team and Reset Clock buttons
            Auto-close the admin panel when the Next Team button is clicked
            Keep it open when reset clock is clicked
      */}
      {/* Table of all auction items - allow manual selection and reset team
            After a team is selected, automatically close the admin panel
      */}
      {/* Table of all users - AuctionPermission interface (new DB tables)
            This will also require changes to the websocket handling for all users
      */}
      {/* Reset entire auction button */}
    </Fragment>
  );
}