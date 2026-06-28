export const formatCurrency = (amount: number): string => {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount)
  return formatted.replace('₫', '').trim() + '₫'
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

export const getPaymentGatewayLabel = (gateway: string): string => {
  const labels: Record<string, string> = {
    VNPAY: 'VNPay',
    ZALOPAY: 'ZaloPay',
    MOMO: 'MoMo',
    SEPAY: 'SePay',
  }
  return labels[gateway] ?? gateway
}
