
/**
 * @typedef GroupTeam
 * @property {Number} id
 * @property {String} name
 * @property {Number} [seed]
 * @property {Number} payout
 * @property {Boolean} eliminated
 */

/**
 * @typedef LeagueUserTeam
 * @property {Number} id
 * @property {String} name
 * @property {Boolean} groupFlag
 * @property {Number} [seed]
 * @property {Number} price
 * @property {Number} payout
 * @property {Number} netReturn
 * @property {Boolean} eliminated
 * @property {Array<GroupTeam>} [groupTeams]
 */

/**
 * @function
 * Sorts the teams in descending order based on their netReturn. Groups are always last.
 * @param {Array<LeagueUserTeam>} data
 */
export function parseLeagueUserTeams(data) {
  if (data?.length) {
    data.sort((a, b) => {
      return b.netReturn - a.netReturn;
    });

    return data;
  }

  return [];
}