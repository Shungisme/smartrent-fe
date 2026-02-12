import { PromoStatus } from '@/types/premium.type'

export const getPromoStatusColor = (status: PromoStatus): string => {
  const colors: Record<PromoStatus, string> = {
    active: 'bg-green-100 text-green-800 border-green-200',
    expired: 'bg-red-100 text-red-800 border-red-200',
    scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  }
  return colors[status]
}

export const getTierColor = (tierCode: string): string => {
  const colors: Record<string, string> = {
    NORMAL: 'bg-gray-100 text-gray-700',
    SILVER: 'bg-blue-100 text-blue-700',
    GOLD: 'bg-purple-100 text-purple-700',
    DIAMOND: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
  }
  return colors[tierCode] || 'bg-gray-100 text-gray-700'
}
