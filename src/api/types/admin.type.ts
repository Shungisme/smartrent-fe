/**
 * Admin Type Definitions
 * Types for administrator account management
 */

// Admin profile response from GET /v1/admins
export interface AdminProfile {
  adminId: string
  phoneCode: string
  phoneNumber: string
  email: string
  firstName: string
  lastName: string
  idDocument: string | null
  taxNumber: string | null
  roles: string[]
}

// Request body for POST /v1/admins (Create admin)
export interface CreateAdminRequest {
  phoneCode: string
  phoneNumber: string
  email: string
  password: string
  firstName: string
  lastName: string
  roles: string[]
}

// Admin creation response (includes password in response)
export interface CreateAdminResponse {
  adminId: string
  phoneCode: string
  phoneNumber: string
  email: string
  password: string
  firstName: string
  lastName: string
  roles: string[]
}
