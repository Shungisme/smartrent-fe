import { apiRequest } from '@/configs/axios/axiosClient'
import { ApiResponse } from '@/configs/axios/types'
import { ENV } from '@/constants/env'
import {
  MembershipDistributionResponse,
  RevenueOverTimeResponse,
} from '@/api/types/dashboard.type'

export class DashboardService {
  static async getRevenueOverTime(params?: {
    from?: string
    to?: string
  }): Promise<ApiResponse<RevenueOverTimeResponse>> {
    return apiRequest<RevenueOverTimeResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_DASHBOARD.REVENUE,
      params,
    })
  }

  static async getMembershipDistribution(): Promise<
    ApiResponse<MembershipDistributionResponse>
  > {
    return apiRequest<MembershipDistributionResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_DASHBOARD.MEMBERSHIP_DISTRIBUTION,
    })
  }
}

export const { getRevenueOverTime, getMembershipDistribution } =
  DashboardService
