import React, { useState, useEffect } from 'react';
import './auctionActions.css';

import AuctionAdmin from '../auctionAdmin/auctionAdmin';

import { Button, Card, Statistic, Row, Col, InputNumber, message } from 'antd';
import 'antd/dist/antd.css';

import { formatMoney } from '../../utilities/helper';
import AuctionService from '../../services/autction/auction.service';
import { AUCTION_STATUS, AUCTION_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import { useAuctionState } from '../../context/auctionContext';
import { auctionServiceHelper } from '../../services/autction/helper';
import Team from '../team/team';
import { useSettingsState } from '../../context/leagueSettingsContext';

const { Countdown } = Statistic;

// @TODO this component does wayyyyy too much - break it up please!
function AuctionActions(props) {
  
  const [teamName, setTeamName] = useState('');
  const [biddingDisabled, setBiddingDisabled] = useState(true);
  const [highBid, setHighBid] = useState(0);
  const [highBidder, setHighBidder] = useState('n/a');
  const [bidVal, setBidVal] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [offset, setOffset] = useState(0);
  const [undoDisable, setUndoDisable] = useState(true);
  const [undoLoading, setUndoLoading] = useState(false);

  const { roleId, leagueId } = useLeagueState();
  const { userId, authenticated } = useAuthState();
  const { status, displayName, currentItemId, itemTypeId, price, winnerId, winnerAlias, lastBid, prevUpdate, teamLogoUrl, connected } = useAuctionState();
  const { settingsList } = useSettingsState();

  useEffect(() => {
    updateBidButtonState();
    updateUndoButtonState();
  }, [prevUpdate, connected]);

  useEffect(() => {
    if (authenticated) {
      getServerOffset();
    }
  }, [authenticated]);

  useEffect(() => {
    setTeamName(displayName);
  }, [displayName]);

  useEffect(() => {
    if (price === 0) {
      resetBidVal();
    }

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

  const getServerOffset = () => {
    AuctionService.callApiWithPromise(AUCTION_SERVICE_ENDPOINTS.SERVER_TIMESTAMP, {}).then(response => {
      console.log(response);
      let clockOffset = auctionServiceHelper.updateServerPing(response.data[0].ServerTimestamp);
      updateOffset(clockOffset);
    });
  }

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

    // Admins can always undo bids
    // if (status === AUCTION_STATUS.BIDDING && roleId <= 2) {
    //   disabled = false;
    // }

    setUndoDisable(disabled);
  }

  const itemComplete = () => {
    if (roleId == 1 || roleId == 2) {
      // setItemComplete(leagueId);
      props.sendSocketMessage('ITEM_COMPLETE', { leagueId });
    }
  }

  const bidChange = (value) => {
    setBidVal(Math.floor(value));
  }

  const placeCustomBid = () => {
    placeBid(bidVal);
  }

  const placeMinimumBid = () => {
    placeBid(Number(highBid + 1));
  }

  const placeBid = (value) => {
    setBiddingDisabled(true);

    // placeAuctionBid(leagueId, value);
    props.sendSocketMessage('PLACE_BID', { leagueId: leagueId, amount: value, itemId: currentItemId, itemTypeId: itemTypeId });
  }

  // when settings are implemented client-side, reset it to the league's minimum bid
  const resetBidVal = () => {
    setBidVal(1);
  }

  const generateAdminButtons = () => {
    if (roleId == 1 || roleId == 2) {
      return (
        <AuctionAdmin sendSocketMessage={props.sendSocketMessage} />
      );
    } else {
      return null;
    }
  }

  const getMinimumBid = () => {
    let minBidObj = settingsList?.find(obj => obj.settingId == 3);

    let minBidValue = Number(minBidObj?.inputList[0]?.serverValue) || 1;

    return minBidValue;
  }

  const getInterval = () => {
    let intervalObj = settingsList?.find(obj => obj.settingId == 1);

    let interval = Number(intervalObj?.inputList[0]?.serverValue) || 15;

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
        {generateAdminButtons()}
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
              <Statistic title='Total Spent' value={formatMoney(props.totalSpent)} />
            </Card>
          </Col>
          <Col span={12} className='flex-growVert-parent'>
            <Card size='small' className='flex-growVert-child'>
              <Row type='flex' justify='space-around' gutter={8}>
                <InputNumber
                  min={getMinimumBid()}
                  formatter={value => `\$ ${value}`}
                  parser={value => value.replace(/\$\s?/g, '')}
                  onChange={bidChange}
                  precision={0}
                  step={getMinimumBid()}
                  value={bidVal}
                  style={{ width: '50%' }}
                />
                <Button type='primary' style={{ width: '30%' }} disabled={biddingDisabled} onClick={placeCustomBid}>Bid</Button>
              </Row>
              <Row type='flex' justify='center' style={{ textAlign: 'center', marginTop: '6px' }} gutter={8}>
                <Button type='primary' disabled={biddingDisabled} style={{ width: '90%' }} onClick={placeMinimumBid}>
                  ${highBid + 1 >= getMinimumBid() ? highBid + 1 : getMinimumBid()} (Min Legal Bid)
                </Button>
              </Row>
            </Card>
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