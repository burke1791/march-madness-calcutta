
/**
 * @typedef LeagueUser
 * @property {Number} userId
 * @property {String} alias
 * @property {Number} naturalBuyIn
 * @property {Number} taxBuyIn
 * @property {Number} totalReturn
 * @property {Number} numTeams
 * @property {Number} numTeamsAlive
 * @property {Number} roleId
 * @property {String} role
 */

/**
 * @typedef LeagueUserSummaries
 * @property {Number} leagueId
 * @property {String} leagueName
 * @property {Number} tournamentId
 * @property {String} tournamentName
 * @property {Number} leagueStatusId
 * @property {String} leagueStatus
 * @property {Array<LeagueUser>} leagueUsers
 */

/**
 * @typedef RankedLeagueUser
 * @property {Number} userId
 * @property {String} alias
 * @property {Number} naturalBuyIn
 * @property {Number} taxBuyIn
 * @property {Number} totalReturn
 * @property {Number} numTeams
 * @property {Number} numTeamsAlive
 * @property {Number} roleId
 * @property {String} role
 * @property {String} name
 * @property {Number} buyIn
 * @property {Number} payout
 * @property {Number} return
 * @property {Number} rank
 */

/**
 * @function
 * @param {LeagueUserSummaries} data 
 * @returns {Array<RankedLeagueUser>}
 */
export function parseLeagueUserSummaries(data) {
  if (data?.leagueUsers.length > 0) {
    data.leagueUsers.forEach(user => {
      user.buyIn = Number((user.naturalBuyIn + user.taxBuyIn).toFixed(2));
      user.payout = Number(user.totalReturn.toFixed(2));
      user.return = Number((user.totalReturn - user.buyIn).toFixed(2));
      user.name = user.alias;
    });

    data.leagueUsers.sort(function(a, b) { return b.return - a.return });

    data.leagueUsers.forEach((user, index) => {
      user.rank = index + 1;
    });

    return data.leagueUsers;
  }

  return null;
}