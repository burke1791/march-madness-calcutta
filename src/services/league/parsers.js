
export const tournamentOptionsParser = (data) => {
  let tournaments = [...data[0]];
  let tournamentScopes = [...data[1]];

  return [tournaments, tournamentScopes];
}