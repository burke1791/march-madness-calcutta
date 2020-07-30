import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';

export const auctionServiceHelper = {
  updateServerPing: function(pingObj) {
    let serverTime = new Date(pingObj).valueOf();
    let local = Date.now();

    let offset = serverTime - local;
    
    Pubsub.publish(NOTIF.SERVER_SYNCED, offset);
  }
};