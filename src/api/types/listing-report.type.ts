// Types for listing report API
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
  otherFeedback: string | null
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
  // Extended fields for owner action workflow
  ownerActionRequired?: boolean
  ownerActionType?: 'UPDATE_LISTING' | 'REMOVE_LISTING' | 'CONTACT_ADMIN'
  ownerActionDeadlineAt?: string // ISO 8601 datetime
  listingVisibilityAction?: 'KEEP_VISIBLE' | 'HIDE_UNTIL_REVIEW' | 'SUSPEND'
}
