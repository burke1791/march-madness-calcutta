import { Modal, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useLeagueState } from '../../context/leagueContext';
import { useAuctionState } from '../../context/auctionContext';
import { AUCTION_STATUS } from '../../utilities/constants';

const { Text } = Typography;

function AuctionCloseModal(props) {

  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { leagueId, roleId } = useLeagueState();
  const { numLotsRemaining, status } = useAuctionState();

  useEffect(() => {
    if (roleId <= 2 && numLotsRemaining === 0) {
      setIsOpen(true);
    }
  }, [roleId, numLotsRemaining]);

  useEffect(() => {
    if (status != undefined) setLoading(false);
    if (status == AUCTION_STATUS.END) setIsOpen(false);
  }, [status]);

  const closeAuction = () => {
    setLoading(true);
    props.sendSocketMessage('CLOSE_AUCTION', { leagueId });
  }

  const dismissModal = () => {
    setLoading(false);
    setIsOpen(false);
  }

  return (
    <Modal
      title='Close the Auction?'
      open={isOpen}
      okText='Close Auction'
      onOk={closeAuction}
      confirmLoading={loading}
      cancelText='Dismiss'
      onCancel={dismissModal}
    >
      <Text>All teams have been auctioned off. Please close the auction in order to show the results on the other league pages</Text>
    </Modal>
  );
}

export default AuctionCloseModal;