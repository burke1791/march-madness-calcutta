import React, { useEffect, useState } from 'react';
import { Button, Form, Select, Input } from 'antd';
import { useLeagueDispatch, useLeagueState } from '../../context/leagueContext';
import { useAuthState } from '../../context/authContext';
import useData from '../../hooks/useData';
import { API_CONFIG, AUCTION_SERVICE_ENDPOINTS, DATA_SYNC_SERVICE_ENDPOINTS, LEAGUE_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { auctionServiceHelper } from '../../services/autction/helper';

const layout = {
  labelCol: {
    span: 24
  }
};

const formItemStyle = {
  marginBottom: 6
};

/**
 * @typedef SeedGroupTeam
 * @property {Number} slotId
 * @property {Number} teamId
 * @property {Number} [seed]
 * @property {String} teamName
 */

/**
 * @typedef SeedGroup
 * @property {Number} groupId,
 * @property {String} groupName
 * @property {Array<SeedGroupTeam>} teams
 */

/**
 * @typedef SeedGroupFormProps
 * @property {Boolean} isEditMode
 * @property {SeedGroup} group
 */

/**
 * @component
 * @param {SeedGroupFormProps} props 
 */
function SeedGroupForm(props) {

  const [loading, setLoading] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const [form] = Form.useForm();

  const { leagueId, seedGroupsRefresh } = useLeagueState();
  const { authenticated } = useAuthState();

  const leagueDispatch = useLeagueDispatch();

  // const [tournamentTeams, teamsReturnDate, fetchTeams] = useData({
  //   baseUrl: API_CONFIG.AUCTION_SERVICE_BASE_URL,
  //   endpoint: `${AUCTION_SERVICE_ENDPOINTS.FETCH_AUCTION_TEAMS}/${leagueId}`,
  //   method: 'GET',
  //   processData: auctionServiceHelper.packageAuctionTeams,
  //   conditions: [authenticated, leagueId]
  // });

  const [updateGroupResponse, updateGroupReturnDate, updateSeedGroup] = useData({
    baseUrl: API_CONFIG.DATA_SYNC_SERVICE_BASE_URL,
    endpoint: `${DATA_SYNC_SERVICE_ENDPOINTS.UPDATE_SEED_GROUP}/${leagueId}`,
    method: 'POST',
    conditions: [authenticated, leagueId]
  });

  const [createGroupResponse, createGroupReturnDate, createSeedGroup] = useData({
    baseUrl: API_CONFIG.DATA_SYNC_SERVICE_BASE_URL,
    endpoint: DATA_SYNC_SERVICE_ENDPOINTS.NEW_LEAGUE_SEED_GROUP,
    method: 'POST',
    conditions: [authenticated, leagueId]
  });

  // useEffect(() => {
  //   if (leagueId && authenticated) {
  //     setTeamsLoading(true);
  //     fetchTeams();
  //   }

  //   return (() => {
  //     form.resetFields();
  //   });
  // }, [leagueId, authenticated, seedGroupsRefresh]);

  // useEffect(() => {
  //   if (teamsReturnDate) {
  //     setTeamsLoading(false);
  //   }
  // }, [teamsReturnDate]);

  useEffect(() => {
    if (updateGroupReturnDate || createGroupReturnDate) {
      setLoading(false);
    }
  }, [updateGroupReturnDate, createGroupReturnDate]);

  useEffect(() => {
    if (updateGroupReturnDate && updateGroupResponse?.length && updateGroupResponse[0]?.Error) {
      setErrorMessage(updateGroupResponse[0].Error);
    } else if (updateGroupReturnDate) {
      leagueDispatch({ type: 'update', key: 'seedGroupsRefresh', value: new Date().valueOf() });
    }
  }, [updateGroupReturnDate]);

  useEffect(() => {
    if (createGroupReturnDate && createGroupResponse?.length && createGroupResponse[0]?.Error) {
      setErrorMessage(createGroupResponse[0].Error);
    } else if (createGroupReturnDate && !props.isEditMode) {
      // reset the form after creating a new group so the user can quickly create a new one
      leagueDispatch({ type: 'update', key: 'seedGroupsRefresh', value: new Date().valueOf() });
      form.resetFields();
    }
  }, [createGroupReturnDate]);

  const packageTeamsForApiCall = (teams) => {
    console.log(teams);
    console.log(props.tournamentTeams);
    const groupTeams = teams.map(team => {
      const teamObj = props.tournamentTeams.find(t => t.DisplayName == team);

      return {
        itemId: teamObj.TournamentSlotId,
        itemTypeId: 3 // these will always be type 3
      }
    });

    return groupTeams;
  }

  const handleSubmit = (values) => {
    setErrorMessage(null);
    setLoading(true);

    if (props.isEditMode) {
      const payload = {
        groupId: props.groupId,
        groupName: values.groupName,
        groupTeams: packageTeamsForApiCall(values.groupTeams)
      };

      updateSeedGroup(payload);
    } else {
      const payload = {
        leagueId: leagueId,
        groupName: values.groupName,
        groupTeams: packageTeamsForApiCall(values.groupTeams)
      };

      createSeedGroup(payload);
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

  const initialValues = {
    groupName: props.groupName,
    groupTeams: props.groupTeams.map(t => t.displayName)
  };

  return (
    <Form
      form={form}
      {...layout}
      onFinish={handleSubmit}
      style={{ maxWidth: 320 }}
      initialValues={initialValues}
    >
      {generateErrorMessage()}
      <SeedGroupName />
      <SeedGroupTeams groupId={props.groupId} tournamentTeams={props.tournamentTeams} loading={props.teamsLoading} />
      <SeedGroupSubmit loading={loading} isEditMode={props.isEditMode} />
    </Form>
  );
}


function SeedGroupName() {

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

/**
 * @typedef SeedGroupTeamsProps
 * @property {Number} groupId
 * @property {Array} tournamentTeams
 * @property {Boolean} loading
 */

/**
 * @component
 * @param {SeedGroupTeamsProps} props 
 */
function SeedGroupTeams(props) {

  const sortedTeams = props.tournamentTeams?.length && props.tournamentTeams.sort((a, b) => {
    const fa = a.DisplayName.toLowerCase();
    const fb = b.DisplayName.toLowerCase();

    if (fa < fb) return -1;
    if (fa > fb) return 1;
    return 0;
  });

  const filteredTeams = sortedTeams?.length && sortedTeams.filter(team => {
    if (team.GroupId == null) return true; // include all teams not currently in a group
    if (props.groupId && team.GroupId == props.groupId) return true; // include teams that are part of the currently selected group
    return false;
  });
  
  const options = filteredTeams?.length && filteredTeams.map(team => {
    return { value: team.DisplayName }
  });

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
        loading={props.loading}
        style={{ width: '100%' }}
        options={options}
      />
        {/* {
          teams?.length && teams.map(team => {
            if (team.GroupId == null) { // don't include groups in the select list
              return (
                <Select.Option key={team.TournamentSlotId} value={team.DisplayName}>
                  {team.DisplayName}
                </Select.Option>
              );
            }

            return null;
          })
        }
      </Select> */}
    </Form.Item>
  );
}

/**
 * @typedef SeedGroupSubmitProps
 * @property {Boolean} loading
 * @property {Boolean} isEditMode
 */

/**
 * @component
 * @param {SeedGroupSubmitProps} props 
 */
function SeedGroupSubmit(props) {

  return (
    <Form.Item style={formItemStyle}>
      <Button
        type='primary'
        loading={props.loading}
        htmlType='submit'
        style={{ width: '100%' }}
      >
        {props.isEditMode ? 'Update Seed Group' : 'Create New Seed Group'}
      </Button>
    </Form.Item>
  )
}

export default SeedGroupForm;