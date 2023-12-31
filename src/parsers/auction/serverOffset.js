
/**
 * @typedef ServerPing
 * @property {Number} ServerTimestamp
 */

/**
 * @function
 * @param {Array<ServerPing>} data 
 * @returns {Number}
 */
export function parseServerOffset(data) {
  const serverTime = new Date(data[0].ServerTimestamp).valueOf();
  const local = Date.now();

  return serverTime - local;
}