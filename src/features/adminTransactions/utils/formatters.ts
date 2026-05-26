import {
  PaymentGateway,
  PaymentStatus,
  PaymentType,
} from '../types/transaction.type'

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
