
export const leagueServiceHelper = {
  packageLeagueSummaries: function(data) {
    if (data != null && data.length) {
      let leagues = data.map(league => {
        let buyIn = (league.NaturalBuyIn + league.TaxBuyIn).toFixed(2);
        let netReturn = (league.TotalReturn - buyIn).toFixed(2);

        let leagueObj = {
          id: league.LeagueId,
          name: league.LeagueName,
          tournamentId: league.TournamentId,
          tournamentName: league.TournamentName,
          buyIn: Number(buyIn),
          payout: +league.TotalReturn,
          netReturn: Number(netReturn),
          role: league.Role,
          roleId: league.RoleId
        };
    
        return leagueObj;
      });
    
      return leagues;
    }
    return null;
  },

  extractUserId: function(leagueSummaryData) {
    if (leagueSummaryData != null && leagueSummaryData.length) {
      return +leagueSummaryData[0].UserId;
    }
    return null;
  },

  packageLeagueMetadata: function(metadata) {
    let data = {
      leagueName: metadata.LeagueName,
      numUsers: +metadata.NumUsers,
      prizepool: +metadata.Prizepool,
      myBuyIn: +metadata.MyBuyIn,
      myPayout: +metadata.MyPayout,
      leagueStatusId: metadata.StatusId,
      tournamentId: metadata.TournamentId,
      tournamentName: metadata.TournamentName,
      tournamentRegimeId: metadata.TournamentRegimeId,
      tournamentRegimeName: metadata.TournamentRegimeName,
      roleId: metadata.RoleId,
      roleName: metadata.RoleName
    };

    return data;
  },

  /**
   * Packages league user summary data returned from the API into an array with relevant information. It is sorted in descending order based on the value in the "return" property
   * @function packageLeagueUserInfo
   * @param {Array.<Object>} userSummaries
   * @returns {Array.<{id: Number, name: String, buyIn: Number, payout: Number, return: Number, numTeams: Number, numTeamsAlive: Number, rank: Number}>}
   */
  packageLeagueUserInfo: function(userSummaries) {
    if (userSummaries.length > 0) {
      let users = userSummaries.map(user => {
        return {
          id: user.UserId,
          name: user.Alias,
          buyIn: Number((+user.NaturalBuyIn + +user.TaxBuyIn).toFixed(2)),
          payout: Number((+user.TotalReturn).toFixed(2)),
          return: Number((+user.TotalReturn - +user.NaturalBuyIn - +user.TaxBuyIn).toFixed(2)),
          numTeams: +user.NumTeams,
          numTeamsAlive: +user.NumTeamsAlive
        }
      });

      // sorts the users in descending order based on their net return
      users.sort(function(a, b) { return b.return - a.return });

      // adds a rank property to each user after being sorted
      users.forEach((user, index) => {
        user.rank = index + 1;
      });

      return users;
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
        teamId: team.TeamId,
        name: team.Name,
        seed: team.Seed,
        price: team.Price,
        payout: team.Payout,
        netReturn: team.Payout - team.Price,
        eliminated: team.Eliminated
      };
    });
  
    // sorting the teams in descending order by their net return
    userTeams.sort(function(a, b) { return b.netReturn - a.netReturn });
  
    // adding a tax object to the list of user teams
    if (teams[0].TaxBuyIn > 0) {
      userTeams.push({
        teamId: 0,
        name: 'Tax',
        seed: null,
        price: teams[0].TaxBuyIn,
        payout: 0,
        netReturn: -teams[0].TaxBuyIn
      });
    }
  
    return userTeams;
  },

  parseUserAlias: function(teams) {
    return teams[0].Alias;
  }
}