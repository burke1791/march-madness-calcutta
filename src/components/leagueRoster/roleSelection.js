import React, { useEffect, useState } from 'react';
import { Select, Typography } from 'antd';

const { Text } = Typography;

/**
 * @typedef RoleSelectionProps
 * @property {Number} userId
 * @property {Number} roleId
 * @property {String} roleName
 * @property {Array<import('../../services/league/parsers/leagueRoster').LeagueRole>} roleOptions
 * @property {Function} roleChanged
 */

/**
 * @component
 * @param {RoleSelectionProps} props 
 */
function RoleSelection(props) {

  const [options, setOptions] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState(props.roleId);

  useEffect(() => {
    const roles = props.roleOptions.map(r => {
      return {
        value: r.RoleId,
        label: r.RoleName
      }
    }).sort((a, b) => a.value - b.value);

    setOptions(roles);
  }, []);

  const roleSelected = (value, opt) => {
    setSelectedRoleId(opt.value);

    props.roleChanged(props.userId, opt.value);
  }

  if (options.length > 0) {
    return (
      <Select
        onChange={roleSelected}
        style={{ width: '100%' }}
        options={options}
        value={selectedRoleId}
        size='small'
      />
    );
  } else {
    return <Text>{props.roleName}</Text>;
  }
}

export default RoleSelection;