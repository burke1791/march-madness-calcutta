import React, { useEffect } from 'react';
import './landingPage.css';
import bg from '../images/basketball_court_blur_large.png';
import auction from '../images/auction_icon.png';
import money from '../images/cash_icon.png';
import basketball from '../images/basketball_icon.jpg';
import { navigate } from '@reach/router';
import Pubsub from '../utilities/pubsub';
import { NOTIF, AUTH_FORM_TYPE } from '../utilities/constants';
import { User } from '../firebase/authService';
import { Button } from 'antd';

function LandingPage() {

  useEffect(() => {
    Pubsub.subscribe(NOTIF.SIGN_IN, LandingPage, handleSignin);

    if (User.user_id) {
      navigate('/home');
    }

    return (() => {
      Pubsub.unsubscribe(NOTIF.SIGN_IN, LandingPage);
    });
  }, []);

  const handleSignin = () => {
    navigate('/home');
  }

  const signup = () => {
    Pubsub.publish(NOTIF.AUTH_MODAL_SHOW, AUTH_FORM_TYPE.SIGN_UP);
  }

  return (
    <div className='landing'>
      <div className='jumbotron'>
        <img src={bg} className='bg-img' alt='Basketball Court'></img>
        <div className='jumbotron-info-wrapper'>
          <div className='jumbotron-info'>
            <div className='header'>
              <h1>Host Your March Madness Calcutta Tournament!</h1>
            </div>
            <div className='content'>
              <div className='content-text'>
                <p>
                  A calcutta auction is the best way experience March Madness with your friends. The way it works is simple: get a group of friends together and auction off each team in the tournament to the highest bidder. Each team wins a portion of the overall prizepool based on how many wins they get throughout the tournament. Later rounds are weighted higher, so expect the higher ranked to go for more money.
              </p>
                <p>
                  Create an account, start a league, and invite your friends to join you for the most exciting way to participate in March Madness!
              </p>
              </div>
              <div className='get-started'>
                <Button type='primary' onClick={signup}>Get Started!</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='landing-main'>
        <div className='info-block'>
          <div className='info-img-container'>
            <img src={auction} className='info-block-img'></img>
          </div>
          <div className='info-content'>
            <h2>Live Online Auction</h2>
            <p>
              Each team is up for grabs in a live, online auction where everyone will have the chance to outbid each other.
            </p>
            <p>
              The clock starts at 15 seconds and will reset after each bid, which guarantees you the chance to win your favorite team.
            </p>
          </div>
        </div>
        <div className='info-block'>
          <div className='info-content'>
            <h2>Monitor Your Teams' Progress</h2>
            <p>
              As the tournament progresses, your teams earn a portion of the total prizepool for each win they get. Later round wins earn more money than earlier rounds.
            </p>
            <p>
              Your performance is automatically updated during the tournament, so you always know where you stand.
            </p>
          </div>
          <div className='info-img-container'>
            <img src={basketball} className='info-block-img'></img>
          </div>
        </div>
        <div className='info-block'>
          <div className='info-img-container'>
            <img src={money} className='info-block-img'></img>
          </div>
          <div className='info-content'>
            <h2>Take Home The Largest Prize</h2>
            <p>
              Roll the dice on several lower seeded teams with smaller price tags or bet big on a few of the higher seeded teams. Either way, you have a chance to go home a winner.
            </p>
          </div>
        </div>
      </div>
      <div className='get-started-bottom'>
        <Button type='primary' onClick={signup}>Get Started Today!</Button>
      </div>
    </div>
  );
}

export default LandingPage;