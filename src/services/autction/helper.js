import Pubsub from '../../utilities/pubsub';
import { NOTIF } from '../../utilities/constants';

export const auctionServiceHelper = {
  updateServerPing: function(pingObj) {
    let serverTime = new Date(pingObj).valueOf();
    let local = Date.now();

    let offset = serverTime - local;
    
    Pubsub.publish(NOTIF.SERVER_SYNCED, offset);
  },

  packageChatMessages: function(messages) {
    const msgArr = messages.map(msgObj => {
      let chatMessage = {
        msgId: msgObj.id,
        userId: msgObj.userId,
        alias: msgObj.alias,
        content: msgObj.content,
        timestamp: msgObj.timestamp
      };
  
      return chatMessage;
    });
  
    return msgArr;
  },

  updateAuctionStatus: function(status) {
    return {
      status: status.status,
      current: {
        itemId: status.currentItemId,
        itemName: status.name,
        itemSeed: status.seed,
        price: status.currentItemPrice,
        winnerId: status.currentItemWinner,
        winnerAlias: status.alias,
        lastBid: new Date(status.lastBidTimestamp)
      }
    };
  },

  packageUserBuyIns: function(users) {
    const buyInArr = users.map(userObj => {
      let user = {
        userId: +userObj.userId,
        alias: userObj.alias,
        naturalBuyIn: userObj.naturalBuyIn,
        taxBuyIn: userObj.taxBuyIn,
        totalBuyIn: userObj.naturalBuyIn + userObj.taxBuyIn
      };
  
      return user;
    });
  
    return buyInArr;
  },

  packageAuctionTeams: function(teams) {
    const teamArr = teams.map(teamObj => {
      let team = {
        teamId: Number(teamObj.id),
        price: teamObj.price,
        displayName: teamObj.seed ? `(${teamObj.seed}) ${teamObj.name}` : teamObj.name,
        name: teamObj.name,
        seed: teamObj.seed,
        owner: Number(teamObj.userId)
      };
  
      return team;
    });
  
    return teamArr;
  }
};