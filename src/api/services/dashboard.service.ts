import { apiRequest } from '@/configs/axios/axiosClient'
import { ApiResponse } from '@/configs/axios/types'
import { ENV } from '@/constants/env'
import {
  MembershipDistributionResponse,
  RevenueOverTimeResponse,
  TimeSeriesResponse,
} from '@/api/types/dashboard.type'

export class DashboardService {
  static async getRevenueOverTime(params?: {
    days?: number
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

  static async getUserGrowth(
    days: number = 7,
  ): Promise<ApiResponse<TimeSeriesResponse>> {
    return apiRequest<TimeSeriesResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_DASHBOARD.USERS_GROWTH,
      params: { days },
    })
  }

  static async getReportCount(
    days: number = 7,
  ): Promise<ApiResponse<TimeSeriesResponse>> {
    return apiRequest<TimeSeriesResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_DASHBOARD.REPORTS_COUNT,
      params: { days },
    })
  }

  static async getListingCreation(
    days: number = 7,
  ): Promise<ApiResponse<TimeSeriesResponse>> {
    return apiRequest<TimeSeriesResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_DASHBOARD.LISTINGS_CREATION,
      params: { days },
    })
  }
}

export const {
  getRevenueOverTime,
  getMembershipDistribution,
  getUserGrowth,
  getReportCount,
  getListingCreation,
} = DashboardService
