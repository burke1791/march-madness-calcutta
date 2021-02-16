
import { auctionServiceHelper } from '../services/autction/helper';

function parseChatMessage(msgObj) {
  let chatMessage = {
    msgId: msgObj.Id,
    userId: msgObj.UserId,
    alias: msgObj.Alias,
    content: msgObj.Content,
    timestamp: msgObj.Timestamp
  };

  return [chatMessage];
}

// for now these functions serve the same purpose
function parseAuctionMessage(auctionObj) {
  return auctionServiceHelper.updateAuctionStatus(auctionObj);
}


export {
  parseChatMessage,
  parseAuctionMessage
};