'use client'

import { useTranslations } from 'next-intl'
import { RevenueSeries } from '@/types/transaction.type'
import { formatCurrency } from '@/utils/format'

interface RevenueChartProps {
  data: RevenueSeries[] | undefined
  isLoading?: boolean
  groupBy?: 'DAY' | 'MONTH'
}

export const RevenueChart = ({
  data,
  isLoading,
  groupBy = 'DAY',
}: RevenueChartProps) => {
  const t = useTranslations('transactions')

  if (isLoading) {
    return (
      <div className='h-64 bg-muted/50 rounded-lg flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className='h-64 bg-muted/50 rounded-lg flex items-center justify-center'>
        <p className='text-muted-foreground'>{t('chart.noData')}</p>
      </div>
    )
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)

  return (
    <div className='rounded-lg border border-border/70 p-6 bg-card'>
      <h3 className='text-lg font-semibold text-foreground mb-6'>
        {t('chart.title')} (
        {groupBy === 'DAY' ? t('chart.day') : t('chart.month')})
      </h3>

      <div className='space-y-4'>
        {data.map((item, index) => (
          <div key={index} className='space-y-2'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium text-foreground/80 w-24'>
                {item.period}
              </span>
              <div className='flex-1 ml-4 relative h-8 bg-muted rounded'>
                <div
                  className='h-full bg-gradient-to-r from-primary/60 to-primary rounded transition-all'
                  style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                />
              </div>
              <span className='text-sm font-semibold text-foreground w-32 text-right'>
                {formatCurrency(item.revenue)}
              </span>
            </div>
            <div className='flex items-center justify-between pl-28'>
              <span className='text-xs text-muted-foreground'>
                {item.successfulCount} {t('chart.count')}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6 pt-6 border-t border-border/70 grid grid-cols-3 gap-4'>
        <div>
          <p className='text-sm text-muted-foreground'>{t('chart.total')}</p>
          <p className='text-lg font-bold text-foreground'>
            {formatCurrency(data.reduce((sum, item) => sum + item.revenue, 0))}
          </p>
        </div>
        <div>
          <p className='text-sm text-muted-foreground'>
            {t('stats.totalTransactions')}
          </p>
          <p className='text-lg font-bold text-foreground'>
            {data.reduce((sum, item) => sum + item.successfulCount, 0)}
          </p>
        </div>
        <div>
          <p className='text-sm text-muted-foreground'>{t('chart.average')}</p>
          <p className='text-lg font-bold text-foreground'>
            {formatCurrency(
              data.reduce((sum, item) => sum + item.revenue, 0) / data.length,
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
