
export const tournamentServiceHelper = {
  packageTournamentTree: function(games) {
    return games.map(game => {
      return {
        matchupId: game.MatchupId,
        matchupNum: game.MatchupNum,
        roundNum: getRoundNum(game.MatchupId, games, 1),
        parentMatchupIds: getParentMatchups(game),
        childMatchupId: game.ChildMatchupId,
        teams: getTeams(game)
      }
    });
  }
}

// fix this
function getRoundNum(matchup, games, round) {
  let parentMatchupId = games.find(game => game.MatchupId == matchup).ParentMatchup1;
  
  if (parentMatchupId == undefined || parentMatchupId == null) {
    return round;
  } else {
    return getRoundNum(parentMatchupId, games, round + 1)
  }
}

function getParentMatchups(game) {
  if (game.ParentMatchup1 == null && game.ParentMatchup2 == null) return null;

  return [game.ParentMatchup1, game.ParentMatchup2];
}

function getTeams(game) {
  return [
    {
      teamId: game.Team1Id,
      seed: game.Team1Seed,
      teamName: game.Team1Name,
      displayName: game.Team1DisplayName,
      score: game.Team1Score,
      owner: game.Team1Owner,
      userId: game.Team1OwnerId,
      price: game.Team1Price,
      payout: game.Team1Payout,
      groupId: game.Team1SeedGroupId,
      groupName: game.Team1SeedGroupName
    },
    {
      teamId: game.Team2Id,
      seed: game.Team2Seed,
      teamName: game.Team2Name,
      displayName: game.Team2DisplayName,
      score: game.Team2Score,
      owner: game.Team2Owner,
      userId: game.Team2OwnerId,
      price: game.Team2Price,
      payout: game.Team2Payout,
      groupId: game.Team2SeedGroupId,
      groupName: game.Team2SeedGroupName
    }
  ]
}
