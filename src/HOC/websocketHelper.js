
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
function parseAuctionMessage(status) {
  return {
    status: status.Status,
    currentItemId: status.CurrentItemId,
    teamLogoUrl: status.TeamLogoUrl,
    itemTypeId: status.ItemTypeId,
    itemName: status.ItemName,
    itemSeed: status.Seed,
    displayName: status.DisplayName,
    price: +status.CurrentItemPrice,
    winnerId: status.CurrentItemWinner,
    winnerAlias: status.Alias,
    lastBid: isNaN(+status.LastBidTimestamp) ? new Date(status.LastBidTimestamp) : new Date(+status.LastBidTimestamp),
    errorMessage: null
  };
}


export {
  parseChatMessage,
  parseAuctionMessage
};