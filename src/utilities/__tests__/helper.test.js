
import { formatMoney, teamDisplayName } from '../helper';

describe('teamDisplayName', () => {

  test('typical inputs', () => {
    let name = 'Test Name';
    let seed = 5;

    expect(teamDisplayName(name, seed)).toBe('(5) Test Name');
  });
});

describe('formatMoney', () => {
  test('typical input', () => {
    let value = 100;

    expect(formatMoney(value)).toBe('$100.00');
  });
});