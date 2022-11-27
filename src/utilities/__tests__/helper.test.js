
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

  test('negative input', () => {
    let value = -69;

    expect(formatMoney(value)).toBe('-$69.00');
  });

  test('invalid input: object', () => {
    let value = {};

    expect(formatMoney(value)).toBe('$0.00');
  });

  test('commas - no decimal', () => {
    const value = 1000;

    expect(formatMoney(value)).toBe('$1,000');
  });

  test('commas - with decimal', () => {
    const value = 1234.567;

    expect(formatMoney(value)).toBe('$1,234.57');
  });

  test('large commas - no decimal', () => {
    const value = 1234567;

    expect(formatMoney(value)).toBe('$1,234,567');
  });
});