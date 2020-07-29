
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
  }
}