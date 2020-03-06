import React, { useState } from 'react';
import { LEAGUE_FORM_TYPE } from '../../utilities/constants';

import { Form, Input, Button, Select } from 'antd';
import 'antd/dist/antd.css';

import DataService from '../../utilities/data';
import { createLeague, joinLeague } from '../../utilities/leagueService';
import { User } from '../../utilities/authService';

const { Option } = Select;

function NewLeagueForm(props) {

  const [errorMessage, setErrorMessage] = useState('');
  const [tournamentId, setTournamentId] = useState('');

  const tournamentSelected = (id) => {
    setTournamentId(Number(id));
  }

  const { getFieldDecorator } = props.form;

  const handleSubmit = (event) => {
    event.preventDefault();

    // validate fields and make the post request
    props.form.validateFields((err, values) => {
      if (!err) {
        props.toggleLoading();

        let name = values.league_name;
        let password = values.league_password;
        let tourneyId = tournamentId; // @TODO make this built in to the 'tournamentId' from the database

        // @TODO send API.create_league post request
        if (props.leagueType === LEAGUE_FORM_TYPE.CREATE) {
          createLeague(name, password, tourneyId);
        } else {
          joinLeague(name, password);
        }
      } else {
        alert('Validation Error');
      }
    })
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
        <Form.Item label='Tournament' required={true}>
          <Select onChange={tournamentSelected}>
            <Option value='1'>2019 Big Ten Tournament</Option>
            <Option value='2'>2019 March Madness</Option>
          </Select>
        </Form.Item>
      );
    } else {
      return null;
    }
  }

  return (
    <Form onSubmit={handleSubmit} className='new-league-form' style={{ maxWidth: '300px' }} size='small'>
      {generateErrorMessage()}
      {generateTournamentType()}
      <Form.Item label='League Name'>
        {getFieldDecorator('league_name', {
          rules: [
            {
              required: true,
              message: 'Please input a league name!'
            }
          ]
        })(
          <Input placeholder='league name' />
        )}
      </Form.Item>
      <Form.Item label='League Password'>
        {getFieldDecorator('league_password', {
          rules: [
            {
              required: true,
              message: 'Please input a league name!'
            }
          ]
        })(
          <Input placeholder='league password' />
        )}
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

const WrappedNewLeagueForm = Form.create({ name: 'new_league_form' })(NewLeagueForm);

export default WrappedNewLeagueForm;