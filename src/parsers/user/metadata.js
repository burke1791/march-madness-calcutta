
/**
 * @typedef UserMetadata
 * @property {Number} UserId
 * @property {String} Alias
 * @property {String} Email
 * @property {Number} PermissionId
 * @property {String} PermissionName
 * @property {Number} LifetimeBuyIn
 * @property {Number} LifetimeTax
 * @property {Number} LifetimePayout
 */

/**
 * @typedef ParsedUserMetadata
 * @property {Number} userId
 * @property {String} alias
 * @property {String} email
 * @property {Date} created
 * @property {Number} permissionId
 * @property {String} permissionName
 * @property {Number} lifetimeBuyIn
 * @property {Number} lifetimeTax
 * @property {Number} lifetimePayout
 */

/**
 * @function
 * @param {Array<UserMetadata>} data
 * @returns {ParsedUserMetadata} 
 */
export function parseUserMetadata(data) {
  if (data && data.length) {
    return {
      userId: data[0].UserId,
      alias: data[0].Alias,
      email: data[0].Email,
      created: new Date(data[0].Created),
      permissionId: data[0].PermissionId,
      permissionName: data[0].PermissionName,
      lifetimeBuyIn: data[0].LifetimeBuyIn,
      lifetimeTax: data[0].LifetimeTax,
      lifetimePayout: data[0].LifetimePayout
    };
  }

  return null;
}