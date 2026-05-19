/**
 * Payment Status
 */
export type PaymentStatus =
  | 'PENDING'
  | 'SUCCESS'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'

/**
 * Payment Gateway
 */
export type PaymentGateway = 'VNPAY' | 'ZALOPAY' | 'MOMO'

/**
 * Payment Type
 */
export type PaymentType =
  | 'MONTHLY_INVOICE'
  | 'MEMBERSHIP_PURCHASE'
  | 'MEMBERSHIP_UPGRADE'
  | 'LISTING_BOOST'
  | 'LISTING_POST'
  | 'POST_FEE'
  | 'REPOST_FEE'
  | 'PUSH_FEE'
  | 'WALLET_TOPUP'
  | 'DEPOSIT'
  | 'REFUND'

/**
 * Customer information
 */
export interface Customer {
  customerId: string
  name: string
  email?: string
  phone: string
}

/**
 * Landlord information
 */
export interface Landlord {
  landlordId: string
  name: string
  phone: string
}

/**
 * Room information
 */
export interface Room {
  roomId: number
  roomCode: string
  roomName: string
  address?: string
}

/**
 * Invoice information
 */
export interface Invoice {
  invoiceId: string
  invoiceCode: string
  status?: string
}

/**
 * Transaction list item
 */
export interface AdminTransaction {
  transactionId: string
  transactionCode: string
  amount: number
  currency: string
  paymentGateway: PaymentGateway
  paymentMethod?: string
  gatewayTransactionCode?: string
  status: PaymentStatus
  paymentType: PaymentType
  createdAt: string
  completedAt?: string
  customer: Customer
  landlord?: Landlord
  invoice?: Invoice
  room?: Room
  failureReason?: string
}

/**
 * Transaction detail with full information
 */
export interface AdminTransactionDetail extends AdminTransaction {
  idempotencyKey: string
  gatewayResponseCode?: string
  expiredAt?: string
  providerPayload?: Record<string, any>
  timeline: TransactionTimeline[]
}

/**
 * Transaction timeline/audit entry
 */
export interface TransactionTimeline {
  status: PaymentStatus
  at: string
  actorType: 'SYSTEM' | 'GATEWAY' | 'ADMIN' | 'CUSTOMER'
  note?: string
}

/**
 * Transaction statistics
 */
export interface TransactionStatistics {
  totalRevenue: number
  totalTransactions: number
  successfulPayments: number
  failedPayments: number
  pendingPayments: number
  cancelledPayments: number
  refundedPayments: number
  successRate: number
  averageSuccessfulAmount: number
}

/**
 * Revenue series data point
 */
export interface RevenueSeries {
  period: string
  revenue: number
  successfulCount: number
}

/**
 * Admin transaction list response
 */
export interface AdminTransactionListResponse {
  page: number
  size: number
  totalElements: number
  totalPages: number
  data: AdminTransaction[]
}

/**
 * Admin transaction filters
 */
export interface AdminTransactionFilters {
  page?: number
  size?: number
  q?: string
  status?: PaymentStatus
  gateway?: PaymentGateway
  type?: PaymentType
  customerId?: string
  landlordId?: string
  fromDate?: string
  toDate?: string
  sort?: string
}
