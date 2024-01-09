
/**
 * @typedef AuctionStatus
 * @property {String} Status
 * @property {Number} CurrentItemId
 * @property {String} TeamLogoUrl
 * @property {Number} ItemTypeId
 * @property {String} ItemName
 * @property {Number} Seed
 * @property {String} DisplayName
 * @property {Number} CurrentItemPrice
 * @property {Number} CurrentItemWinner
 * @property {String} Alias
 * @property {Number} LastBidTimestamp
 */

/**
 * @typedef ParsedAuctionStatus
 * @property {String} status
 * @property {Number} currentItemId
 * @property {String} teamLogoUrl
 * @property {Number} itemTypeId
 * @property {String} itemName
 * @property {Number} itemSeed
 * @property {String} displayName
 * @property {Number} price
 * @property {Number} winnerId
 * @property {String} winnerAlias
 * @property {Date} lastBid
 * @property {String} errorMessage
 */

/**
 * @function
 * @param {Array<AuctionStatus>} data 
 * @returns {ParsedAuctionStatus}
 */
export function parseAuctionStatus(data) {
  console.log(data);
    if (Array.isArray(data)) {
      return {
        status: data[0].Status,
        currentItemId: data[0].CurrentItemId,
        teamLogoUrl: data[0].TeamLogoUrl,
        itemTypeId: data[0].ItemTypeId,
        itemName: data[0].ItemName,
        itemSeed: data[0].Seed,
        displayName: data[0].DisplayName,
        price: +data[0].CurrentItemPrice,
        winnerId: data[0].CurrentItemWinner,
        winnerAlias: data[0].Alias,
        lastBid: isNaN(+data[0].LastBidTimestamp) ? new Date(data[0].LastBidTimestamp) : new Date(+data[0].LastBidTimestamp),
        errorMessage: null
      };
    }

    return {};
}