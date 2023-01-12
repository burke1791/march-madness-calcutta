
/**
 * @typedef AuctionSummary
 * @property {Number} LeagueId
 * @property {Number} NaturalBuyIn
 * @property {Number} TaxBuyIn
 * @property {Number} Prizepool
 */

/**
 * @typedef ParsedAuctionSummary
 * @property {Number} [leagueId]
 * @property {Number} [naturalBuyIn]
 * @property {Number} [taxBuyIn]
 * @property {Number} [prizepool]
 */

/**
 * @function
 * @param {Array<AuctionSummary>} data 
 * @returns {ParsedAuctionSummary}
 */
export function parseAuctionSummary(data) {
  if (data.length != 1) {
    console.error('Unexpected AuctionSummary data');
  }

  const summary = data[0];

  const parsedSummary = {
    leagueId: null,
    naturalBuyIn: 0,
    taxBuyIn: 0,
    prizepool: 0
  };

  if (summary.LeagueId) parsedSummary.leagueId = Number(summary.LeagueId);
  if (summary.NaturalBuyIn) parsedSummary.naturalBuyIn = Number(summary.NaturalBuyIn);
  if (summary.TaxBuyIn) parsedSummary.taxBuyIn = Number(summary.TaxBuyIn);
  if (summary.Prizepool) parsedSummary.prizepool = Number(summary.Prizepool);

  return parsedSummary;
}