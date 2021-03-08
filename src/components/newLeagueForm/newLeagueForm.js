import React, { useState, useEffect } from 'react';
import { LEAGUE_FORM_TYPE, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';

import { Form, Input, Button, Select } from 'antd';
import 'antd/dist/antd.css';

import LeagueService from '../../services/league/league.service';
import { useTournamentState } from '../../context/tournamentContext';

const { Option } = Select;

const layout = {
  labelCol: {
    span: 24
  }
};

function NewLeagueForm(props) {
  
  const [form] = Form.useForm();

  const [errorMessage, setErrorMessage] = useState('');
  const [tournamentId, setTournamentId] = useState('');
  const [tournamentScopeId, setTournamentScopeId] = useState('');

  const { tournaments, tournamentScopes } = useTournamentState();

  const tournamentSelected = (id) => {
    setTournamentId(Number(id));
  }

  const tournamentScopeSelected = (id) => {
    setTournamentScopeId(Number(id));
  }

  const handleSubmit = (values) => {
    props.toggleLoading();

    let name = values.leagueName;
    let password = values.leaguePassword;
    let inviteCode = values.inviteCode;

    if (props.leagueType === LEAGUE_FORM_TYPE.CREATE) {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.NEW_LEAGUE, { 
        name: name,
        password: password,
        tournamentId: tournamentId,
        tournamentScopeId: tournamentScopeId
      });
    } else {
      LeagueService.callApi(LEAGUE_SERVICE_ENDPOINTS.JOIN_LEAGUE, { inviteCode });
    }
  }

  const generateErrorMessage = () => {
    if (errorMessage) {
      return (
        <span className='ant-form-text' style={{ color: '#cf1322' }}>{errorMessage}</span>
      );
    } else {
      return null;
    }
  }

  const generateTournamentType = () => {
    if (props.leagueType === LEAGUE_FORM_TYPE.CREATE) {
      return (
        <React.Fragment>
          <Form.Item 
            label='Sport' 
            rules={[
              {
                required: true,
                message: 'Please select a sport'
              }
            ]}
          >
            <Select onChange={tournamentSelected}>
              {generateTournamentOptions()}
            </Select>
          </Form.Item>
          <Form.Item
            label='Season Scope'
            rules={[
              {
                required: true,
                message: 'Please select the season\'s scope'
              }
            ]}
          >
            <Select onChange={tournamentScopeSelected}>
              {generateTournamentScopeOptions()}
            </Select>
          </Form.Item>
          <Form.Item 
            name='leagueName'
            label='League Name'
            rules={[
              {
                required: true,
                message: 'Please input a league name!'
              }
            ]}
          >
            <Input placeholder='league name' />
          </Form.Item>
          <Form.Item 
            name='leaguePassword'
            label='League Password'
            rules={[
              {
                required: true,
                message: 'Please input a league name!'
              }
            ]}  
          >
            <Input placeholder='league password' />
          </Form.Item>
        </React.Fragment>
      );
    } else {
      return (
        <Form.Item
          name='inviteCode'
          label='Invite Code'
          rules={[
            {
              required: true,
              message: 'Please input the league\'s invite code'
            }
          ]}
        >
          <Input placeholder='invite code' />
        </Form.Item>
      );
    }
  }

  const generateTournamentOptions = () => {
    const options = tournaments.map(tournament => {
      return <Option value={tournament.TournamentId} key={tournament.TournamentId}>{tournament.TournamentName}</Option>;
    });

    return (options);
  }

  const generateTournamentScopeOptions = () => {
    if (tournamentId !== '') {
      // find the applicable tournament scopes and sort them according to their DisplayOrder
      let scopes = tournamentScopes
        .filter(tournamentScope => tournamentScope.TournamentId == tournamentId).sort((a, b) => a.DisplayOrder - b.DisplayOrder);

      const options = scopes.map(scope => {
        return <Option value={scope.TournamentRegimeId} key={scope.TournamentRegimeId}>{scope.Name}</Option>
      });

      return (options);
    }
    
    return null;
  }

  return (
    <Form 
      form={form}
      {...layout}
      onFinish={handleSubmit} 
      className='new-league-form'
      style={{ maxWidth: '300px' }}
      size='small'
    >
      {generateErrorMessage()}
      {generateTournamentType()}
      <Form.Item>
        <Button type='primary' loading={props.loading} htmlType='submit' className='new-league-button' style={{ width: '100%' }}>Submit</Button>
        <Button 
          type='link'
          onClick={() => {
            props.toggleLeagueForm(props.leagueType === LEAGUE_FORM_TYPE.JOIN ? LEAGUE_FORM_TYPE.CREATE : LEAGUE_FORM_TYPE.JOIN)
          }}
          style={{ padding: '0' }}
        >
          {props.leagueType === LEAGUE_FORM_TYPE.JOIN ? LEAGUE_FORM_TYPE.CREATE : LEAGUE_FORM_TYPE.JOIN}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default NewLeagueForm;