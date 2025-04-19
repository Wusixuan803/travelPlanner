// export const USER_ROLES = {
//   GUEST: 'guest',
//   USER: 'user',
//   ADMIN: 'admin'
// };

// export const PREDEFINED_USERS = {
//   'admin': USER_ROLES.ADMIN,
//   'user1': USER_ROLES.USER,
//   'dog': USER_ROLES.GUEST
// };

// export const PERMISSIONS = {
//   VIEW_TRIPS: [USER_ROLES.USER, USER_ROLES.ADMIN],
//   MANAGE_TRIPS: [USER_ROLES.USER, USER_ROLES.ADMIN],
//   DELETE_ANY_TRIP: [USER_ROLES.ADMIN],
//   VIEW_STATS: [USER_ROLES.ADMIN]
// };

// export function hasPermission(userRole, permission) {
//   return permission.includes(userRole);
// }

// export function getUserRole(username) {
//   if (PREDEFINED_USERS[username]) {
//     return PREDEFINED_USERS[username];
//   }
//   return USER_ROLES.USER;
// }
export const USER_ROLES = {
  GUEST: 'guest',
  USER: 'user',
  ADMIN: 'admin'
};

export const PREDEFINED_USERS = {
  'admin': USER_ROLES.ADMIN,
  'user1': USER_ROLES.USER,
  'dog': USER_ROLES.GUEST
};

export const PERMISSIONS = {
  VIEW_TRIPS: [USER_ROLES.USER, USER_ROLES.ADMIN],
  MANAGE_TRIPS: [USER_ROLES.USER, USER_ROLES.ADMIN],
  VIEW_STATS: [USER_ROLES.ADMIN]
};

export function hasPermission(userRole, permission) {
  return permission.includes(userRole);
}

export function getUserRole(username) {
  if (PREDEFINED_USERS[username]) {
    return PREDEFINED_USERS[username];
  }
  return USER_ROLES.USER;
}
