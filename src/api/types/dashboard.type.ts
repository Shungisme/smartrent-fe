export type DashboardTransactionType =
  | 'MEMBERSHIP_PURCHASE'
  | 'MEMBERSHIP_UPGRADE'
  | 'POST_FEE'
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

export interface TimeSeriesResponse {
  dataPoints: TimeSeriesDataPoint[]
  total: number
  granularity: DashboardGranularity
}
