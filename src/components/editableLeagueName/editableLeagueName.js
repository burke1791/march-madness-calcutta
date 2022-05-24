import React, { useEffect, useState } from 'react';
import { Typography } from 'antd';
import { useLeagueState } from '../../context/leagueContext';
import useData from '../../hooks/useData';
import { API_CONFIG, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { useAuthState } from '../../context/authContext';

const { Title } = Typography;

function EditableLeagueName() {

  const [leagueNameText, setLeagueNameText] = useState('');
  const [leagueNameEdited, setLeagueNameEdited] = useState(false);

  const { leagueId, leagueName } = useLeagueState();
  const { authenticated } = useAuthState();

  const [leagueNameUpdate, leagueNameUpdateDate, updateLeagueName] = useData({
    baseUrl: API_CONFIG.LEAGUE_SERVICE_BASE_URL,
    endpoint: LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_NAME,
    method: 'POST',
    conditions: [authenticated]
  });

  useEffect(() => {
    if (!leagueNameEdited) {
      setLeagueNameText(leagueName);
    }
  }, [leagueName]);

  useEffect(() => {
    setLeagueNameEdited(false);
  }, [leagueNameUpdateDate]);

  const leagueNameChange = (text) => {
    setLeagueNameText(text);
    setLeagueNameEdited(true);

    const payload = {
      leagueId: leagueId,
      newLeagueName: text
    };

    updateLeagueName(payload);
  }

  return (
    <Title
      level={4}
      editable={{
        maxLength: 50,
        onChange: leagueNameChange
      }}
    >
      {leagueNameText}
    </Title>
  );
}

export default EditableLeagueName;