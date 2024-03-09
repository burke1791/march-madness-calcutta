
export function tournamentOptionsParser(data) {
  // stopgap until I decide to implement more robust error messages
  if (data?.message == 'ERROR!') {
    return [[], []];
  }

  let tournaments = [...data[0]];
  let tournamentScopes = [...data[1]];

  return [tournaments, tournamentScopes];
}