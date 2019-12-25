import React, { useState } from 'react';
import { LEAGUE_FORM_TYPE } from '../../utilities/constants';

import { Form, Input, Button } from 'antd';
import 'antd/dist/antd.css';

import DataService from '../../utilities/data';
import { User } from '../../firebase/authService';

function NewLeagueForm(props) {

  const [errorMessage, setErrorMessage] = useState('');

  const { getFieldDecorator } = props.form;

  const handleSubmit = (event) => {
    event.preventDefault();

    // validate fields and make the post request
    props.form.validateFields((err, values) => {
      if (!err) {
        props.toggleLoading();

        let name = values.league_name;
        let password = values.league_password;
        let year = 2019; // @TODO move this to the server
        let user_id = User.user_id; // @TODO move this to DataService

        // @TODO send API.create_league post request
        if (props.leagueType === LEAGUE_FORM_TYPE.CREATE) {
          DataService.createLeague({ name: name, password: password, year: year, user_id: user_id });
        } else {
          DataService.joinLeague({ name: name, password: password, user_id: user_id });
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

  return (
    <Form onSubmit={handleSubmit} className='new-league-form' style={{ maxWidth: '300px' }}>
      {generateErrorMessage()}
      <Form.Item>
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
      <Form.Item>
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