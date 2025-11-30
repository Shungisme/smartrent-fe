import { apiRequest } from '@/configs/axios/axiosClient'
import { ENV } from '@/constants/env'
import { ApiResponse } from '@/configs/axios/types'
import {
  AdminProfile,
  CreateAdminRequest,
  CreateAdminResponse,
} from '@/api/types/admin.type'

/**
 * Admin Service
 * Handles all administrator account management operations
 */
export class AdminService {
  /**
   * Get admin profile by ID
   * GET /v1/admins
   * Retrieves the profile information of the authenticated administrator.
   * The admin ID is extracted from the request header (JWT token).
   */
  static async getAdminProfile(): Promise<ApiResponse<AdminProfile>> {
    const response = await apiRequest<AdminProfile>({
      method: 'GET',
      url: ENV.API.ADMIN.GET_PROFILE,
    })

    return response
  }

  /**
   * Create a new admin account
   * POST /v1/admins
   * Creates a new administrator account with the provided information and assigned roles.
   * Only existing admins with appropriate permissions can create new admin accounts.
   *
   * @param adminData - Admin creation details including roles
   * @returns Admin profile with temporary password included
   */
  static async createAdmin(
    adminData: CreateAdminRequest,
  ): Promise<ApiResponse<CreateAdminResponse>> {
    const response = await apiRequest<CreateAdminResponse>({
      method: 'POST',
      url: ENV.API.ADMIN.CREATE,
      data: adminData,
    })

    return response
  }

  /**
   * Update admin
   * PUT /v1/admins/:adminId
   * Updates an existing administrator's information
   */
  static async updateAdmin(
    adminId: string,
    data: Partial<CreateAdminRequest>,
  ): Promise<ApiResponse<AdminProfile>> {
    const url = ENV.API.ADMIN.UPDATE.replace(':adminId', adminId)
    return apiRequest<AdminProfile>({
      method: 'PUT',
      url,
      data,
    })
  }

  /**
   * Delete admin
   * DELETE /v1/admins/:adminId
   * Deletes an administrator from the system
   */
  static async deleteAdmin(adminId: string): Promise<ApiResponse<null>> {
    const url = ENV.API.ADMIN.DELETE.replace(':adminId', adminId)
    return apiRequest<null>({
      method: 'DELETE',
      url,
    })
  }

  /**
   * Get all admins (paginated)
   * GET /v1/admins/list
   */
  static async getAdminList(params?: {
    page?: number
    size?: number
  }): Promise<ApiResponse<any>> {
    return apiRequest<any>({
      method: 'GET',
      url: ENV.API.ADMIN.LIST,
      params,
    })
  }
}

// Export individual methods for convenience
export const {
  getAdminProfile,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminList,
} = AdminService
