import { LEAGUE_SERVICE_ENDPOINTS } from "../../utilities/constants";

const constructUpdatedSettingsArray = (group, allSettings) => {
  console.log(allSettings);
  return allSettings.filter(setting => {
    return setting.group == group;
  });
}

const getUpdateSettingsEndpoint = (group) => {
  if (group == 'auction') {
    return LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_SETTINGS;
  } else if (group == 'payout') {
    return LEAGUE_SERVICE_ENDPOINTS.UPDATE_LEAGUE_PAYOUT_SETTINGS;
  }
  return null;
}

export {
  constructUpdatedSettingsArray,
  getUpdateSettingsEndpoint
};