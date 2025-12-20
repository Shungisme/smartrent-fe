import { apiRequest } from '@/configs/axios/axiosClient'
import { PATHS } from '@/api/paths'
import {
  AdminListingListResponse,
  ListingResponseWithAdmin,
  ListingFilterRequest,
  ListingStatusChangeRequest,
  ApiResponse,
} from '@/api/types/listing.type'

/**
 * Listing Service for Admin Portal
 * Handles all admin listing-related API operations
 */
export class ListingService {
  /**
   * Get all listings for admin with filters and pagination
   * POST /v1/listings/admin/list
   *
   * @param filter - Filter criteria (optional)
   * @returns Paginated list of listings with statistics
   */
  static async getAdminListings(
    filter?: ListingFilterRequest,
  ): Promise<ApiResponse<AdminListingListResponse>> {
    const response = await apiRequest<AdminListingListResponse>({
      method: 'POST',
      url: PATHS.LISTING.ADMIN_LIST,
      data: filter || {},
    })
    return response
  }

  /**
   * Get listing detail with admin verification info
   * GET /v1/listings/{id}/admin
   *
   * @param listingId - Listing ID
   * @returns Listing detail with admin information
   */
  static async getListingDetail(
    listingId: number | string,
  ): Promise<ApiResponse<ListingResponseWithAdmin>> {
    const url = PATHS.LISTING.ADMIN_DETAIL.replace(':id', listingId.toString())
    const response = await apiRequest<ListingResponseWithAdmin>({
      method: 'GET',
      url,
    })
    return response
  }

  /**
   * Verify or reject a listing
   * PUT /v1/admin/listings/{listingId}/status
   *
   * @param listingId - Listing ID
   * @param request - Status change request (verified true/false with optional reason)
   * @returns Updated listing response
   */
  static async changeListingStatus(
    listingId: number | string,
    request: ListingStatusChangeRequest,
  ): Promise<
    ApiResponse<{
      listingId: number
      title: string
      verified: boolean
      isVerify: boolean
      userId: string
      price: number
      listingType: string
    }>
  > {
    const url = PATHS.LISTING.ADMIN_VERIFY.replace(
      ':listingId',
      listingId.toString(),
    )
    const response = await apiRequest<{
      listingId: number
      title: string
      verified: boolean
      isVerify: boolean
      userId: string
      price: number
      listingType: string
    }>({
      method: 'PUT',
      url,
      data: request,
    })
    return response
  }

  /**
   * Verify a listing
   * Convenience method that calls changeListingStatus with verified=true
   *
   * @param listingId - Listing ID
   * @param reason - Optional verification notes
   */
  static async verifyListing(
    listingId: number | string,
    reason?: string,
  ): Promise<
    ApiResponse<{
      listingId: number
      title: string
      verified: boolean
      isVerify: boolean
      userId: string
      price: number
      listingType: string
    }>
  > {
    return this.changeListingStatus(listingId, {
      verified: true,
      reason,
    })
  }

  /**
   * Reject a listing
   * Convenience method that calls changeListingStatus with verified=false
   *
   * @param listingId - Listing ID
   * @param reason - Rejection reason (recommended)
   */
  static async rejectListing(
    listingId: number | string,
    reason?: string,
  ): Promise<
    ApiResponse<{
      listingId: number
      title: string
      verified: boolean
      isVerify: boolean
      userId: string
      price: number
      listingType: string
    }>
  > {
    return this.changeListingStatus(listingId, {
      verified: false,
      reason,
    })
  }
}
