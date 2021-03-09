
export const userServiceHelper = {
  packageUserMetadata: function(data) {
    return {
      userId: data.UserId,
      alias: data.Alias,
      email: data.Email,
      created: new Date(data.Created),
      permissionId: data.PermissionId,
      permissionName: data.PermissionName,
      lifetimeBuyIn: data.LifetimeBuyIn,
      lifetimeTax: data.LifetimeTax,
      lifetimePayout: data.LifetimePayout
    };
  }
}