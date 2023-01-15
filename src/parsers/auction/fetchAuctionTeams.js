
/**
 * @typedef AuctionTeam
 * @property {Number} ItemId
 * @property {String} TeamLogoUrl
 * @property {Number} ItemTypeId
 * @property {String} ItemName
 * @property {String} DisplayName
 * @property {Number} Seed
 * @property {Number} UserId
 * @property {String} Alias
 * @property {Number} Price
 * @property {Boolean} IsComplete
 */

/**
 * @typedef ParsedAuctionTeam
 * @property {Number} itemId
 * 
 */

/**
 * @function
 * @param {Array<AuctionTeam>} teams 
 * @returns {Array<ParsedAuctionTeam>}
 */
export function parseAuctionTeams(teams) {
  const teamArr = teams.map(teamObj => {
    return {
      itemId: Number(teamObj.ItemId),
      teamLogoUrl: teamObj.TeamLogoUrl,
      itemTypeId: Number(teamObj.ItemTypeId),
      itemName: teamObj.ItemName,
      displayName: teamObj.DisplayName,
      seed: teamObj.Seed,
      owner: Number(teamObj.UserId),
      ownerAlias: teamObj.Alias,
      price: teamObj.Price,
      isComplete: teamObj.IsComplete,
      ...getDisplayType(teamObj.IsComplete, teamObj.Price)
    };
  });

  teamArr.sort((a, b) => {
    // Sort priority:
    //  1. displayOrder
    //  2. lower seed first (if applicable)
    //  3. groups last
    //  4. alphabetical
    return a.displayOrder - b.displayOrder ||
      a.seed - b.seed ||
      b.itemTypeId - a.itemTypeId || // 6 Jan 2023 - these will one of two values: 3 (slot) or 2 (group).
      a.itemName.localeCompare(b.itemName);
  });

  return teamArr;
}

/**
 * @typedef DisplayType
 * @property {String} displayClass
 * @property {Number} displayOrder
 */

/**
 * @function
 * @param {Boolean} isComplete 
 * @param {Number} price
 * @returns {DisplayType} 
 */
function getDisplayType(isComplete, price) {
  let displayClass = 'active';
  let displayOrder = 1;

  if (isComplete && price == 0) {
    displayClass = 'no-sell';
    displayOrder = 3;
  } else if (isComplete && price > 0) {
    displayClass = 'purchased';
    displayOrder = 2;
  }

  return {
    displayClass: displayClass,
    displayOrder: displayOrder
  };
}