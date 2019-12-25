import React, { useState, useEffect } from 'react';

import { Modal } from 'antd';
import 'antd/dist/antd.css';

import Pubsub from '../../utilities/pubsub';
import { MESSAGE_BOARD_FORM_TYPE, NOTIF } from '../../utilities/constants';
import WrappedNewTopicForm from '../newTopicForm/newTopicForm';

function MessageBoardModal() {
  
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leagueId, setLeagueId] = useState(0);

  useEffect(() => {
    Pubsub.subscribe(NOTIF.MESSAGE_BOARD_MODAL_SHOW, MessageBoardModal, showModal);

    return (() => {
      Pubsub.unsubscribe(NOTIF.MESSAGE_BOARD_MODAL_SHOW, MessageBoardModal);
    });
  }, []);

  const showModal = (currentLeagueId) => {
    console.log(currentLeagueId);
    setLeagueId(currentLeagueId)
    setVisible(true);
    console.log('set visible to true');
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
    // use this function to return different forms if future development goes that direction
    return (
      <WrappedNewTopicForm loading={loading} toggleLoading={toggleLoading} handleCancel={handleCancel} leagueId={leagueId} />
    );
  }

  return (
    <Modal
      title={'New Topic'}
      visible={visible}
      onCancel={handleCancel}
      style={{ maxWidth: '500px', top: '50px' }}
      footer={null}
    >
      {generateForm()}
    </Modal>
  );
}

export default MessageBoardModal;