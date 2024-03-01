
export function packageLeagueSeedGroups(groups) {
  const seedGroups = [];
  const groupsProcessed = [];

  groups.forEach(groupTeam => {
    const groupName = groupTeam.GroupName;

    if (!groupsProcessed.includes(groupName)) {
      const group = {
        groupId: groupTeam.TournamentSeedGroupId,
        groupName: groupName,
        teams: getSeedGroupTeams(groupTeam.TournamentSeedGroupId, groups)
      };

      seedGroups.push(group);
      groupsProcessed.push(groupName);
    }
  });

  return seedGroups;
}

function getSeedGroupTeams(groupId, teams) {
  const groupTeams = [];

  teams.forEach(team => {
    if (team.TournamentSeedGroupId == groupId) {
      console.log(team);
      const groupTeam = {
        slotId: team.TournamentSlotId,
        teamId: team.TeamId,
        seed: team.Seed,
        teamName: team.TeamName,
        displayName: team.TeamDisplayName
      };

      groupTeams.push(groupTeam);
    }
  });

  return groupTeams;
}