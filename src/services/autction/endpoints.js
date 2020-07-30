import { AUCTION_SERVICE_ENDPOINTS, NOTIF } from '../../utilities/constants';
import Pubsub from '../../utilities/pubsub';
import { auctionServiceHelper } from './helper';

export const auctionEndpoints = {
  getServerTimestamp: function(apiService) {
    apiService({
      method: 'GET',
      url: AUCTION_SERVICE_ENDPOINTS.SERVER_TIMESTAMP
    }).then(response => {
      auctionServiceHelper.updateServerPing(response.data[0].ServerTimestamp);
    }).catch(error => {
      console.log(error);
    });
  }
}