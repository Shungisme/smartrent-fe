export const PATHS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/v1/auth',
    LOGOUT: '/v1/auth/logout',
    REFRESH: '/v1/auth/refresh',
    ADMIN_LOGIN: '/v1/auth/admin',
    VERIFICATION: '/v1/verification',
    RE_SEND_VERIFICATION: '/v1/verification/code',
    INTROSPECT: '/v1/auth/introspect',
    FORGOT_PASSWORD: '/v1/auth/forgot-password',
    CHANGE_PASSWORD: '/v1/auth/change-password',
    RESET_PASSWORD: '/v1/auth/reset-password',
  },

  // User endpoints
  USER: {
    CREATE: '/v1/users',
    GET_PROFILE: '/v1/users',
    LIST: '/v1/users/list',
    UPDATE_CONTACT_PHONE: '/v1/users/contact-phone',
    PROFILE: '/v1/users/profile',
    UPDATE: '/v1/users/update',
    CHANGE_PASSWORD: '/v1/users/change-password',
  },

  // Property endpoints
  PROPERTY: {
    LIST: '/v1/properties',
    DETAIL: '/v1/properties/:id',
    CREATE: '/v1/properties',
    UPDATE: '/v1/properties/:id',
    DELETE: '/v1/properties/:id',
  },

  // Admin endpoints
  ADMIN: {
    GET_PROFILE: '/v1/admins',
    CREATE: '/v1/admins',
    USERS: '/v1/admin/users',
    PROPERTIES: '/v1/admin/properties',
    DASHBOARD: '/v1/admin/dashboard',
  },

  // Role endpoints
  ROLE: {
    LIST: '/v1/roles',
  },

  // Membership endpoints
  MEMBERSHIP: {
    INITIATE_PURCHASE: '/v1/memberships/initiate-purchase',
    GET_PACKAGES: '/v1/memberships/packages',
    GET_PACKAGE_BY_ID: '/v1/memberships/packages/:membershipId',
    MY_MEMBERSHIP: '/v1/memberships/my-membership',
    HISTORY: '/v1/memberships/history',
    CANCEL: '/v1/memberships/:userMembershipId',
  },

  // VIP Tier endpoints
  VIP_TIER: {
    GET_ACTIVE: '/v1/vip-tiers',
    GET_BY_CODE: '/v1/vip-tiers/:tierCode',
    GET_ALL: '/v1/vip-tiers/all',
  },
}
