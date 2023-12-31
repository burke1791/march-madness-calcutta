
/**
 * @typedef ChatMessage
 * @property {Number} LeagueId
 * @property {Number} UserId
 * @property {String} Alias
 * @property {String} MessageId
 * @property {Number} Timestamp
 * @property {String} Content
 */

/**
 * @typedef ParsedChatMessage
 * @property {Number} msgId
 * @property {Number} userId
 * @property {String} alias
 * @property {String} content
 * @property {Number} timestamp
 */

/**
 * @function
 * @param {Array<ChatMessage>} data 
 * @returns {Array<ParsedChatMessage>}
 */
export function parseAuctionChatMessages(data) {
  if (data && data.length) {
    return data.map(m => {
      return {
        msgId: m.MessageId,
        userId: m.UserId,
        alias: m.Alias,
        content: m.Content,
        timestamp: m.Timestamp
      }
    });
  }

  return [];
}