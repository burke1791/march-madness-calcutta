import React, { useState, useEffect } from 'react';
import { LEAGUE_FORM_TYPE, NOTIF } from '../../utilities/constants';

import { Form, Input, Button, Select } from 'antd';
import 'antd/dist/antd.css';

import { createLeague, joinLeague, Data } from '../../utilities/leagueService';
import { User } from '../../utilities/authService';
import Pubsub from '../../utilities/pubsub';

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

  const tournamentSelected = (id) => {
    setTournamentId(Number(id));
  }

  const handleSubmit = (values) => {
    props.toggleLoading();

    let name = values.leagueName;
    let password = values.leaguePassword;
    let tourneyId = tournamentId;

    if (props.leagueType === LEAGUE_FORM_TYPE.CREATE) {
      createLeague(name, password, tourneyId);
    } else {
      joinLeague(name, password);
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
        <Form.Item 
          label='Tournament' 
          rules={[
            {
              required: true,
              message: 'Please select a tournament'
            }
          ]}
        >
          <Select onChange={tournamentSelected}>
            {generateTournamentOptions()}
          </Select>
        </Form.Item>
      );
    } else {
      return null;
    }
  }

  const generateTournamentOptions = () => {
    const options = Data.tournaments.map(tournament => {
      return <Option value={tournament.id} key={tournament.id}>{tournament.name}</Option>;
    });

    return (options);
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