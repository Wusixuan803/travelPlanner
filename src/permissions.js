export const USER_ROLES = {
  GUEST: "guest",
  USER: "user",
  ADMIN: "admin",
};

export const PERMISSIONS = {
  VIEW_TRIPS: [USER_ROLES.USER, USER_ROLES.ADMIN],
  MANAGE_TRIPS: [USER_ROLES.USER, USER_ROLES.ADMIN],
  VIEW_STATS: [USER_ROLES.ADMIN], 
};

export function hasPermission(userRole, permission) {
  return permission.includes(userRole);
}
