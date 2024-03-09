
// export const auctionServiceHelper = {
//   updateServerPing: function(pingObj) {
//     let serverTime = new Date(pingObj).valueOf();
//     let local = Date.now();

//     return serverTime - local;
//   },

//   packageChatMessages: function(messages) {
//     const msgArr = messages.map(msgObj => {
//       let chatMessage = {
//         msgId: msgObj.MessageId,
//         userId: msgObj.UserId,
//         alias: msgObj.Alias,
//         content: msgObj.Content,
//         timestamp: msgObj.Timestamp
//       };
  
//       return chatMessage;
//     });
  
//     return msgArr;
//   },

//   parseAuctionStatus: function(data) {
//     console.log(data);
//     if (Array.isArray(data)) {
//       return {
//         status: data[0].Status,
//         currentItemId: data[0].CurrentItemId,
//         teamLogoUrl: data[0].TeamLogoUrl,
//         itemTypeId: data[0].ItemTypeId,
//         itemName: data[0].ItemName,
//         itemSeed: data[0].Seed,
//         displayName: data[0].DisplayName,
//         price: +data[0].CurrentItemPrice,
//         winnerId: data[0].CurrentItemWinner,
//         winnerAlias: data[0].Alias,
//         lastBid: isNaN(+data[0].LastBidTimestamp) ? new Date(data[0].LastBidTimestamp) : new Date(+data[0].LastBidTimestamp),
//         errorMessage: null
//       };
//     }

//     return {};
//   },

//   updateAuctionStatus: function(status) {
//     return {
//       status: status.Status,
//       currentItemId: status.CurrentItemId,
//       teamLogoUrl: status.TeamLogoUrl,
//       itemTypeId: status.ItemTypeId,
//       itemName: status.ItemName,
//       itemSeed: status.Seed,
//       displayName: status.DisplayName,
//       price: +status.CurrentItemPrice,
//       winnerId: status.CurrentItemWinner,
//       winnerAlias: status.Alias,
//       lastBid: isNaN(+status.LastBidTimestamp) ? new Date(status.LastBidTimestamp) : new Date(+status.LastBidTimestamp),
//       errorMessage: null
//     };
//   },

//   packageUserBuyIns: function(users) {
//     const buyInArr = users.map(userObj => {
//       let user = {
//         leagueId: +userObj.LeagueId,
//         userId: +userObj.UserId,
//         alias: userObj.Alias,
//         naturalBuyIn: userObj.NaturalBuyIn,
//         taxBuyIn: userObj.TaxBuyIn,
//         totalBuyIn: +(userObj.NaturalBuyIn + userObj.TaxBuyIn).toFixed(2)
//       };
  
//       return user;
//     });
  
//     return buyInArr;
//   },

//   packageAuctionTeams: function(teams) {
//     const teamArr = teams.map(teamObj => {
//       let team = {
//         itemId: Number(teamObj.ItemId),
//         teamLogoUrl: teamObj.TeamLogoUrl,
//         itemTypeId: Number(teamObj.ItemTypeId),
//         itemName: teamObj.ItemName,
//         displayName: teamObj.DisplayName,
//         seed: teamObj.Seed,
//         owner: Number(teamObj.UserId),
//         price: teamObj.Price,
//         isComplete: teamObj.IsComplete
//       };
  
//       return team;
//     });
  
//     return teamArr;
//   }
// };