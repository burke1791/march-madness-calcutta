
/**
 * @typedef LeagueRole
 * @property {Number} RoleId
 * @property {String} RoleName
 */

/**
 * @typedef RosterUser
 * @property {Number} LeagueId
 * @property {Number} LeagueStatusId
 * @property {String} LeagueStatusName
 * @property {Number} UserId
 * @property {String} Username
 * @property {Number} RoleId
 * @property {String} RoleName
 * @property {Number} NumTeams
 * @property {Boolean} IsCurrentUser
 * @property {Array<LeagueRole>} AllowedRoles - roles the "CurrentUser" is allowed to set for UserId
 */

/**
 * @function
 * @param {Array<RosterUser>} roster 
 */
export function sortRoster(roster) {

  return roster.sort((a, b) => {
    const a_u = a.Username.toLowerCase();
    const b_u = b.Username.toLowerCase();

    if (a_u < b_u) return -1
    if (a_u > b_u) return 1;
    return 0;
  });
}