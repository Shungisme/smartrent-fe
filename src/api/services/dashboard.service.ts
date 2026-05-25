import { apiRequest } from '@/configs/axios/axiosClient'
import { ApiResponse } from '@/configs/axios/types'
import { ENV } from '@/constants/env'
import {
  MembershipDistributionResponse,
  RevenueOverTimeResponse,
  TimeSeriesResponse,
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
      url: ENV.API.ADMIN_DASHBOARD.REVENUE,
      params: buildParams(query),
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
    query?: DashboardTimeQuery,
  ): Promise<ApiResponse<TimeSeriesResponse>> {
    return apiRequest<TimeSeriesResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_DASHBOARD.USERS_GROWTH,
      params: buildParams(query),
    })
  }

  static async getReportCount(
    query?: DashboardTimeQuery,
  ): Promise<ApiResponse<TimeSeriesResponse>> {
    return apiRequest<TimeSeriesResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_DASHBOARD.REPORTS_COUNT,
      params: buildParams(query),
    })
  }

  static async getListingCreation(
    query?: DashboardTimeQuery,
  ): Promise<ApiResponse<TimeSeriesResponse>> {
    return apiRequest<TimeSeriesResponse>({
      method: 'GET',
      url: ENV.API.ADMIN_DASHBOARD.LISTINGS_CREATION,
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
