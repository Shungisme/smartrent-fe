import React from 'react'
import { Home, Building2, Briefcase, MapPin } from 'lucide-react'

export const getInitials = (name: string) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || ''

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-warning/10 text-warning-foreground dark:bg-warning/20 border-warning/30'
    case 'RESOLVED':
      return 'bg-success/10 text-success-foreground dark:bg-success/20 border-success/30'
    case 'REJECTED':
      return 'bg-muted text-foreground/80'
    default:
      return 'bg-muted text-foreground/80'
  }
}

export const statusMap = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'dismissed',
}

export const getPropertyIcon = (type: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    HOUSE: <Home className='h-4 w-4' />,
    APARTMENT: <Building2 className='h-4 w-4' />,
    OFFICE: <Briefcase className='h-4 w-4' />,
    LAND: <MapPin className='h-4 w-4' />,
    ROOM: <Building2 className='h-4 w-4' />,
  }
  return iconMap[type] || <Home className='h-4 w-4' />
}

export const formatPrice = (price: number, priceUnit: string): string => {
  const formatted = new Intl.NumberFormat('vi-VN').format(price)
  const unitMap: Record<string, string> = {
    VND_PER_MONTH: 'đ/tháng',
    VND_PER_YEAR: 'đ/năm',
    VND_TOTAL: 'đ',
  }
  return `${formatted}${unitMap[priceUnit] || 'đ'}`
}

export const formatDateTime = (
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
