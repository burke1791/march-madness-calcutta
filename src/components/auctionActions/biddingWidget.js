import React, { useState, useEffect } from 'react';
import './auctionActions.css';
import { Button, Card, Row, InputNumber, message } from 'antd';
import { useAuctionState } from '../../context/auctionContext';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import AuctionRulesModal from './auctionRulesModal';

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
  const [bidStep, setBidStep] = useState(1);
  const [bidStatus, setBidStatus] = useState(null);

  const [rulesModalOpen, setRulesModalOpen] = useState(false);

  const { price, maxBuyin } = useAuctionState();
  const { leagueId } = useLeagueState();
  const { authenticated } = useAuthState();

  const [bidRules, bidRulesReturnDate, getBidRules] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: `${LEAGUE_SERVICE_ENDPOINTS.GET_AUCTION_BID_RULES}/${leagueId}`,
    method: 'GET',
    conditions: [authenticated, leagueId]
  });

  useEffect(() => {
    if (leagueId && authenticated) {
      getBidRules();
    }
  }, [leagueId, authenticated]);

  useEffect(() => {
    if (bidRulesReturnDate) {
      computeBidStep();
    }
  }, [bidRulesReturnDate]);

  useEffect(() => {
    if (price === 0) {
      setBidVal(0);
      computeBidStep();
    }
  }, [price]);

  const validatePotentialBid = (bid) => {
    if (maxBuyin === null) {
      return null;
    }

    if ((bid + props.totalSpent || 0) > maxBuyin) {
      return `Bid will exceed maximum buy-in of $${maxBuyin}`;
    }
  }

  const placeCustomBid = () => {
    placeBid(bidVal);
  }

  const bidChange = (value) => {
    const newVal = value == null ? null : Math.floor(value);

    if (bidRules && bidRules.length > 0) {
      const newMin = bidRules.find(br => br.MinThresholdExclusive < newVal && (br.MaxThresholdInclusive >= newVal || br.MaxThresholdInclusive == null))?.MinThresholdExclusive;
      const newIncrement = bidRules.find(br => br.MinThresholdExclusive < newVal && (br.MaxThresholdInclusive >= newVal || br.MaxThresholdInclusive == null))?.MinIncrement || 1;

      const validationRemainder = (newVal - newMin) % newIncrement;

      if (validationRemainder > 0) {
        setBidStatus('error');
      } else {
        setBidStatus(null);
      }
    }

    computeBidStep(newVal);
    setBidVal(newVal);
  }

  const placeBid = (value) => {
    const bidValidation = validatePotentialBid(value);

    if (bidValidation != null) {
      message.error(bidValidation);
    } else {
      props.placeBid(value);
    }
  }

  const computeBidStep = (val) => {
    let step = 1;

    if (bidRules && bidRules.length > 0) {
      step = bidRules.find(br => br.MinThresholdExclusive <= val && (br.MaxThresholdInclusive > val || br.MaxThresholdInclusive == null))?.MinIncrement || 1;
    }

    setBidStep(step);
  }

  const showRulesModal = () => {
    setRulesModalOpen(true);
  }

  const dismissRulesModal = () => {
    setRulesModalOpen(false);
  }

  return (
    <Card size='small' className='flex-growVert-child'>
      <Row type='flex' justify='space-around' gutter={8}>
        <InputNumber
          min={0}
          addonBefore='$'
          parser={value => value.replace(/\$\s?/g, '')}
          onChange={bidChange}
          onPressEnter={placeCustomBid}
          precision={0}
          step={bidStep}
          value={bidVal}
          status={bidStatus}
          size='small'
          style={{ width: '70%' }}
          type='tel'
        />
        <Button
          type='primary'
          size='small'
          style={{ width: '30%' }}
          disabled={props.biddingDisabled}
          onClick={placeCustomBid}
        >
          Bid
        </Button>
      </Row>
      <Row type='flex' justify='center' style={{ textAlign: 'center', marginTop: '6px' }} gutter={8}>
        <Button
          type='primary'
          size='small'
          style={{ width: '100%' }}
          onClick={showRulesModal}
        >
          Show Rules
        </Button>
      </Row>
      {/* <Row type='flex' justify='center' style={{ textAlign: 'center', marginTop: '6px' }} gutter={8}>
        <Button type='primary' disabled={props.biddingDisabled} style={{ width: '90%' }} onClick={placeMinimumBid}>
          ${props.highBid + 1 >= minBid ? props.highBid + 1 : minBid} (Min Legal Bid)
        </Button>
      </Row> */}
      <AuctionRulesModal open={rulesModalOpen} dismiss={dismissRulesModal} />
    </Card>
  );
}

export default BiddingWidget;