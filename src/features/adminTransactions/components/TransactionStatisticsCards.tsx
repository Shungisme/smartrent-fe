'use client'

import { ArrowUpRight } from 'lucide-react'
import { TransactionStatistics } from '../types/transaction.type'
import { formatVND } from '../utils/formatters'

interface TransactionStatisticsCardsProps {
  statistics: TransactionStatistics | undefined
  isLoading?: boolean
}

/**
 * Transaction Statistics Cards Component
 * Displays key metrics like total revenue, success rate, etc.
 */
export const TransactionStatisticsCards = ({
  statistics,
  isLoading,
}: TransactionStatisticsCardsProps) => {
  const cards = statistics
    ? [
        {
          label: 'Tổng doanh thu',
          value: formatVND(statistics.totalRevenue),
          icon: '💰',
          color: 'bg-blue-50',
        },
        {
          label: 'Tổng giao dịch',
          value: statistics.totalTransactions,
          icon: '📊',
          color: 'bg-purple-50',
        },
        {
          label: 'Thanh toán thành công',
          value: statistics.successfulPayments,
          icon: '✅',
          color: 'bg-green-50',
        },
        {
          label: 'Thanh toán thất bại',
          value: statistics.failedPayments,
          icon: '❌',
          color: 'bg-red-50',
        },
        {
          label: 'Chờ xử lý',
          value: statistics.pendingPayments,
          icon: '⏳',
          color: 'bg-yellow-50',
        },
        {
          label: 'Hoàn tiền',
          value: statistics.refundedPayments,
          icon: '🔄',
          color: 'bg-orange-50',
        },
        {
          label: 'Tỷ lệ thành công',
          value: `${statistics.successRate.toFixed(2)}%`,
          icon: '📈',
          color: 'bg-indigo-50',
        },
        {
          label: 'Trung bình/Giao dịch',
          value: formatVND(statistics.averageSuccessfulAmount),
          icon: '💵',
          color: 'bg-teal-50',
        },
      ]
    : []

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      {cards.map((card, index) => (
        <div
          key={index}
          className={`${card.color} rounded-lg p-6 border border-gray-200 transition-all hover:shadow-md`}
        >
          <div className='flex items-start justify-between'>
            <div>
              <p className='text-sm font-medium text-gray-600'>{card.label}</p>
              <p className='mt-2 text-xl font-bold text-gray-900'>
                {card.value}
              </p>
            </div>
            <span className='text-2xl'>{card.icon}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
