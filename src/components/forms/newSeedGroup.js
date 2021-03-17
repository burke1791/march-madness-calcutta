import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import 'antd/dist/antd.css';
import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import { AUCTION_SERVICE_ENDPOINTS, LEAGUE_SERVICE_ENDPOINTS, NOTIF } from '../../utilities/constants';
import AuctionService from '../../services/autction/auction.service';
import { auctionServiceHelper } from '../../services/autction/helper';
import LeagueService from '../../services/league/league.service';
import Pubsub from '../../utilities/pubsub';

const layout = {
  labelCol: {
    span: 24
  }
};

const formItemStyle = {
  marginBottom: 6
};

function NewSeedGroup(props) {

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tournamentTeams, setTournamentTeams] = useState([]);

  const [form] = Form.useForm();

  const { leagueId, seedGroupsRefresh } = useLeagueState();
  const { authenticated } = useAuthState();

  const leagueDispatch = useLeagueDispatch();

  useEffect(() => {
    if (authenticated && leagueId) {
      fetchTournamentTeams();
    }
  }, [authenticated, leagueId, seedGroupsRefresh]);

  const fetchTournamentTeams = () => {
    // repurposing an auction service endpoint - will probably want to create a specialized endpoint within league service
    AuctionService.callApiWithPromise(AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_TEAMS, { leagueId }).then(response => {
      let teams = auctionServiceHelper.packageAuctionTeams(response.data);
      setTournamentTeams(teams);
    }).catch(error => {
      console.log(error);
    })
  }
  
  const handleSubmit = (values) => {
    setErrorMessage('');
    setLoading(true);

    let payload = {
      leagueId: leagueId,
      groupName: values.groupName,
      groupTeams: packageTeamsForApiCall(values.groupTeams) 
    };

    console.log(payload);

    createNewSeedGroup(payload);
  }

  const createNewSeedGroup = (payload) => {
    LeagueService.callApiWithPromise(LEAGUE_SERVICE_ENDPOINTS.NEW_LEAGUE_SEED_GROUP, { payload }).then(response => {
      setLoading(false);
      leagueDispatch({ type: 'update', key: 'seedGroupsRefresh', value: new Date().valueOf() });

      if (response.data && response.data[0]?.Error != undefined) {
        setErrorMessage(response.data[0].Error);
      } else {
        form.resetFields();
        Pubsub.publish(NOTIF.SEED_GROUP_MODAL_DISMISS, null);
      }
    }).catch(error => {
      console.log(error);
      setLoading(false);
    });
  }

  const packageTeamsForApiCall = (teams) => {
    let groupTeams = teams.map(team => {
      let teamObj = tournamentTeams.find(obj => obj.displayName == team);

      return {
        itemId: teamObj.itemId,
        itemTypeId: teamObj.itemTypeId
      };
    });

    return groupTeams;
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
    <Form
      form={form}
      {...layout}
      onFinish={handleSubmit}
      style={{ maxWidth: 320 }}
    >
      {generateErrorMessage()}
      <NewSeedGroupName />
      <NewSeedGroupTeams tournamentTeams={tournamentTeams} />
      <NewSeedGroupSubmit loading={loading} />
    </Form>
  );
}

export default NewSeedGroup;


function NewSeedGroupName() {

  return (
    <Form.Item
      name='groupName'
      label='Group Name'
      style={formItemStyle}
      rules={[
        {
          required: true,
          message: 'Please enter a group name'
        }
      ]}
    >
      <Input />
    </Form.Item>
  );
}

function NewSeedGroupTeams(props) {

  return (
    <Form.Item
      name='groupTeams'
      label='Group Teams'
      style={formItemStyle}
      rules={[
        {
          required: true,
          message: 'Please select at least two teams',
          type: 'array'
        }
      ]}
    >
      <Select
        mode='multiple'
        placeholder='Select teams'
        listItemHeight={128}
        style={{ width: '100%' }}
      >
        {props.tournamentTeams.map(team => {
          if (team.itemTypeId != 2) { // don't include groups in the select list
            return (
              <Select.Option key={team.itemId} value={team.displayName}>
                {team.displayName}
              </Select.Option>
            );
          }

          return null;
        }
      )}
      </Select>
    </Form.Item>
  );
}

function NewSeedGroupSubmit(props) {

  return (
    <Form.Item style={formItemStyle}>
      <Button
        type='primary'
        loading={props.loading}
        htmlType='submit'
        style={{ width: '100%' }}
      >
        Create New Seed Group
      </Button>
    </Form.Item>
  );
}