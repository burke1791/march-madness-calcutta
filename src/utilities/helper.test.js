
describe('utilities/helper', () => {

  test('teamDisplayName typical inputs', () => {
    const teamDisplayName = require('./helper').teamDisplayName;
  
    let name = 'Test Name';
    let seed = 5;

    expect(teamDisplayName(name, seed)).toBe('(5) Test Name');
  });
});