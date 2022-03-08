import ApiService from '../apiService';
import { API_CONFIG, USER_SERVICE_ENDPOINTS } from '../../utilities/constants';
import { userEndpoints } from './endpoints';

/**
 * IIFE pattern used to achieve a singleton instance of the ApiService module. This will be the interface between
 * the React components and the user service API
 * @module UserService
 */
var UserService = (function() {
  var instance;

  function createInstance() {
    var api = new ApiService(API_CONFIG.USER_SERVICE_BASE_URL);
    return api;
  }

  if (!instance) {
    instance = createInstance();
  }
  return instance;
})();

/**
 * Adding each user service endpoint to the UserService instance
 */
UserService.newEndpoint(USER_SERVICE_ENDPOINTS.GET_USER_METADATA, userEndpoints.getUserMetadata);
UserService.newEndpoint(USER_SERVICE_ENDPOINTS.GET_USER_UPCOMING_GAMES, userEndpoints.getUserUpcomingGames);

export default UserService