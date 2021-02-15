
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
    let userTeams = [];
    let groups = [];
    let groupsProcessed = [];

    // fill in group records
    teams.forEach(teamObj => {
      let groupName = teamObj.GroupName;

      // if the team is part of a group AND that group hasn't already been handled
      if (groupName != null && !groupsProcessed.includes(groupName)) {
        let groupPayout = getGroupPayout(teams, teamObj.GroupId);
        let groupNetReturn = groupPayout - teamObj.Price;
        
        let groupObj = {
          id: teamObj.GroupId,
          name: groupName,
          groupFlag: true,
          price: teamObj.Price,
          payout: groupPayout,
          netReturn: groupNetReturn,
          eliminated: teamGroupEliminated(teams, teamObj.GroupId),
          groupTeams: getGroupTeams(teams, teamObj.GroupId)
        };

        groupsProcessed.push(groupName)

        groups.push(groupObj);
      } else if (groupName == null) {
        let team = {
          id: teamObj.TeamId,
          name: teamObj.Name,
          groupFlag: false,
          seed: teamObj.Seed,
          price: teamObj.Price,
          payout: teamObj.Payout,
          netReturn: teamObj.Payout - teamObj.Price,
          eliminated: !teamObj.IsAlive
        };

        userTeams.push(team);
      }
    });
  
    // sorting the teams in descending order by their net return
    userTeams.sort(function(a, b) { return b.netReturn - a.netReturn });
    groups.sort(function(a, b) { return b.netReturn - a.netRedurt });
  
    // merge the userTeams and groups arrays
    return [...userTeams, ...groups];
  }
}

function getGroupPayout(teams, groupId) {
  return teams.reduce((payout, teamObj) => {
    if (teamObj.GroupId === groupId) {
      return payout + teamObj.Payout;
    }
    return payout;
  }, 0);
}

function teamGroupEliminated(teams, groupId) {
  let eliminated = true;

  teams.forEach(teamObj => {
    if (teamObj.GroupId === groupId) {
      if (!!teamObj.IsAlive) {
        eliminated = false;
      }
    }
  });

  return eliminated;
}

function getGroupTeams(teams, groupId) {
  let groupTeams = [];

  teams.forEach(teamObj => {
    if (teamObj.GroupId === groupId) {
      let groupTeam = {
        id: teamObj.TeamId,
        name: teamObj.Name,
        seed: teamObj.Seed,
        price: null,
        payout: teamObj.Payout,
        netReturn: null,
        eliminated: !teamObj.IsAlive
      };

      groupTeams.push(groupTeam);
    }
  });

  // sort in descending order by payout
  groupTeams.sort((a, b) => { return b.payout - a.payout });

  return groupTeams;
}

export {
  getGroupPayout,
  teamGroupEliminated,
  getGroupTeams
}