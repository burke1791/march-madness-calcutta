import React, { useState, useEffect } from 'react';
import { useAuthState } from '../../context/authContext';
import { Button, message, Result } from 'antd';

import Pubsub from '../../utilities/pubsub';
import { API_CONFIG, AUTH_FORM_TYPE, AUTH_STATUS, DATA_SYNC_SERVICE_ENDPOINTS, LEAGUE_SERVICE_ENDPOINTS, NOTIF } from '../../utilities/constants';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import useData from '../../hooks/useData';

function JoinLeague(props) {

  const location = useLocation();
  const navigate = useNavigate();

  const [title, setTitle] = useState('Attempting to Join League');
  const [feedback, setFeedback] = useState('Verifying Credentials');
  const [inviteCode, setInviteCode] = useState(null);
  const [status, setStatus] = useState('info');
  const [joinError, setJoinError] = useState(false);
  const [joinSuccess, setJoinSuccess] = useState(false);
  const [leaguePath, setleaguePath] = useState('');
  
  const { authenticated, authStatus } = useAuthState();

  const [joinLeagueResponse, joinLeagueReturnDate, joinLeague] = useData({
    baseUrl: API_CONFIG.DATA_SYNC_SERVICE_BASE_URL,
    endpoint: `${DATA_SYNC_SERVICE_ENDPOINTS.JOIN_LEAGUE}`,
    method: 'POST',
    conditions: [authenticated]
  });

  useEffect(() => {
    if (joinLeagueReturnDate && joinLeagueResponse && joinLeagueResponse.length) {
      console.log(joinLeagueResponse);
      handleLeagueJoined(joinLeagueResponse[0]);
    }
  }, [joinLeagueResponse, joinLeagueReturnDate]);

  useEffect(() => {
    console.log(location);
    let reg = new RegExp(/(?:\?inviteCode=)(.+?)(?=&|$)/g);
    let urlInvite = reg.exec(location.search);

    if (urlInvite == null && !joinSuccess) {
      props.location.search = '';
      navigate('/home', { replace: true });
    } else if (urlInvite != null && urlInvite.length >= 2) {
      setInviteCode(urlInvite[1]);
    }
  }, [location.search]);

  useEffect(() => {
    console.log(authenticated);
    console.log(authStatus);
    if (joinSuccess) {
      setFeedback('');
      setTitle('Join Successful!');
      setStatus('success');
      Pubsub.publish(NOTIF.AUTH_MODAL_DISMISS);
    } else if (joinError) {
      setFeedback('Please try again later');
      setTitle('Error Joining League');
      setStatus('error');
    } else if (authStatus === AUTH_STATUS.AWAITING_CONFIRMATION) {
      setFeedback('Please check your email and confirm your account');
      setTitle('Awaiting Account Confirmation');
      setStatus('info');
    } else if (authenticated !== undefined && !authenticated && authStatus !== AUTH_STATUS.SIGNED_IN) {
      setFeedback('Please Sign In');
      setStatus('warning');
      displayAuthModal();
    } else if (authStatus === AUTH_STATUS.IN_FLIGHT) {
      Pubsub.publish(NOTIF.AUTH_MODAL_DISMISS);
      setFeedback('Verifying Credentials');
      setStatus('info');
    } else if (inviteCode !== null && authStatus === AUTH_STATUS.SIGNED_IN && authenticated) {
      setFeedback('Join Request Sent, Please Stay on this Page...');
      setStatus('info');
      joinLeague({ inviteCode: inviteCode });
    }
  }, [authenticated, authStatus, joinError, joinSuccess, inviteCode]);

  const handleLeagueJoined = (data) => {
    if (data && data.LeaguePath != undefined) {
      setleaguePath(data.LeaguePath);
      setJoinSuccess(true);
      Pubsub.publish(NOTIF.AUTH_MODAL_DISMISS);
      navigate(data.LeaguePath, { replace: true });
    } else {
      setJoinError(true);

      if (data?.Error) message.error(data.Error);
    }
  }

  const displayAuthModal = () => {
    Pubsub.publish(NOTIF.AUTH_MODAL_SHOW, AUTH_FORM_TYPE.SIGN_UP);
  }

  const generateActionDisplay = () => {
    if (joinError) {
      return (
        <Button type='primary'>
          <Link to='/home'>Main Page</Link>
        </Button>
      );
    } else if (status == 'warning') {
      return (
        <Button type='primary' onClick={displayAuthModal}>
          Sign In
        </Button>
      );
    }

    return null;
  }

  const generateDisplay = () => {
    if (joinSuccess) {
      return navigate(leaguePath, { replace: true });
    }

    return (
      <Result
        title={title}
        subTitle={feedback}
        status={status}
        extra={generateActionDisplay()}
      />
    );
  }

  return (
    generateDisplay()
  );
}

export default JoinLeague;