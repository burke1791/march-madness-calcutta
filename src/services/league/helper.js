
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
  },

  packageBracketGames: function(games) {
    return games.map(game => {
      // refactor to account for no seeds, etc.
      return {
        gameId: game.gameId,
        nextGameId: game.nextGameId,
        team1Id: game.team1Id,
        team1Name: game.team1Id == null ? null : `(${game.team1Seed}) ${game.team1Name}`,
        team1Score: game.team1Score,
        team2Id: game.team2Id,
        team2Name: game.team2Id == null ? null : `(${game.team2Seed}) ${game.team2Name}`,
        team2Score: game.team2Score
      };
    });
  },

  packageUserTeams: function(teams) {
    const userTeams = teams.map(team => {
      return {
        teamId: team.teamId,
        name: team.name,
        seed: team.seed,
        price: team.price,
        payout: team.payout,
        netReturn: team.payout - team.price,
        eliminated: !team.alive
      };
    });
  
    // sorting the teams in descending order by their net return
    userTeams.sort(function(a, b) { return b.netReturn - a.netReturn });
  
    // adding a tax object to the list of user teams
    if (teams[0].taxBuyIn > 0) {
      userTeams.push({
        teamId: 0,
        name: 'Tax',
        seed: null,
        price: teams[0].taxBuyIn,
        payout: 0,
        netReturn: -teams[0].taxBuyIn
      });
    }
  
    return userTeams;
  },

  parseUserAlias: function(teams) {
    return teams[0].alias;
  }
}