import React, { Fragment, useEffect, useState } from 'react';
import { Divider, Modal, Row } from 'antd';
import { useAuctionState } from '../../context/auctionContext';
import { AUCTION_STATUS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { OpenAuctionButton, CloseAuctionButton, NextItemButton, ResetClockButton } from './buttons';
import AuctionLotsTable from './auctionLotsTable';

const ADMIN_BUTTONS = {
  OPEN: 'OPEN',
  CLOSE: 'CLOSE',
  NEXT_ITEM: 'NEXT_ITEM',
  RESET_CLOCK: 'RESET_CLOCK'
};

/**
 * @typedef AuctionAdminPanelModalProps
 * @property {Boolean} open
 * @property {Function} dismiss
 * @property {Function} sendSocketMessage
 */

/**
 * @component
 * @param {AuctionAdminPanelModalProps} props 
 */
function AuctionAdminPanelModal(props) {

  const [width, setWidth] = useState('75%');

  useEffect(() => {
    if (window.innerWidth > 720) {
      if (window.innerWidth > 720) {
        setWidth('75%');
      } else {
        setWidth('100%');
      }
    }
  }, [window.innerWidth]);

  const dismiss = () => {
    props.dismiss();
  }

  return (
    <Modal
      open={props.open}
      title='Admin Panel'
      footer={null}
      width={width}
      onCancel={dismiss}
    >
      <AuctionAdminPanel sendSocketMessage={props.sendSocketMessage} dismiss={dismiss} />
    </Modal>
  )
}

export default AuctionAdminPanelModal;

/**
 * @typedef AuctionAdminPanelProps
 * @property {Function} sendSocketMessage
 * @property {Function} dismiss
 */

/**
 * @component
 * @param {AuctionAdminPanelProps} props 
 */
function AuctionAdminPanel(props) {

  const [adminButtonClicked, setAdminButtonClicked] = useState(null);

  const { status } = useAuctionState();

  useEffect(() => {
    if (adminButtonClicked && status === AUCTION_STATUS.BIDDING) {
      if (adminButtonClicked !== ADMIN_BUTTONS.RESET_CLOCK) {
        props.dismiss();
      }
    }
  }, [status]);

  const onAdminButtonClicked = (name) => {
    setAdminButtonClicked(name);
  }

  return (
    <Fragment>
      {/* Next Team and Reset Clock buttons
            Auto-close the admin panel when the Next Team button is clicked
            Keep it open when reset clock is clicked
      */}
      <AdminButtons
        sendSocketMessage={props.sendSocketMessage}
        onClick={onAdminButtonClicked}
      />
      {/* Table of all auction items - allow manual selection and reset team
            After a team is selected, automatically close the admin panel
      */}
      <Divider orientation='left'>Auction Lots</Divider>
      <AuctionLotsTable sendSocketMessage={props.sendSocketMessage} />
      {/* Table of all users - AuctionPermission interface (new DB tables)
            This will also require changes to the websocket handling for all users
      */}
      {/* Reset entire auction button */}
    </Fragment>
  );
}

/**
 * @typedef AdminButtonsProps
 * @property {Function} sendSocketMessage
 * @property {Function} onClick
 */

/**
 * @component
 * @param {AdminButtonsProps} props 
 */
function AdminButtons(props) {

  const { leagueId } = useLeagueState();
  const { status } = useAuctionState();

  const openAuction = () => {
    props.sendSocketMessage('START_AUCTION', { leagueId });
    props.onClick(ADMIN_BUTTONS.OPEN);
  }

  const closeAuction = () => {
    props.sendSocketMessage('CLOSE_AUCTION', { leagueId });
    props.onClick(ADMIN_BUTTONS.CLOSE);
  }

  const nextItem = () => {
    props.sendSocketMessage('NEXT_ITEM', { leagueId });
    props.onClick(ADMIN_BUTTONS.NEXT_ITEM);
  }

  const resetClock = () => {
    props.sendSocketMessage('RESET_CLOCK', { leagueId });
    props.onClick(ADMIN_BUTTONS.RESET_CLOCK);
  }

  return (
    <Row justify='space-around'>
      { status === AUCTION_STATUS.INITIAL ?
        <OpenAuctionButton onClick={openAuction} />
        :
        <CloseAuctionButton onClick={closeAuction} />
      }
      <NextItemButton onClick={nextItem} />
      <ResetClockButton onClick={resetClock} />
    </Row>
  );
}
