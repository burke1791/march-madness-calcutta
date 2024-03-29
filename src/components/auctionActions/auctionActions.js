import React, { useState, useEffect } from 'react';
import './auctionActions.css';

import AuctionAdmin from '../auctionAdmin/auctionAdmin';

import { Button, Card, Statistic, Row, Col, message } from 'antd';


import { formatMoney } from '../../utilities/helper';
import { AUCTION_STATUS, AUCTION_SERVICE_ENDPOINTS, API_CONFIG } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import { useAuctionState } from '../../context/auctionContext';
import Team from '../team/team';
import BiddingWidget from './biddingWidget';
import useData from '../../hooks/useData';
import { parseServerOffset } from '../../parsers/auction';

const { Countdown } = Statistic;

function AuctionActions(props) {
  
  const [teamName, setTeamName] = useState('');
  const [biddingDisabled, setBiddingDisabled] = useState(true);
  const [highBid, setHighBid] = useState(0);
  const [highBidder, setHighBidder] = useState('n/a');
  const [endTime, setEndTime] = useState(0);
  const [offset, setOffset] = useState(0);
  const [undoDisable, setUndoDisable] = useState(true);
  const [undoLoading, setUndoLoading] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  
  const { roleId, leagueId } = useLeagueState();
  const { userId, authenticated } = useAuthState();
  const { auctionSettings, status, displayName, currentItemId, itemTypeId, price, winnerId, winnerAlias, lastBid, prevUpdate, teamLogoUrl, connected, auctionClosed, naturalBuyIn, taxBuyIn } = useAuctionState();

  const [serverOffset, offsetReturnDate, fetchServerOffset] = useData({
    baseUrl: API_CONFIG.AUCTION_SERVICE_BASE_URL,
    endpoint: `${AUCTION_SERVICE_ENDPOINTS.SERVER_TIMESTAMP}`,
    method: 'GET',
    processData: parseServerOffset,
    conditions: [authenticated]
  });

  useEffect(() => {
    updateOffset(serverOffset);
  }, [serverOffset, offsetReturnDate]);

  useEffect(() => {
    updateBidButtonState();
    updateUndoButtonState();
  }, [prevUpdate, connected]);

  useEffect(() => {
    if (authenticated) {
      fetchServerOffset();
    }
  }, [authenticated]);

  useEffect(() => {
    setTeamName(displayName);
  }, [displayName]);

  useEffect(() => {
    setHighBid(price);
  }, [price]);

  useEffect(() => {
    if (winnerAlias == null) {
      setHighBidder('n/a');
    } else {
      setHighBidder(winnerAlias);
    }
  }, [winnerAlias]);

  useEffect(() => {
    if (lastBid) {
      updateClock();
    }

    if (lastBid && status === AUCTION_STATUS.BIDDING) {
      setBiddingDisabled(false);
    }
  }, [lastBid]);

  useEffect(() => {
    setTotalSpent((naturalBuyIn || 0) + (taxBuyIn || 0));
  }, [naturalBuyIn, taxBuyIn]);

  const updateOffset = (clockOffset) => {
    setOffset(clockOffset);
  }

  const updateClock = () => {
    let lastBidValueOf = lastBid.valueOf();

    let itemEnd = new Date(lastBidValueOf + getInterval() - offset);

    setEndTime(itemEnd);
  }

  const updateBidButtonState = () => {
    if (status === AUCTION_STATUS.BIDDING && connected) {
      setBiddingDisabled(false);
    } else {
      setBiddingDisabled(true);
    }
  }

  const updateUndoButtonState = () => {
    setUndoLoading(false);
    let disabled = true;

    // bidding must be open and the user must have the current high bid
    if (status === AUCTION_STATUS.BIDDING && winnerId == userId) {
      disabled = false;
    }

    setUndoDisable(disabled);
  }

  const itemComplete = () => {
    if (roleId == 1 || roleId == 2) {
      props.sendSocketMessage('ITEM_COMPLETE', { leagueId });
    }
  }

  const placeBid = (value) => {
    setBiddingDisabled(true);

    props.sendSocketMessage('PLACE_BID', { leagueId: leagueId, amount: value, itemId: currentItemId, itemTypeId: itemTypeId });
  }

  const getInterval = () => {
    const interval = Number(auctionSettings.find(s => s.code == 'AUCTION_INTERVAL')?.settingValue);
    // const interval = auctionInterval || 15;

    return interval * 1000;
  }

  const undoBid = () => {
    if (highBid > 0) {
      setUndoLoading(true);
      props.sendSocketMessage('UNDO_BID', { leagueId: leagueId, itemId: currentItemId, itemTypeId: itemTypeId });
    } else {
      message.error('Cannot undo bid');
    }
  }
  
  return (
    <Row>
      <Card size='small' style={{ width: '100%' }}>
        <Team name={teamName} imageSrc={teamLogoUrl} imgStyle={{ maxHeight: 48, maxWidth: 48 }} />
        {roleId == 1 || roleId == 2 ?
          <AuctionAdmin sendSocketMessage={props.sendSocketMessage} />
          :
          null
        }
        <Row type='flex' justify='space-between' gutter={8} style={{ marginTop: '6px' }}>
          <Col span={12} className='flex-growVert-parent'>
            <Card size='small' bodyStyle={{ textAlign: 'center' }} className='flex-growVert-child'>
              <Statistic title='High Bid' value={formatMoney(highBid)} />
              <Statistic title='By' value={highBidder} />
            </Card>
          </Col>
          <Col span={12} className='flex-growVert-parent'>
            <Card size='small' bodyStyle={{ textAlign: 'center' }} className='flex-growVert-child'>
              <Countdown title='Time Remaining' value={endTime} onFinish={itemComplete} format={'mm:ss'} />
              <UndoBidButton disable={undoDisable} loading={undoLoading} undoBid={undoBid} style={{ marginTop: 8 }}>Undo Bid</UndoBidButton>
            </Card>
          </Col>
        </Row>
        <Row type='flex' justify='space-between' gutter={8} style={{ marginTop: '6px' }}>
          <Col span={12} className='flex-growVert-parent'>
            <Card size='small' bodyStyle={{ textAlign: 'center' }} className='flex-growVert-child'>
              <Statistic title='Total Spent' value={formatMoney(totalSpent)} />
            </Card>
          </Col>
          <Col span={12} className='flex-growVert-parent'>
            <BiddingWidget
              biddingDisabled={biddingDisabled}
              placeBid={placeBid}
              highBid={highBid}
              totalSpent={totalSpent}
            />
          </Col>
        </Row>
      </Card>
    </Row>
  );
}

function UndoBidButton(props) {

  return (
    <Button
      type='default'
      danger
      disabled={props.disable}
      loading={props.loading}
      onClick={props.undoBid}
      style={props.style}
    >
      {props.children}
    </Button>
  );
}

export default AuctionActions;