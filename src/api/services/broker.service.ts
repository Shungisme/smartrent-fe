import { apiRequest } from '@/configs/axios/axiosClient'
import { PATHS } from '@/api/paths'
import { ApiResponse } from '@/configs/axios/types'
import { PaginatedResponse } from '@/api/types/pagination.type'
import {
  AdminBrokerUserResponse,
  BrokerStatusResponse,
  BrokerVerificationRequest,
} from '@/api/types/broker.type'

/**
 * Broker Service (Admin)
 * Handles admin broker verification operations.
 */
export class BrokerService {
  /**
   * Get pending broker registrations (paginated)
   * GET /v1/admin/users/broker-pending
   */
  static async getPendingBrokers(params?: {
    page?: number
    size?: number
  }): Promise<ApiResponse<PaginatedResponse<AdminBrokerUserResponse>>> {
    return apiRequest<PaginatedResponse<AdminBrokerUserResponse>>({
      method: 'GET',
      url: PATHS.ADMIN_USERS.BROKER_PENDING,
      params,
    })
  }

  /**
   * Approve or reject a broker registration
   * PATCH /v1/admin/users/{userId}/broker-verification
   */
  static async verifyBroker(
    userId: string,
    data: BrokerVerificationRequest,
  ): Promise<ApiResponse<BrokerStatusResponse>> {
    const url = PATHS.ADMIN_USERS.BROKER_VERIFY.replace(':userId', userId)
    return apiRequest<BrokerStatusResponse>({
      method: 'PATCH',
      url,
      data,
    })
  }

  /**
   * Remove broker privileges
   * DELETE /v1/admin/users/{userId}/broker
   */
  static async removeBroker(
    userId: string,
  ): Promise<ApiResponse<BrokerStatusResponse>> {
    const url = PATHS.ADMIN_USERS.BROKER_REMOVE.replace(':userId', userId)
    return apiRequest<BrokerStatusResponse>({
      method: 'DELETE',
      url,
    })
  }
}

export const { getPendingBrokers, verifyBroker, removeBroker } = BrokerService
