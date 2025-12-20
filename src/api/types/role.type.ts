/**
 * Role Type Definitions
 * Types for role management system
 */

// Role response from GET /v1/roles
export interface Role {
  roleId: string
  roleName: string
}

// Available role IDs in the system
export type RoleId = 'ADMIN' | 'SUPER_ADMIN' | 'USER' | 'MODERATOR'

// Role list response type (paginated)
export interface RoleListResponse {
  page: number
  size: number
  totalElements: number
  totalPages: number
  data: Role[]
}

// Role create/update request types
export interface RoleCreateRequest {
  roleId: string
  roleName: string
}

export interface RoleUpdateRequest {
  roleName: string
}
