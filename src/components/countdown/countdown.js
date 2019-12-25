import React, { useState, useEffect } from 'react';
import './countdown.css';
import { useInterval } from '../../utilities/hooks';
import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';

var timerId = null;

// @TODO extract the countdown logic into its own component called Counter

// custom Countdown component because ant design didn't have the functionality I need
function Countdown(props) {

  const [countdownValue, setCountdownValue] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    startClock();
  }, []);

  const synchronizeWithServer = () => {
    // call data service method
  }

  const startClock = () => {
    setCountdownValue(calculateRemainingTime());
    synchronizeWithServer();
  }

  const tick = () => {
    console.log('tick', countdownValue);
    if (countdownValue <= 0) {
      stopClock();
      Pubsub.publish(NOTIF.TIMER_EXPIRED, null);
    } else {
      let remainingTime = calculateRemainingTime();
      setCountdownValue(remainingTime);
    }
  }

  const stopClock = () => {
    if (timerId) {
      clearInterval(timerId);
    }
  }

  const calculateRemainingTime = () => {
    let currentTime = new Date().getTime();
    let remainingTime = Math.round((props.endTime - currentTime - offset) / 1000);
    console.log(props.endTime);
    console.log(currentTime);
    console.log(remainingTime);

    return remainingTime;
  }

  const generateCountdownValue = () => {
    return formatCountdownValue(countdownValue);
  }

  const formatCountdownValue = (seconds) => {
    let value;

    if (seconds == 0) {
      value = '00:00';
    } else if (seconds >= 10) {
      value = '00:' + seconds;
    } else {
      value = '00:0' + seconds;
    }

    return value;
  }

  return (
    <div className='countdown'>
      <div className='countdown-title'>
        {props.title}
      </div>
      <div className='countdown-content'>
        <span className='countdown-content-value'>
          {generateCountdownValue()}
        </span>
      </div>
    </div>
  );
}

export default Countdown;