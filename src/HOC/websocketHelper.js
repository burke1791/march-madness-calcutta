
import { auctionServiceHelper } from '../services/autction/helper';

function parseChatMessage(msgObj) {
  let chatMessage = {
    msgId: msgObj.id,
    userId: msgObj.userId,
    alias: msgObj.alias,
    content: msgObj.content,
    timestamp: msgObj.timestamp
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