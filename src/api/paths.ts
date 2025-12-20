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
    UPDATE: '/v1/users/:userId', // PUT (admin)
    DELETE: '/v1/users/:userId', // DELETE (admin)
    PROFILE: '/v1/users/profile',
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
    GET_PROFILE: '/v1/admins', // GET admin profile by ID (self)
    CREATE: '/v1/admins', // POST create admin
    UPDATE: '/v1/admins/:adminId', // PUT update admin
    DELETE: '/v1/admins/:adminId', // DELETE admin
    LIST: '/v1/admins/list', // GET all admins (paginated)
  },

  // Role endpoints
  ROLE: {
    LIST: '/v1/roles', // GET all roles (paginated)
    CREATE: '/v1/roles', // POST create role
    GET: '/v1/roles/:roleId', // GET role by ID
    UPDATE: '/v1/roles/:roleId', // PUT update role
    DELETE: '/v1/roles/:roleId', // DELETE role
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

  // Listing endpoints (Admin)
  LISTING: {
    ADMIN_LIST: '/v1/listings/admin/list', // POST get all listings for admin
    ADMIN_DETAIL: '/v1/listings/:id/admin', // GET listing detail with admin info
    ADMIN_VERIFY: '/v1/admin/listings/:listingId/status', // PUT verify/reject listing
  },
}
