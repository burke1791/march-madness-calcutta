
function parseChatMessage(msgObj) {
  let chatMessage = {
    msgId: msgObj.id,
    userId: msgObj.userId,
    alias: msgObj.alias,
    content: msgObj.content,
    timestamp: msgObj.timestamp
  };

  return [chatMessage];
}


export {
  parseChatMessage
};