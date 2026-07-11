// Types for the reported-authors (người đăng tin) admin feature

export interface ReportedAuthor {
  userId: string
  firstName: string | null
  lastName: string | null
  email: string | null
  phoneNumber: string | null
  avatarUrl: string | null
  totalReports: number
  resolvedReports: number
  /** true when resolvedReports > 3 → eligible to be blocked from posting */
  blockEligible: boolean
  postingBlocked: boolean
  postingBlockedReason: string | null
  postingBlockedAt: string | null
}

export interface ReportedAuthorListResponse {
  page: number
  size: number
  totalElements: number
  totalPages: number
  data: ReportedAuthor[]
}

export interface PostingBlockRequest {
  blocked: boolean
  reason?: string
}
