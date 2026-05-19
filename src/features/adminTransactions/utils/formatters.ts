import {
  PaymentGateway,
  PaymentStatus,
  PaymentType,
} from '../types/transaction.type'

/**
 * Format currency value to VND
 */
export const formatVND = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format date time string
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN')
}

/**
 * Format date only
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

/**
 * Get payment status label
 */
export const getPaymentStatusLabel = (status: PaymentStatus): string => {
  const statusLabels: Record<PaymentStatus, string> = {
    PENDING: 'Chờ xử lý',
    SUCCESS: 'Thành công',
    FAILED: 'Thất bại',
    CANCELLED: 'Đã huỷ',
    REFUNDED: 'Hoàn tiền',
  }
  return statusLabels[status] || status
}

/**
 * Get payment status color
 */
export const getPaymentStatusColor = (status: PaymentStatus): string => {
  const statusColors: Record<PaymentStatus, string> = {
    PENDING: 'warning',
    SUCCESS: 'success',
    FAILED: 'error',
    CANCELLED: 'default',
    REFUNDED: 'info',
  }
  return statusColors[status] || 'default'
}

/**
 * Get payment gateway label
 */
export const getPaymentGatewayLabel = (gateway: PaymentGateway): string => {
  const gatewayLabels: Record<PaymentGateway, string> = {
    VNPAY: 'VNPay',
    ZALOPAY: 'ZaloPay',
    MOMO: 'MoMo',
  }
  return gatewayLabels[gateway] || gateway
}

/**
 * Get payment type label
 */
export const getPaymentTypeLabel = (type: PaymentType): string => {
  const typeLabels: Record<PaymentType, string> = {
    MONTHLY_INVOICE: 'Hóa đơn hàng tháng',
    MEMBERSHIP_PURCHASE: 'Mua gói thành viên',
    MEMBERSHIP_UPGRADE: 'Nâng cấp gói thành viên',
    LISTING_BOOST: 'Đẩy tin đăng',
    LISTING_POST: 'Đăng tin',
    POST_FEE: 'Phí đăng tin',
    REPOST_FEE: 'Phí đăng lại tin',
    PUSH_FEE: 'Phí đẩy tin',
    WALLET_TOPUP: 'Nạp ví',
    DEPOSIT: 'Ký quỹ',
    REFUND: 'Hoàn tiền',
  }
  return typeLabels[type] || type
}

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return ''
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Get date range for quick filters (last 7 days, this month, etc)
 */
export const getDateRange = (
  rangeType: 'today' | 'week' | 'month' | 'quarter' | 'year',
): { fromDate: string; toDate: string } => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const toDate = today.toISOString().split('T')[0]

  let fromDate: string

  switch (rangeType) {
    case 'today':
      fromDate = toDate
      break
    case 'week':
      const weekAgo = new Date(today)
      weekAgo.setDate(weekAgo.getDate() - 7)
      fromDate = weekAgo.toISOString().split('T')[0]
      break
    case 'month':
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      fromDate = monthStart.toISOString().split('T')[0]
      break
    case 'quarter':
      const quarterStart = new Date(
        today.getFullYear(),
        Math.floor(today.getMonth() / 3) * 3,
        1,
      )
      fromDate = quarterStart.toISOString().split('T')[0]
      break
    case 'year':
      const yearStart = new Date(today.getFullYear(), 0, 1)
      fromDate = yearStart.toISOString().split('T')[0]
      break
    default:
      fromDate = toDate
  }

  return { fromDate, toDate }
}
