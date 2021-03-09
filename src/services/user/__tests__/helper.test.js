import { userServiceHelper } from "../helper";


describe('packageUserMetadata', () => {
  test('typical inputs', () => {
    let data = {
      UserId: 1,
      Alias: 'alias',
      Email: 'email',
      Created: '2020-01-09 00:00:00',
      PermissionId: 2,
      PermissionName: 'permission',
      LifetimeBuyIn: 2.50,
      LifetimeTax: 1.25,
      LifetimePayout: 3.12
    };

    let expected = {
      userId: 1,
      alias: 'alias',
      email: 'email',
      created: new Date('2020-01-09 00:00:00'),
      permissionId: 2,
      permissionName: 'permission',
      lifetimeBuyIn: 2.50,
      lifetimeTax: 1.25,
      lifetimePayout: 3.12
    };

    expect(userServiceHelper.packageUserMetadata(data)).toEqual(expected);
  });
});