
import { parseAuctionMessage, parseChatMessage } from '../websocketHelper';

describe('parseChatMessage', () => {

  test('typical inputs', () => {
    let msgObj = {
      Id: 1,
      UserId: 1,
      Alias: 'testUser',
      Content: 'test message',
      Timestamp: '2021-01-31T16:25:10.000Z'
    };

    let expected = {
      msgId: 1,
      userId: 1,
      alias: 'testUser',
      content: 'test message',
      timestamp: '2021-01-31T16:25:10.000Z'
    };

    expect(parseChatMessage(msgObj)).toEqual(expected);
  });
});

describe('parseAuctionMessage', () => {

  test('typical inputs', () => {
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

    expect(parseAuctionMessage(statusObj)).toEqual(expected);
  });
});