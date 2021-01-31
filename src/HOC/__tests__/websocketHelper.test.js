
import { parseChatMessage } from '../websocketHelper';

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

    expect(parseChatMessage(msgObj)).toMatchObject(expected);
  });
})