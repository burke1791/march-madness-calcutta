import React, { useState, useEffect } from 'react';

import WrappedNewLeagueForm from '../newLeagueForm/newLeagueForm';

import { LEAGUE_FORM_TYPE, NOTIF, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import LeagueService from '../../services/league/league.service'

import { Modal } from 'antd';
import 'antd/dist/antd.css';
import { useAuthState } from '../../context/authContext';
import { useTournamentDispatch } from '../../context/tournamentContext';
import { tournamentOptionsParser } from '../../services/league/parsers';

// @TODO combine this entire component into AuthModal and rename it to CalcuttaModal
function LeagueModal() {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formType, setFormType] = useState(LEAGUE_FORM_TYPE.CREATE);

  const { authenticated } = useAuthState();
  const tournamentDispatch = useTournamentDispatch();

  useEffect(() => {
    Pubsub.subscribe(NOTIF.LEAGUE_MODAL_SHOW, LeagueModal, showModal);
    Pubsub.subscribe(NOTIF.LEAGUE_JOINED, LeagueModal, handleCancel);

    return (() => {
      Pubsub.unsubscribe(NOTIF.LEAGUE_MODAL_SHOW, LeagueModal);
      Pubsub.unsubscribe(NOTIF.LEAGUE_JOINED, LeagueModal);
    });
  }, []);

  useEffect(() => {
    fetchTournamentOptions();
  }, [authenticated]);

  const fetchTournamentOptions = () => {
    if (authenticated) {
      LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.TOURNAMENT_OPTIONS).then(response => {
        console.log(response);
        let [tournaments, tournamentScopes] = tournamentOptionsParser(response.data);
        setTournamentOptionsInContext(tournaments, tournamentScopes);
      }).catch(error => {
        console.log(error);
      });
    }
  }

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