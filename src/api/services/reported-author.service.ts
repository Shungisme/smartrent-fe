import { apiRequest } from '@/configs/axios/axiosClient'
import { PATHS } from '@/api/paths'
import { ApiResponse } from '@/configs/axios/types'
import { ListingReport } from '@/api/types/listing-report.type'
import {
  ReportedAuthor,
  ReportedAuthorListResponse,
  PostingBlockRequest,
} from '@/api/types/reported-author.type'

/**
 * Reported-authors service for the Admin Portal.
 * Tracks listing authors (người đăng tin) by their reports and blocks/unblocks
 * them from posting new listings.
 */
export class ReportedAuthorService {
  /**
   * Paginated list of authors with reports on their listings.
   * GET /v1/admin/reported-authors
   */
  static async getReportedAuthors(params: {
    page?: number
    size?: number
  }): Promise<ApiResponse<ReportedAuthorListResponse>> {
    return apiRequest<ReportedAuthorListResponse>({
      method: 'GET',
      url: PATHS.REPORTED_AUTHORS.LIST,
      params,
    })
  }

  /**
   * All admin-approved (RESOLVED) reports across an author's listings.
   * GET /v1/admin/reported-authors/{userId}/reports
   */
  static async getApprovedReports(
    userId: string,
  ): Promise<ApiResponse<ListingReport[]>> {
    return apiRequest<ListingReport[]>({
      method: 'GET',
      url: PATHS.REPORTED_AUTHORS.REPORTS.replace(':userId', userId),
    })
  }

  /**
   * Block or unblock an author from posting new listings.
   * PATCH /v1/admin/reported-authors/{userId}/posting-block
   */
  static async setPostingBlock(
    userId: string,
    data: PostingBlockRequest,
  ): Promise<ApiResponse<ReportedAuthor>> {
    return apiRequest<ReportedAuthor>({
      method: 'PATCH',
      url: PATHS.REPORTED_AUTHORS.POSTING_BLOCK.replace(':userId', userId),
      data,
    })
  }
}
