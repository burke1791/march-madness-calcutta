
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
      logoUrl: game.Team1LogoUrl,
      eliminated: !game.Team1IsAlive,
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
      logoUrl: game.Team2LogoUrl,
      eliminated: !game.Team2IsAlive,
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

/**
 * @typedef WorldCupTableTeam
 * @property {Number} MatchupId
 * @property {String} GroupName
 * @property {Number} TeamId
 * @property {String} TeamName
 * @property {String} [LogoUrl]
 * @property {Number} TeamOwnerUserId
 * @property {String} TeamOwnerName
 * @property {Number} Price
 * @property {Number} Payout
 * @property {Number} Wins
 * @property {Number} Draws
 * @property {Number} Losses
 * @property {Number} [Points]
 * @property {Number} GoalsFor
 * @property {Number} GoalsAgainst
 * @property {Number} [GoalDifferential]
 * @property {Number} [Position]
 * @property {Boolean} IsEliminated
 */

/**
 * @typedef WorldCupGroup
 * @property {String} groupName
 * @property {Array<WorldCupTableTeam>} teams
 */

/**
 * @function
 * @param {Array<WorldCupTableTeam>} teams 
 * @returns {Array<WorldCupGroup>}
 */
export function parseWorldCupTables(teams) {
  const groupNames = [];

  // compute the number of points and goal differential for each team
  // AND get a unique list of all groups
  for (let team of teams) {
    team.Points = Number(team.Wins) * 3 + Number(team.Draws);
    team.GoalDifferential = Number(team.GoalsFor) - Number(team.GoalsAgainst);

    if (groupNames.indexOf(team.GroupName) === -1) groupNames.push(team.GroupName);
  }

  // separate teams into their respective groups
  const groups = [];

  for (let groupName of groupNames) {
    const groupTeams = teams.filter(team => {
      return team.GroupName === groupName;
    });

    // sort the teams by the world cup table rules and tiebreakers
    /* Position Rules
      1. Points
      2. Goal Differential
      3. Most GoalsFor

      ** The database currently does not return sufficient information to evaluate the below rules **
      4. Head-to-head
      5. GD in matches between tied teams
      6. GoalsFor in matches between tied teams
      7. Fair Play (better disciplinary record)
    */
    groupTeams.sort((a, b) => {
      return b.Points - a.Points ||
        b.GoalDifferential - a.GoalDifferential ||
        b.GoalsFor - a.GoalsFor ||
        0;
    });

    let pos = 1;

    for (let groupTeam of groupTeams) {
      groupTeam.Position = pos;
      pos++;
    }

    groups.push({
      groupName: groupName,
      teams: groupTeams
    });
  }

  return groups;
}