import React, { useState, useEffect } from 'react';
import { useAuthState } from '../../context/authContext';
import { Button, message, Result } from 'antd';
import 'antd/dist/antd.css';
import Pubsub from '../../utilities/pubsub';
import { AUTH_FORM_TYPE, LEAGUE_SERVICE_ENDPOINTS, NOTIF } from '../../utilities/constants';
import LeagueService from '../../services/league/league.service';
import { useNavigate, useLocation, Link } from 'react-router-dom';

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

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_JOINED, JoinLeague, handleLeagueJoined);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_JOINED, JoinLeague);
    });
  }, []);

  useEffect(() => {
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
    if (joinSuccess) {
      setFeedback('');
      setTitle('Join Successful!');
      setStatus('success');
    } else if (joinError) {
      setFeedback('Please try again later');
      setTitle('Error Joining League');
      setStatus('error');
    } else if (!authenticated && !authStatus) {
      setFeedback('Please Sign In');
      setStatus('warning');
      displayAuthModal();
    } else if (authStatus == 'in-flight') {
      Pubsub.publish(NOTIF.AUTH_MODAL_DISMISS);
      setFeedback('Verifying Credentials');
      setStatus('info');
    } else if (inviteCode !== null && authStatus == 'returned' && authenticated) {
      setFeedback('Join Request Sent, Please Stay on this Page...');
      setStatus('info');
      sendJoinLeagueRequest();
    }
  }, [authenticated, authStatus, joinError, joinSuccess, inviteCode]);

  const handleLeagueJoined = (data) => {
    if (data && data.LeaguePath != undefined) {
      setleaguePath(data.LeaguePath);
      setJoinSuccess(true);
      props.location.search = '';
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

  const sendJoinLeagueRequest = () => {
    LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.JOIN_LEAGUE, { inviteCode });
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