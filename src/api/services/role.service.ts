import { apiRequest } from '@/configs/axios/axiosClient'
import { ENV } from '@/constants/env'
import { ApiResponse } from '@/configs/axios/types'
import { Role } from '@/api/types/role.type'

/**
 * Role Service
 * Handles all role-related API operations
 */
export class RoleService {
  /**
   * Get all available roles
   * GET /v1/roles
   * Retrieves a list of all available roles in the system.
   * This endpoint is typically used for populating role selection dropdowns in admin interfaces.
   */
  /**
   * Get all available roles (paginated)
   * GET /v1/roles
   */
  static async getRoles(params?: {
    page?: number
    size?: number
  }): Promise<ApiResponse<any>> {
    const response = await apiRequest<any>({
      method: 'GET',
      url: ENV.API.ROLE.LIST,
      params,
    })
    return response
  }

  /**
   * Get role by ID
   * GET /v1/roles/:roleId
   */
  static async getRole(roleId: string): Promise<ApiResponse<Role>> {
    const url = ENV.API.ROLE.GET.replace(':roleId', roleId)
    return apiRequest<Role>({
      method: 'GET',
      url,
    })
  }

  /**
   * Create new role
   * POST /v1/roles
   */
  static async createRole(data: {
    roleId: string
    roleName: string
  }): Promise<ApiResponse<Role>> {
    return apiRequest<Role>({
      method: 'POST',
      url: ENV.API.ROLE.CREATE,
      data,
    })
  }

  /**
   * Update role
   * PUT /v1/roles/:roleId
   */
  static async updateRole(
    roleId: string,
    data: { roleName: string },
  ): Promise<ApiResponse<Role>> {
    const url = ENV.API.ROLE.UPDATE.replace(':roleId', roleId)
    return apiRequest<Role>({
      method: 'PUT',
      url,
      data,
    })
  }

  /**
   * Delete role
   * DELETE /v1/roles/:roleId
   */
  static async deleteRole(roleId: string): Promise<ApiResponse<null>> {
    const url = ENV.API.ROLE.DELETE.replace(':roleId', roleId)
    return apiRequest<null>({
      method: 'DELETE',
      url,
    })
  }
}

// Export individual methods for convenience
export const { getRoles, getRole, createRole, updateRole, deleteRole } =
  RoleService
