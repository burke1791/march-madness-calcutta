import React, { useState, useEffect } from 'react';
import './auctionActions.css';
import { Button, Card, Row, InputNumber, message } from 'antd';
import { useSettingsState } from '../../context/leagueSettingsContext';
import { useAuctionState } from '../../context/auctionContext';

/**
 * @typedef BiddingWidgetProps
 * @property {Boolean} biddingDisabled
 * @property {Function} placeBid
 * @property {Function} placeMinimumBid
 * @property {Number} highBid
 * @property {any} children - React children
 */

/**
 * @component BiddingWidget
 * @param {BiddingWidgetProps} props  
 */
function BiddingWidget(props) {

  const [bidVal, setBidVal] = useState(0);
  const [minBid, setMinBid] = useState(1);
  const [maxBuyin, setMaxBuyin] = useState(null);

  const { settingsList } = useSettingsState();
  const { price } = useAuctionState();

  useEffect(() => {
    if (settingsList?.length) {
      const minBidObj = settingsList?.find(obj => obj.settingId == 3);
      const minBidValue = Number(minBidObj?.inputList[0]?.serverValue) || 1;
      setMinBid(minBidValue);

      const maxBuyinObj = settingsList?.find(obj => obj.settingId == 2);
      const maxBuyinValue = Number(maxBuyinObj?.inputList[0]?.serverValue) || null;
      setMaxBuyin(maxBuyinValue);
    }
  }, [JSON.stringify(settingsList)]);

  useEffect(() => {
    if (price === 0) {
      setBidVal(minBid);
    }
  }, [price]);

  const validatePotentialBid = (bid) => {
    if (maxBuyin == null) {
      return null;
    }

    if ((bid + props.totalSpent || 0) > maxBuyin) {
      return 'Bid will exceed maximum buy-in';
    }
  }

  const placeCustomBid = () => {
    placeBid(bidVal);
  }

  const bidChange = (value) => {
    setBidVal(Math.floor(value));
  }

  const placeBid = (value) => {
    const bidValidation = validatePotentialBid(value);

    if (bidValidation != null) {
      message.error(bidValidation);
    } else {
      props.placeBid(value);
    }
  }

  const placeMinimumBid = () => {
    placeBid(Number(props.highBid + 1));
  }

  return (
    <Card size='small' className='flex-growVert-child'>
      <Row type='flex' justify='space-around' gutter={8}>
        <InputNumber
          min={minBid}
          formatter={value => `\$ ${value}`}
          parser={value => value.replace(/\$\s?/g, '')}
          onChange={bidChange}
          precision={0}
          step={minBid}
          value={bidVal}
          style={{ width: '50%' }}
        />
        <Button type='primary' style={{ width: '30%' }} disabled={props.biddingDisabled} onClick={placeCustomBid}>Bid</Button>
      </Row>
      <Row type='flex' justify='center' style={{ textAlign: 'center', marginTop: '6px' }} gutter={8}>
        <Button type='primary' disabled={props.biddingDisabled} style={{ width: '90%' }} onClick={placeMinimumBid}>
          ${props.highBid + 1 >= minBid ? props.highBid + 1 : minBid} (Min Legal Bid)
        </Button>
      </Row>
    </Card>
  );
}

export default BiddingWidget;