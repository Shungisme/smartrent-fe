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

// Role list response type
export type RoleListResponse = Role[]
