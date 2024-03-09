
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
  if (!teams?.length) return [];
  
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
      ...getDisplayType(teamObj.IsComplete, teamObj.Price, teamObj.Seed)
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

export function parseAuctionTeamsNew(teams) {
  if (!teams?.length) return [];

  const teamArr = teams.map(t => {
    return {
      itemId: +t.itemId,
      teamLogoUrl: t.teamLogoUrl,
      itemTypeId: +t.itemTypeId,
      itemName: t.itemName,
      displayName: t.displayName,
      seed: +t.seed,
      owner: t.userId,
      ownerAlias: t.alias,
      price: t.price,
      isComplete: t.price !== null,
      ...getDisplayType(t.price !== null, t.price, t.seed)
    };
  });

  teamArr.sort((a, b) => {
    return a.displayOrder - b.displayOrder ||
      a.seed - b.seed ||
      b.itemTypeId - a.itemTypeId ||
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
 * @param {Number} [seed]
 * @returns {DisplayType} 
 */
function getDisplayType(isComplete, price, seed) {
  let displayClass = 'active';
  let displayOrder = 1;

  if (seed === null) displayOrder = 2;

  if (isComplete && price == 0) {
    displayClass = 'no-sell';
    displayOrder = 4;
  } else if (isComplete && price > 0) {
    displayClass = 'purchased';
    displayOrder = 3;
  }

  return {
    displayClass: displayClass,
    displayOrder: displayOrder
  };
}