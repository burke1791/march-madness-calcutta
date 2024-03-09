
/**
 * @typedef LeagueSummary
 * @property {Number} userId
 * @property {Number} leagueId
 * @property {String} leagueName
 * @property {Boolean} isDeleted
 * @property {Number} statusId
 * @property {String} leagueStatus
 * @property {Number} tournamentId
 * @property {String} tournamentName
 * @property {Number} tournamentRegimeId
 * @property {String} tournamentRegimeName
 * @property {Number} roleId
 * @property {String} role
 * @property {Number} naturalBuyIn
 * @property {Number} taxBuyIn
 * @property {Number} totalReturn
 */

/**
 * @typedef LeagueSummaryObj
 * @property {Array<LeagueSummary>} active
 * @property {Array<LeagueSummary>} inactive
 */

/**
 * @typedef ParsedLeagueSummary
 * @property {Number} id
 * @property {String} name
 * @property {Number} tournamentId
 * @property {String} tournamentName
 * @property {Number} buyIn
 * @property {Number} payout
 * @property {Number} netReturn
 * @property {Number} roleId
 * @property {String} role
 */

/**
 * @typedef ParsedLeagueSummaryObj
 * @property {Array<ParsedLeagueSummary>} active
 * @property {Array<ParsedLeagueSummary>} inactive
 */

/**
 * @function
 * @param {LeagueSummaryObj} data 
 * @returns {ParsedLeagueSummaryObj}
 */
export function parseLeagueSummaries(data) {
  const parsedData = {
    active: [],
    inactive: []
  };

  console.log(data);
  if (data && data?.active.length) {
    parsedData.active = data.active.map(l => {
      const buyIn = Number((l.naturalBuyIn + l.taxBuyIn).toFixed(2));

      return {
        id: l.leagueId,
        name: l.leagueName,
        tournamentId: l.tournamentId,
        tournamentName: l.tournamentName,
        buyIn: buyIn,
        payout: Number(l.totalReturn),
        netReturn: Number((l.totalReturn - buyIn).toFixed(2)),
        role: l.role,
        roleId: l.roleId
      }
    });
  }

  if (data && data?.inactive.length) {
    parsedData.inactive = data.inactive.map(l => {
      const buyIn = Number((l.naturalBuyIn + l.taxBuyIn).toFixed(2));

      return {
        id: l.leagueId,
        name: l.leagueName,
        tournamentId: l.tournamentId,
        tournamentName: l.tournamentName,
        buyIn: buyIn,
        payout: Number(l.totalReturn),
        netReturn: Number((l.totalReturn - buyIn).toFixed(2)),
        role: l.role,
        roleId: l.roleId
      }
    });
  }

  return parsedData;
}