import React, { useState, useEffect } from 'react';

import WrappedNewLeagueForm from '../newLeagueForm/newLeagueForm';

import { LEAGUE_FORM_TYPE, NOTIF, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import LeagueService from '../../services/league/league.service'

import { Modal } from 'antd';
import 'antd/dist/antd.css';
import { User } from '../../utilities/authService';

// @TODO combine this entire component into AuthModal and rename it to CalcuttaModal
function LeagueModal() {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState(LEAGUE_FORM_TYPE.CREATE);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_MODAL_SHOW, LeagueModal, showModal);
    Pubsub.subscribe(NOTIF.LEAGUE_JOINED, LeagueModal, handleCancel);
    Pubsub.subscribe(NOTIF.SIGN_IN, LeagueModal, handleSignin);

    if (User.authenticated) {
      console.log('fetching tournament options');
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.TOURNAMENT_OPTIONS);
    }

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_MODAL_SHOW, LeagueModal);
      Pubsub.unsubscribe(NOTIF.LEAGUE_JOINED, LeagueModal);
      Pubsub.unsubscribe(NOTIF.SIGN_IN, LeagueModal);
    });
  }, []);

  const showModal = (type) => {
    if (type) {
      setFormType(type);
    }
    setVisible(true);
  }

  const handleFormToggle = (type) => {
    setFormType(type);
  }

  const handleCancel = () => {
    setVisible(false);
    setLoading(false);
  }

  const toggleLoading = (state) => {
    if (state == undefined) {
      console.log('toggle loading natural');
      setLoading(!loading);
    } else {
      console.log('toggle loading literal');
      setLoading(state);
    }
  }

  const handleSignin = () => {
    LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.TOURNAMENT_OPTIONS);
  }

  const generateForm = () => {
    return (
      <WrappedNewLeagueForm loading={loading} toggleLoading={toggleLoading} toggleLeagueForm={handleFormToggle} leagueType={formType} />
    );
  }

  return (
    <Modal
      title={formType}
      visible={visible}
      onCancel={handleCancel}
      style={{ maxWidth: '348px' }}
      footer={null}
    >
      {generateForm()}
    </Modal>
  );
}

export default LeagueModal;