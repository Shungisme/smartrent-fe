import { apiRequest } from '@/configs/axios/axiosClient'
import { ENV } from '@/constants/env'
import { ApiResponse } from '@/configs/axios/types'
import {
  MembershipPackage,
  MembershipPackageList,
  UpdateMembershipPackageRequest,
} from '@/api/types/membership.type'
import { PaginatedResponse } from '../types/pagination.type'

/**
 * Membership Service
 * Handles all membership package and subscription management operations
 */
export class MembershipService {
  /**
   * Get all active membership packages
   * GET /v1/memberships/packages
   *
   * Returns all available membership packages with their benefits and pricing.
   * Only active packages are returned.
   */
  static async getMembershipPackages(): Promise<
    ApiResponse<PaginatedResponse<MembershipPackageList>>
  > {
    const response = await apiRequest<PaginatedResponse<MembershipPackageList>>(
      {
        method: 'GET',
        url: ENV.API.MEMBERSHIP.GET_PACKAGES,
      },
    )

    return response
  }

  /**
   * Get membership package by ID
   * GET /v1/memberships/packages/{membershipId}
   *
   * Returns detailed information about a specific membership package.
   *
   * @param membershipId - The ID of the membership package
   */
  static async getMembershipPackageById(
    membershipId: number,
  ): Promise<ApiResponse<MembershipPackage>> {
    const url = ENV.API.MEMBERSHIP.GET_PACKAGE_BY_ID.replace(
      ':membershipId',
      membershipId.toString(),
    )

    const response = await apiRequest<MembershipPackage>({
      method: 'GET',
      url,
    })

    return response
  }

  /**
   * Update membership package (Admin operation)
   * PUT /v1/memberships/packages/{membershipId}
   *
   * Updates an existing membership package. Features (benefits) cannot be edited
   * here — only packageName, salePrice, discountPercentage, isActive.
   *
   * @param membershipId - The ID of the membership package to update
   * @param data - Patch payload
   */
  static async updateMembershipPackage(
    membershipId: number,
    data: UpdateMembershipPackageRequest,
  ): Promise<ApiResponse<string>> {
    const url = ENV.API.MEMBERSHIP.UPDATE_PACKAGE.replace(
      ':membershipId',
      membershipId.toString(),
    )

    const response = await apiRequest<string>({
      method: 'PUT',
      url,
      data,
    })

    return response
  }

  /**
   * Delete membership package (Admin operation)
   * DELETE /v1/memberships/packages/{membershipId}
   *
   * @param membershipId - The ID of the membership package to delete
   */
  static async deleteMembershipPackage(
    membershipId: number,
  ): Promise<ApiResponse<void>> {
    const url = ENV.API.MEMBERSHIP.DELETE_PACKAGE.replace(
      ':membershipId',
      membershipId.toString(),
    )

    const response = await apiRequest<void>({
      method: 'DELETE',
      url,
    })

    return response
  }

  /**
   * Clear all active memberships for a user (Admin operation)
   * DELETE /v1/admin/memberships/users/{userId}
   *
   * Expires every ACTIVE membership record for the given user.
   * Use this to fix duplicate-active-membership issues.
   */
  static async clearUserMembership(userId: string): Promise<ApiResponse<void>> {
    const url = ENV.API.MEMBERSHIP.CLEAR_USER.replace(':userId', userId)
    return apiRequest<void>({ method: 'DELETE', url })
  }
}

// Export individual methods for convenience
export const {
  getMembershipPackages,
  getMembershipPackageById,
  updateMembershipPackage,
  deleteMembershipPackage,
  clearUserMembership,
} = MembershipService
