export type DashboardTransactionType =
  | 'MEMBERSHIP_PURCHASE'
  | 'MEMBERSHIP_UPGRADE'
  | 'MEMBERSHIP_RENEWAL'
  | 'POST_FEE'
  | 'REPOST_FEE'
  | 'PUSH_FEE'
  | 'WALLET_TOPUP'
  | 'REFUND'

export type DashboardGranularity = 'DAY' | 'MONTH'

export interface RevenueDataPoint {
  date: string
  totalAmount: number
  transactionCount: number
}

export interface RevenueByTypeItem {
  transactionType: DashboardTransactionType
  totalAmount: number
  transactionCount: number
}

export interface RevenueOverTimeResponse {
  dataPoints: RevenueDataPoint[]
  grandTotal: number
  totalTransactions: number
  revenueByType: RevenueByTypeItem[]
  granularity: DashboardGranularity
}

export type MembershipPackageLevel = 'BASIC' | 'STANDARD' | 'ADVANCED'

export interface MembershipDistributionItem {
  packageLevel: MembershipPackageLevel
  packageName: string
  count: number
  percentage: number
}

export interface MembershipDistributionResponse {
  distribution: MembershipDistributionItem[]
  totalActive: number
}

export interface TimeSeriesDataPoint {
  label: string
  count: number
}

/** Generic part-to-whole slice shared by every analytics breakdown. */
export interface CategoryBreakdownItem<TCategory extends string = string> {
  category: TCategory
  count: number
  percentage: number
}

/** @deprecated Kept for the unrouted overview tab; use the per-section response types below. */
export interface TimeSeriesResponse {
  dataPoints: TimeSeriesDataPoint[]
  total: number
  granularity: DashboardGranularity
}

export type UserRoleCategory = 'REGULAR' | 'BROKER'
export type BrokerVerificationCategory =
  | 'NONE'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'

export interface AdminUserAnalyticsResponse {
  dataPoints: TimeSeriesDataPoint[]
  total: number
  granularity: DashboardGranularity
  cumulativeDataPoints: TimeSeriesDataPoint[]
  totalUsersAsOfRangeEnd: number
  roleBreakdown: CategoryBreakdownItem<UserRoleCategory>[]
  brokerVerificationBreakdown: CategoryBreakdownItem<BrokerVerificationCategory>[]
}

export type ListingTypeCategory = 'RENT' | 'SALE' | 'SHARE'
export type ListingProductTypeCategory =
  | 'ROOM'
  | 'APARTMENT'
  | 'HOUSE'
  | 'OFFICE'
  | 'STUDIO'
  | 'STORE'
export type ListingVerificationCategory = 'VERIFIED' | 'UNVERIFIED'

export interface AdminListingAnalyticsResponse {
  dataPoints: TimeSeriesDataPoint[]
  total: number
  granularity: DashboardGranularity
  cumulativeDataPoints: TimeSeriesDataPoint[]
  totalListingsAsOfRangeEnd: number
  listingTypeBreakdown: CategoryBreakdownItem<ListingTypeCategory>[]
  productTypeBreakdown: CategoryBreakdownItem<ListingProductTypeCategory>[]
  verificationBreakdown: CategoryBreakdownItem<ListingVerificationCategory>[]
}

export type ReportCategory = 'LISTING' | 'MAP'
export type ReportStatusCategory = 'PENDING' | 'RESOLVED' | 'REJECTED'

export interface AdminReportAnalyticsResponse {
  dataPoints: TimeSeriesDataPoint[]
  total: number
  granularity: DashboardGranularity
  cumulativeDataPoints: TimeSeriesDataPoint[]
  categoryBreakdown: CategoryBreakdownItem<ReportCategory>[]
  statusBreakdown: CategoryBreakdownItem<ReportStatusCategory>[]
  resolutionRatePercent: number
  avgResolutionHours: number | null
}
