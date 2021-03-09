import { USER_SERVICE_ENDPOINTS } from '../../utilities/constants';


export const userEndpoints = {
  getUserMetadata: function(apiService) {
    let options = {
      method: 'GET',
      url: USER_SERVICE_ENDPOINTS.GET_USER_METADATA
    };

    return apiService(options);
  }
}