import { apiRequest } from '@/configs/axios/axiosClient'
import { ApiResponse } from '@/configs/axios/types'
import { ENV } from '@/constants/env'
import {
  AdminListingAnalyticsResponse,
  AdminReportAnalyticsResponse,
  AdminUserAnalyticsResponse,
  MembershipDistributionResponse,
  RevenueOverTimeResponse,
} from '@/api/types/dashboard.type'

export interface DashboardTimeQuery {
  days?: number
  from?: string
  to?: string
}

function buildParams(query?: DashboardTimeQuery) {
  if (!query) return undefined
  if (query.days !== null && query.days !== undefined) {
    return { days: query.days }
  }
  const params: Record<string, string> = {}
  if (query.from) params.from = query.from
  if (query.to) params.to = query.to
  return params
}

export class DashboardService {
  static async getRevenueOverTime(
    query?: DashboardTimeQuery,
  ): Promise<ApiResponse<RevenueOverTimeResponse>> {
    return apiRequest<RevenueOverTimeResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_ANALYTICS.REVENUE,
      params: buildParams(query),
    })
  }

  static async getMembershipDistribution(): Promise<
    ApiResponse<MembershipDistributionResponse>
  > {
    return apiRequest<MembershipDistributionResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_ANALYTICS.MEMBERSHIP_DISTRIBUTION,
    })
  }

  static async getUserGrowth(
    query?: DashboardTimeQuery,
  ): Promise<ApiResponse<AdminUserAnalyticsResponse>> {
    return apiRequest<AdminUserAnalyticsResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_ANALYTICS.USERS,
      params: buildParams(query),
    })
  }

  static async getReportCount(
    query?: DashboardTimeQuery,
  ): Promise<ApiResponse<AdminReportAnalyticsResponse>> {
    return apiRequest<AdminReportAnalyticsResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_ANALYTICS.REPORTS,
      params: buildParams(query),
    })
  }

  static async getListingCreation(
    query?: DashboardTimeQuery,
  ): Promise<ApiResponse<AdminListingAnalyticsResponse>> {
    return apiRequest<AdminListingAnalyticsResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_ANALYTICS.LISTINGS,
      params: buildParams(query),
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
