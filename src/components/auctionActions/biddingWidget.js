import React, { useState, useEffect } from 'react';
import './auctionActions.css';
import { Button, Card, Row, InputNumber, message, Checkbox } from 'antd';
import { useAuctionState } from '../../context/auctionContext';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import AuctionRulesModal from './auctionRulesModal';

const AUTOFILL_MIN_BID_LOCALSTORAGE_KEY = 'autoFillMinBidCheckbox';

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
  // const [bidStep, setBidStep] = useState(1);
  const [bidStatus, setBidStatus] = useState(null);
  const [autoFillMinBid, setAutoFillMinBid] = useState(false);

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
    const autoFill = JSON.parse(localStorage.getItem(AUTOFILL_MIN_BID_LOCALSTORAGE_KEY));
    setAutoFillMinBid(autoFill);
  }, []);

  useEffect(() => {
    if (autoFillMinBid) {
      updateStepAndMinBid(price);
    }
  }, [autoFillMinBid]);

  useEffect(() => {
    if (leagueId && authenticated) {
      getBidRules();
    }
  }, [leagueId, authenticated]);

  useEffect(() => {
    updateStepAndMinBid(price);
  }, [price, bidRulesReturnDate]);

  useEffect(() => {
    if (bidRules && bidRules.length > 0) {
      const rule = bidRules.find(br => {
        return (
          (
            br.MinThresholdExclusive <= bidVal ||
            (br.MinThresholdExclusive == 0 && bidVal == 0)
          ) && 
          (
            br.MaxThresholdInclusive > bidVal ||
            br.MaxThresholdInclusive == null
          )
        );
      });
      const newMin = rule?.MinThresholdExclusive;
      const newIncrement = rule?.MinIncrement || 1;

      const validationRemainder = (bidVal - newMin) % newIncrement;

      if (validationRemainder > 0 || bidVal <= price) {
        setBidStatus('error');
      } else {
        setBidStatus(null);
      }
    } else {
      setBidStatus(null);
    }
  }, [bidVal, price]);

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

    // updateBidStep(newVal);
    setBidVal(newVal);
  }

  const onStep = (value, info) => {
    let prevVal;
    let newVal = value;
    let step = 1;

    if (info.type === 'up') prevVal = value - info.offset;
    if (info.type === 'down') prevVal = value + info.offset;

    if (bidRules && bidRules.length) {
      const currentRule = bidRules.find(br => {
        return (
          (
            br.MinThresholdExclusive < prevVal ||
            (br.MinThresholdExclusive == 0 && prevVal <= 0)
          ) && 
          (
            br.MaxThresholdInclusive >= prevVal ||
            br.MaxThresholdInclusive == null
          )
        );
      });
      step = currentRule?.MinIncrement || step;

      let nextRule;

      if (info.type === 'up') {
        newVal = prevVal + step;

        nextRule = bidRules.find(br => {
          return (
            (
              br.MinThresholdExclusive < newVal ||
              (br.MinThresholdExclusive == 0 && newVal <= 0)
            ) && 
            (
              br.MaxThresholdInclusive >= newVal ||
              br.MaxThresholdInclusive == null
            )
          )
        });
      } else {
        newVal = prevVal - step;

        nextRule = bidRules.find(br => {
          return (
            (
              br.MinThresholdExclusive <= newVal ||
              (br.MinThresholdExclusive == 0 && newVal <= 0)
            ) && 
            (
              br.MaxThresholdInclusive > newVal ||
              br.MaxThresholdInclusive == null
            )
          )
        });
      }

      // next we need to validate that newVal is legal within nextRule and correct it if not
      let remainder;

      if (info.type === 'up') {
        if (currentRule && nextRule && currentRule.AuctionBidRuleId !== nextRule.AuctionBidRuleId) {
          // if the next rule's lower bound is higher than "prevVal", we set it to the lower bound
          // otherwise we add the increment to the next rule's lower bound
          if (nextRule.MinThresholdExclusive > prevVal) {
            newVal = nextRule.MinThresholdExclusive;
          } else {
            newVal = nextRule.MinThresholdExclusive + nextRule.MinIncrement;
          }
        } else if (nextRule && nextRule.MinIncrement) {
          remainder = (newVal - nextRule.MinThresholdExclusive) % nextRule.MinIncrement;
          if (remainder !== 0) newVal -= remainder;
        }
      } else {
        if (currentRule && nextRule && currentRule.AuctionBidRuleId !== nextRule.AuctionBidRuleId) {
          if (nextRule.MaxThresholdInclusive < prevVal) {
            newVal = nextRule.MaxThresholdInclusive;
          }
          remainder = (newVal - nextRule.MinThresholdExclusive) % nextRule.MinIncrement;
          if (remainder !== 0) newVal += (nextRule.MinIncrement - remainder);
        } else if (nextRule && nextRule.MinIncrement) {
          remainder = (newVal - nextRule.MinThresholdExclusive) % nextRule.MinIncrement;
          if (remainder !== 0) newVal += (nextRule.MinIncrement - remainder);
        }
      }

    }

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

  const computeMinBid = () => {
    let potentialMinBid = price + 1;

    if (bidRules && bidRules.length) {
      const currentRule = bidRules.find(br => br.MinThresholdExclusive <= price && (br.MaxThresholdInclusive > price || br.MaxThresholdInclusive == null));

      if (!currentRule) return potentialMinBid;
      potentialMinBid = price + currentRule.MinIncrement;

      // correction logic in case the current price does not conform to current rules
      let remainder = (potentialMinBid - currentRule.MinThresholdExclusive) % currentRule.MinIncrement;
      potentialMinBid -= remainder;
      
      // now check if potentialMinBid is governed by a different bid rule
      const nextRule = bidRules.find(br => br.MinThresholdExclusive <= potentialMinBid && (br.MaxThresholdInclusive > potentialMinBid || br.MaxThresholdInclusive == null));
      
      // next rule is the same as the current rule
      if (currentRule?.AuctionBidRuleId === nextRule?.AuctionBidRuleId) return potentialMinBid;

      // at this point we know the potential bid is in a new rule's regime, so we can set the potential bid to the lower bound of the new rule
      potentialMinBid = nextRule.MinThresholdExclusive;
    }
    
    return potentialMinBid;
  }

  const computeBidStep = (val) => {
    let step = 1;

    if (bidRules && bidRules.length > 0) {
      step = bidRules.find(br => {
        return (
          (
            br.MinThresholdExclusive < val ||
            (br.MinThresholdExclusive == 0 && val == 0)
          ) && 
          (
            br.MaxThresholdInclusive >= val ||
            br.MaxThresholdInclusive == null
          )
        );
      })?.MinIncrement || 1;
    }

    console.log('step:', step);

    return step;
  }

  const updateBidStep = (val) => {
    const step = computeBidStep(val);
    // setBidStep(step);
    return step;
  }

  const updateStepAndMinBid = (val) => {
    const step = updateBidStep(val);

    if (autoFillMinBid || val == 0) {
      const minBid = computeMinBid(step);

      setBidVal(minBid);
    }
  }

  const showRulesModal = () => {
    setRulesModalOpen(true);
  }

  const dismissRulesModal = () => {
    setRulesModalOpen(false);
  }

  const autoFillMinBidChanged = (event) => {
    setAutoFillMinBid(event.target.checked);
    localStorage.setItem(AUTOFILL_MIN_BID_LOCALSTORAGE_KEY, JSON.stringify(event.target.checked));
  }

  return (
    <Card size='small' className='flex-growVert-child'>
      <Row type='flex' justify='space-around' gutter={8}>
        <InputNumber
          min={0}
          addonBefore='$'
          parser={value => value.replace(/\$\s?/g, '')}
          onChange={bidChange}
          onStep={onStep}
          onPressEnter={placeCustomBid}
          precision={0}
          // step={bidStep}
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
      <Row type='flex' justify='center' style={{ textAlign: 'center', marginTop: '6px' }} gutter={8}>
        <Checkbox
          checked={autoFillMinBid}
          onChange={autoFillMinBidChanged}
        >
          Auto-fill min bid
        </Checkbox>
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