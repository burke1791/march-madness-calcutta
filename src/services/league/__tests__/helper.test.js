import { leagueServiceHelper } from "../helper";

describe('packageLeagueSummaries', () => {
  test('typical inputs', () => {
    let data = [
      {
        LeagueId: 1,
        LeagueName: 'test league',
        TournamentId: 2,
        TournamentName: 'test tournament',
        NaturalBuyIn: 1.23,
        TaxBuyIn: 2.34,
        TotalReturn: 0.12,
        RoleId: 3,
        Role: 'test role'
      },
      {
        LeagueId: 2,
        LeagueName: 'test league 2',
        TournamentId: 3,
        TournamentName: 'test tournament 2',
        NaturalBuyIn: 4.56,
        TaxBuyIn: 0.15,
        TotalReturn: 2.12,
        RoleId: 1,
        Role: 'test role 2'
      }
    ];

    let expected = [
      {
        id: 1,
        name: 'test league',
        tournamentId: 2,
        tournamentName: 'test tournament',
        buyIn: 3.57,
        payout: 0.12,
        netReturn: -3.45,
        role: 'test role',
        roleId: 3
      },
      {
        id: 2,
        name: 'test league 2',
        tournamentId: 3,
        tournamentName: 'test tournament 2',
        buyIn: 4.71,
        payout: 2.12,
        netReturn: -2.59,
        role: 'test role 2',
        roleId: 1
      }
    ];

    expect(leagueServiceHelper.packageLeagueSummaries(data)).toEqual(expected);
  });
});

describe('extractUserId', () => {
  test('typical inputs', () => {
    let data = [
      {
        LeagueId: 1,
        UserId: 1
      },
      {
        LeagueId: 2,
        UserId: 1
      }
    ];

    let expected = 1

    expect(leagueServiceHelper.extractUserId(data)).toBe(expected);
  });
});

describe('packageLeagueMetadata', () => {

  test('typical inputs', () => {
    let data = {
      LeagueId: 1,
      LeagueName: 'league name',
      NumUsers: 3,
      Prizepool: 2.56,
      MyBuyIn: 1.12,
      MyPayout: 0,
      StatusId: 2,
      Name: 'status name',
      TournamentId: 3,
      TournamentName: 'tournament name',
      TournamentRegimeId: 4,
      TournamentRegimeName: 'tournament regime name',
      RoleId: 5,
      RoleName: 'role name'
    };

    let expected = {
      leagueName: 'league name',
      numUsers: 3,
      prizepool: 2.56,
      myBuyIn: 1.12,
      myPayout: 0,
      leagueStatusId: 2,
      tournamentId: 3,
      tournamentName: 'tournament name',
      tournamentRegimeId: 4,
      tournamentRegimeName: 'tournament regime name',
      roleId: 5,
      roleName: 'role name'
    };

    expect(leagueServiceHelper.packageLeagueMetadata(data)).toEqual(expected);
  });
});

describe('packageLeagueUserInfo', () => {

  test('typical inputs', () => {
    let data = [
      {
        LeagueId: 1,
        Name: 'test name',
        TournamentId: 2,
        TournamentName: 'test tournament name',
        StatusId: 3,
        Status: 'status name',
        UserId: 4,
        Alias: 'username',
        NaturalBuyIn: 1.23,
        TaxBuyIn: 0,
        TotalReturn: 0,
        NumTeams: 1,
        NumTeamsAlive: 1,
        RoleId: 1,
        Role: 'role'
      },
      {
        LeagueId: 1,
        Name: 'test name',
        TournamentId: 2,
        TournamentName: 'test tournament name',
        StatusId: 3,
        Status: 'status name',
        UserId: 5,
        Alias: 'username2',
        NaturalBuyIn: 3.45,
        TaxBuyIn: 1.23,
        TotalReturn: 0.12,
        NumTeams: 2,
        NumTeamsAlive: 2,
        RoleId: 3,
        Role: 'role2'
      }
    ];

    let expected = [
      {
        id: 4,
        name: 'username',
        buyIn: 1.23,
        payout: 0,
        return: -1.23,
        numTeams: 1,
        numTeamsAlive: 1,
        rank: 1
      },
      {
        id: 5,
        name: 'username2',
        buyIn: 4.68,
        payout: 0.12,
        return: -4.56,
        numTeams: 2,
        numTeamsAlive: 2,
        rank: 2
      }
    ];

    expect(leagueServiceHelper.packageLeagueUserInfo(data)).toEqual(expected);
  });
});