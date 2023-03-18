import React, { useState, useEffect } from 'react';

import WrappedNewLeagueForm from '../newLeagueForm/newLeagueForm';

import { LEAGUE_FORM_TYPE, NOTIF, LEAGUE_SERVICE_ENDPOINTS, API_CONFIG } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import LeagueService from '../../services/league/league.service'

import { Modal } from 'antd';
import 'antd/dist/antd.css';
import { useAuthState } from '../../context/authContext';
import { useTournamentDispatch } from '../../context/tournamentContext';
import { tournamentOptionsParser } from '../../services/league/parsers';
import useData from '../../hooks/useData';

// @TODO combine this entire component into AuthModal and rename it to CalcuttaModal
function LeagueModal() {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState(LEAGUE_FORM_TYPE.CREATE);

  const { authenticated } = useAuthState();
  const tournamentDispatch = useTournamentDispatch();

  const [tournamentOptions, tournamentOptionsReturnDate, fetchTournamentOptions] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: LEAGUE_SERVICE_ENDPOINTS.TOURNAMENT_OPTIONS,
    method: 'GET',
    processData: tournamentOptionsParser,
    conditions: [authenticated]
  });

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_MODAL_SHOW, LeagueModal, showModal);
    Pubsub.subscribe(NOTIF.LEAGUE_JOINED, LeagueModal, handleCancel);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_MODAL_SHOW, LeagueModal);
      Pubsub.unsubscribe(NOTIF.LEAGUE_JOINED, LeagueModal);
    });
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchTournamentOptions();
    }
  }, [authenticated]);

  useEffect(() => {
    if (tournamentOptionsReturnDate) {
      console.log(tournamentOptions);
      if (tournamentOptions && tournamentOptions.length === 2) {
        setTournamentOptionsInContext(tournamentOptions[0], tournamentOptions[1]);
      } else {
        console.log('Possibly an error in tournamentOptions endpoint');
      }
    }
  }, [tournamentOptionsReturnDate, tournamentOptions]);

  const setTournamentOptionsInContext = (tournaments, tournamentScopes) => {
    tournamentDispatch({ type: 'update', key: 'tournaments', value: tournaments });
    tournamentDispatch({ type: 'update', key: 'tournamentScopes', value: tournamentScopes });
  }

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
      setLoading(!loading);
    } else {
      setLoading(state);
    }
  }

  const generateForm = () => {
    return (
      <WrappedNewLeagueForm loading={loading} toggleLoading={toggleLoading} toggleLeagueForm={handleFormToggle} leagueType={formType} />
    );
  }

  return (
    <Modal
      title={formType}
      open={visible}
      onCancel={handleCancel}
      style={{ maxWidth: '348px' }}
      footer={null}
    >
      {generateForm()}
    </Modal>
  );
}

export default LeagueModal;