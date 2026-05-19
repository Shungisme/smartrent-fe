'use client'

import { useTranslations } from 'next-intl'
import { RevenueSeries } from '../types/transaction.type'
import { formatVND } from '../utils/formatters'

interface RevenueChartProps {
  data: RevenueSeries[] | undefined
  isLoading?: boolean
  groupBy?: 'DAY' | 'MONTH'
}

/**
 * Simple Revenue Chart Component
 * Shows revenue trend over time with a basic bar/line visualization
 */
export const RevenueChart = ({
  data,
  isLoading,
  groupBy = 'DAY',
}: RevenueChartProps) => {
  const t = useTranslations('transactions')
  if (isLoading) {
    return (
      <div className='h-64 bg-gray-50 rounded-lg flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className='h-64 bg-gray-50 rounded-lg flex items-center justify-center'>
        <p className='text-gray-500'>{t('chart.noData')}</p>
      </div>
    )
  }

  // Find max revenue for scaling
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)

  return (
    <div className='rounded-lg border border-gray-200 p-6 bg-white'>
      <h3 className='text-lg font-semibold text-gray-900 mb-6'>
        {t('chart.title')} (
        {groupBy === 'DAY' ? t('chart.day') : t('chart.month')})
      </h3>

      <div className='space-y-4'>
        {data.map((item, index) => {
          return (
            <div key={index} className='space-y-2'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium text-gray-700 w-24'>
                  {item.period}
                </span>
                <div className='flex-1 ml-4 relative h-8 bg-gray-100 rounded'>
                  <div
                    className='h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded transition-all'
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
                <span className='text-sm font-semibold text-gray-900 w-32 text-right'>
                  {formatVND(item.revenue)}
                </span>
              </div>
              <div className='flex items-center justify-between pl-28'>
                <span className='text-xs text-gray-500'>
                  {item.successfulCount} {t('chart.count')}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className='mt-6 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4'>
        <div>
          <p className='text-sm text-gray-600'>{t('chart.total')}</p>
          <p className='text-lg font-bold text-gray-900'>
            {formatVND(data.reduce((sum, item) => sum + item.revenue, 0))}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>
            {t('stats.totalTransactions')}
          </p>
          <p className='text-lg font-bold text-gray-900'>
            {data.reduce((sum, item) => sum + item.successfulCount, 0)}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-600'>{t('chart.average')}</p>
          <p className='text-lg font-bold text-gray-900'>
            {formatVND(
              data.reduce((sum, item) => sum + item.revenue, 0) / data.length,
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
