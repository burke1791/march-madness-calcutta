
/**
 * @typedef LeagueTeamPayout
 * @property {Number} LeagueId
 * @property {Number} TeamId
 * @property {String} TeamName
 * @property {Number} UserId
 * @property {String} Username
 * @property {Number} LeagueTeamPayoutId
 * @property {Number} UpdatedByUserId
 * @property {String} UpdatedByUsername
 * @property {String} UpdatedOn
 * @property {Number} PayoutAmount
 * @property {String} PayoutDescription
 */

/**
 * @typedef Payout
 * @property {Number} LeagueTeamPayoutId
 * @property {Number} UpdatedByUserId
 * @property {String} UpdatedByUsername
 * @property {String} UpdatedOn
 * @property {Number} PayoutAmount
 * @property {String} PayoutDescription
 */

/**
 * @typedef LeagueTeamWithPayouts
 * @property {Number} LeagueId
 * @property {Number} TeamId
 * @property {String} TeamName
 * @property {Number} UserId
 * @property {String} Username
 * @property {Number} totalPayout
 * @property {Array<Payout>} payouts
 */

/**
 * @function
 * @param {Array<LeagueTeamPayout>} payouts 
 * @returns {Array<LeagueTeamWithPayouts>}
 */
export function parseLeagueTeamPayouts(payouts) {
  const teams = [];

  payouts.forEach(payout => {
    const teamId = payout.TeamId;
    const existingTeamId = teams.find(team => team.TeamId === teamId)?.TeamId;

    // add team to array if it doesn't already exist
    if (!existingTeamId) {
      teams.push({
        TeamId: payout.TeamId,
        TeamName: payout.TeamName,
        UserId: payout.UserId,
        Username: payout.Username
      });
    }
  });

  // add each team's payout history to the array
  for (let team of teams) {
    const teamPayouts = payouts.filter(payout => {
      return payout.TeamId === team.TeamId;
    });

    let totalPayout = 0;

    const payoutArr = teamPayouts.map(tp => {
      totalPayout += tp.PayoutAmount;

      return {
        LeagueTeamPayoutId: tp.LeagueTeamPayoutId,
        UpdatedByUserId: tp.UpdatedByUserId,
        UpdatedByUsername: tp.UpdatedByUsername,
        UpdatedOn: tp.UpdatedOn,
        PayoutAmount: tp.PayoutAmount,
        PayoutDescription: tp.PayoutDescription
      }
    });

    team.totalPayout = totalPayout;
    team.payouts = payoutArr;
  }

  teams.sort((a, b) => {
    if (a.TeamName.toLowerCase() < b.TeamName.toLowerCase()) return -1;
    if (a.TeamName.toLowerCase() > b.TeamName.toLowerCase()) return 1;
    return 0;
  })

  return teams;
}