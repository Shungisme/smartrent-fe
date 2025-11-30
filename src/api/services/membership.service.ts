import { apiRequest } from '@/configs/axios/axiosClient'
import { ENV } from '@/constants/env'
import { ApiResponse } from '@/configs/axios/types'
import {
  InitiatePurchaseRequest,
  PaymentInitiationResponse,
  MembershipPackage,
  MembershipPackageList,
  UserMembership,
  MembershipHistoryList,
} from '@/api/types/membership.type'
import { PaginatedResponse } from '../types/pagination.type'

/**
 * Membership Service
 * Handles all membership package and subscription management operations
 */
export class MembershipService {
  /**
   * Initiate membership purchase
   * POST /v1/memberships/initiate-purchase
   *
   * Initiate membership package purchase and receive payment URL.
   * After successful payment, the user will be redirected to the configured frontend URL
   * with payment result parameters. The frontend should then verify the payment status
   * by calling GET /v1/payments/transactions/{txnRef}.
   *
   * @param purchaseData - Membership ID and payment provider
   * @returns Payment URL and transaction reference
   */
  static async initiatePurchase(
    purchaseData: InitiatePurchaseRequest,
  ): Promise<ApiResponse<PaymentInitiationResponse>> {
    const response = await apiRequest<PaymentInitiationResponse>({
      method: 'POST',
      url: ENV.API.MEMBERSHIP.INITIATE_PURCHASE,
      data: purchaseData,
    })

    return response
  }

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
   * Get current active membership
   * GET /v1/memberships/my-membership
   *
   * Returns the user's current active membership with all benefits and quotas.
   * This includes usage tracking for each benefit.
   */
  static async getMyMembership(): Promise<ApiResponse<UserMembership>> {
    const response = await apiRequest<UserMembership>({
      method: 'GET',
      url: ENV.API.MEMBERSHIP.MY_MEMBERSHIP,
    })

    return response
  }

  /**
   * Get membership history
   * GET /v1/memberships/history
   *
   * Returns all past and current memberships for the user.
   * Includes expired, cancelled, and active memberships.
   */
  static async getMembershipHistory(): Promise<
    ApiResponse<MembershipHistoryList>
  > {
    const response = await apiRequest<MembershipHistoryList>({
      method: 'GET',
      url: ENV.API.MEMBERSHIP.HISTORY,
    })

    return response
  }

  /**
   * Cancel membership
   * DELETE /v1/memberships/{userMembershipId}
   *
   * Cancel an active membership and expire all benefits.
   * This action cannot be undone.
   *
   * @param userMembershipId - The ID of the user membership to cancel
   */
  static async cancelMembership(
    userMembershipId: number,
  ): Promise<ApiResponse<string>> {
    const url = ENV.API.MEMBERSHIP.CANCEL.replace(
      ':userMembershipId',
      userMembershipId.toString(),
    )

    const response = await apiRequest<string>({
      method: 'DELETE',
      url,
    })

    return response
  }
}

// Export individual methods for convenience
export const {
  initiatePurchase,
  getMembershipPackages,
  getMembershipPackageById,
  getMyMembership,
  getMembershipHistory,
  cancelMembership,
} = MembershipService
