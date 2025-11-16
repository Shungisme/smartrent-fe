import { apiRequest } from '@/configs/axios/axiosClient'
import { ENV } from '@/constants/env'
import { ApiResponse } from '@/configs/axios/types'
import { RoleListResponse } from '@/api/types/role.type'

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
  static async getRoles(): Promise<ApiResponse<RoleListResponse>> {
    const response = await apiRequest<RoleListResponse>({
      method: 'GET',
      url: ENV.API.ROLE.LIST,
    })

    return response
  }
}

// Export individual methods for convenience
export const { getRoles } = RoleService
