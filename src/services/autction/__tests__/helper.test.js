import { auctionServiceHelper } from '../helper';

describe('updateAuctionStatus', () => {

  test('typical input', () => {
    let statusObj = {
      Status: 'initial',
      CurrentItemId: 1,
      ItemTypeId: 1,
      ItemName: 'test name',
      Seed: null,
      DisplayName: 'test name',
      CurrentItemPrice: 3.12,
      CurrentItemWinner: 1,
      Alias: 'alias',
      LastBidTimestamp: new Date('1-1-2020')
    };

    let expected = {
      status: 'initial',
      currentItemId: 1,
      itemTypeId: 1,
      itemName: 'test name',
      itemSeed: null,
      displayName: 'test name',
      price: 3.12,
      winnerId: 1,
      winnerAlias: 'alias',
      lastBid: new Date('1-1-2020'),
      errorMessage: null
    };

    expect(auctionServiceHelper.updateAuctionStatus(statusObj)).toEqual(expected);
  });
});

describe('packageUserBuyIns', () => {
  
  test('typical input', () => {
    let buyIns = [
      {
        Alias: 'test',
        LeagueId: '1',
        NaturalBuyIn: 69.12,
        TaxBuyIn: 12.01,
        UserId: '1'
      }
    ];

    let expected = [
      {
        alias: 'test',
        leagueId: 1,
        naturalBuyIn: 69.12,
        taxBuyIn: 12.01,
        totalBuyIn: 81.13,
        userId: 1
      }
    ];

    expect(auctionServiceHelper.packageUserBuyIns(buyIns)).toEqual(expected);
  });
});

describe('packageAuctionTeams', () => {

  test('typical input', () => {
    let teams = [
      {
        ItemId: '1',
        ItemName: 'test name',
        ItemTypeId: 1,
        ItemTypeName: 'test type name',
        DisplayName: '(1) test name',
        Price: null,
        Seed: 1,
        UserId: null
      },
      {
        ItemId: '2',
        ItemName: 'test name2',
        ItemTypeId: 2,
        ItemTypeName: 'test type name2',
        DisplayName: 'test name2',
        Price: 3.69,
        Seed: null,
        UserId: 2
      }
    ];

    let expected = [
      {
        itemId: 1,
        itemTypeId: 1,
        itemName: 'test name',
        displayName: '(1) test name',
        seed: 1,
        owner: 0,
        price: null
      },
      {
        itemId: 2,
        itemTypeId: 2,
        itemName: 'test name2',
        displayName: 'test name2',
        seed: null,
        owner: 2,
        price: 3.69
      }
    ];

    expect(auctionServiceHelper.packageAuctionTeams(teams)).toEqual(expected);
  });
});