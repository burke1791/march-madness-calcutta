
export const leagueServiceHelper = {
  packageLeagueSummaries: function(data) {
    if (data != null && data.length) {
      let leagues = data.map(league => {
        let leagueObj = {
          id: league.leagueId,
          name: league.name,
          tournamentId: league.tournamentId,
          tournamentName: league.tournamentName,
          buyIn: league.naturalBuyIn + league.taxBuyIn,
          payout: league.totalReturn,
          role: league.role,
          roleId: league.roleId,
          auctionId: league.auctionId
        };
    
        return leagueObj;
      });
    
      return leagues;
    }
    return null;
  },

  extractUserId: function(leagueSummaryData) {
    if (leagueSummaryData != null && leagueSummaryData.length) {
      return +leagueSummaryData[0].userId;
    }
    return null;
  },

  packageLeagueInfo: function(userSummaries) {
    if (userSummaries.length) {
      let leagueInfo = {
        name: userSummaries[0].name,
        tournamentName: userSummaries[0].tournamentName,
        auctionId: userSummaries[0].auctionId,
        status: userSummaries[0].status,
        users: []
      };
  
      leagueInfo.users = userSummaries.map(user => {
        return {
          id: user.userId,
          key: user.userId,
          name: user.alias,
          buyIn: user.naturalBuyIn + user.taxBuyIn,
          payout: user.totalReturn,
          return: user.totalReturn - user.naturalBuyIn - user.taxBuyIn,
          numTeams: user.numTeams,
          numTeamsAlive: user.numTeamsAlive
        };
      });
  
      // sorts the users in descending order by their net return
      leagueInfo.users.sort(function(a, b) { return b.return - a.return });
  
      // adds a rank property to each user after being sorted
      // and formats the money value into a friendlier string representation
      leagueInfo.users.forEach((user, index) => {
        user.rank = index + 1;
      });
  
      return leagueInfo;
    }
    return null;
  },

  packageUpcomingGames: function(games) {
    if (games.length) {
      let upcomingGames = games.map(game => {
        return game;
      });
  
      return upcomingGames;
    }
  
    return null;
  }
}