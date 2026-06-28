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

export const formatDateTime = (
  dateString: string | null | undefined,
): string => {
  if (!dateString) return '--'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleString('vi-VN')
}

export const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return '--'
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('vi-VN')
}

export const formatDateTimeParts = (
  isoString: string,
): { date: string; time: string } => {
  const date = new Date(isoString)
  return {
    date: date.toLocaleDateString('vi-VN'),
    time: date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

export const formatDateTimeCompact = (value?: string | null): string => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`
}

export const formatPrice = (price: number, priceUnit: string): string => {
  const formatted = new Intl.NumberFormat('vi-VN').format(price)
  const unitMap: Record<string, string> = {
    VND_PER_MONTH: 'đ/tháng',
    VND_PER_YEAR: 'đ/năm',
    VND_TOTAL: 'đ',
  }
  return `${formatted}${unitMap[priceUnit] ?? 'đ'}`
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
