import { apiRequest } from '@/configs/axios/axiosClient'

// Types for report API
export interface ListingReportReason {
  reasonId: number
  reasonText: string
  category: string
  displayOrder: number
}

export interface ListingReport {
  reportId: number
  listingId: number
  reporterName: string
  reporterPhone: string
  reporterEmail: string
  reportReasons: ListingReportReason[]
  otherFeedback: string
  category: string
  status: 'PENDING' | 'RESOLVED' | 'REJECTED'
  resolvedBy: string | null
  resolvedByName: string | null
  resolvedAt: string | null
  adminNotes: string | null
  createdAt: string
  updatedAt: string
}

export interface ListingReportListResponse {
  page: number
  size: number
  totalElements: number
  totalPages: number
  data: ListingReport[]
}

export interface ResolveReportRequest {
  status: 'RESOLVED' | 'REJECTED'
  adminNotes?: string
}

export const ListingReportService = {
  async getReports(params: { status?: string; page?: number; size?: number }) {
    return apiRequest<ListingReportListResponse>({
      method: 'GET',
      url: '/v1/admin/reports',
      params,
    })
  },

  async resolveReport(reportId: number, data: ResolveReportRequest) {
    return apiRequest<ListingReport>({
      method: 'PUT',
      url: `/v1/admin/reports/${reportId}/resolve`,
      data,
    })
  },
}
