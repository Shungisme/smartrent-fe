'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { PageHeader } from '@/components/molecules/pageHeader'
import { TransactionStatisticsCards } from '@/components/organisms/transactions/TransactionStatisticsCards'
import { RevenueChart } from '@/components/organisms/transactions/RevenueChart'
import {
  useTransactionStatistics,
  useRevenueSeries,
} from '@/hooks/useTransactions'
import { getDateRange } from '@/utils/format'

export const TransactionsDashboardPage = () => {
  const t = useTranslations('transactions')
  const [dateRangeType, setDateRangeType] = useState<
    'month' | 'week' | 'quarter'
  >('month')
  const { fromDate, toDate } = getDateRange(dateRangeType)

  const { data: statistics, isLoading: statsLoading } =
    useTransactionStatistics(fromDate, toDate)
  const { data: revenueData, isLoading: revenueLoading } = useRevenueSeries(
    'DAY',
    fromDate,
    toDate,
  )

  return (
    <div className='space-y-6'>
      <PageHeader title={t('dashboard.title')} />

      <div className='flex gap-2'>
        {(['week', 'month', 'quarter'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setDateRangeType(range)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              dateRangeType === range
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground/80 hover:bg-muted/80'
            }`}
          >
            {t(`dashboard.${range}`)}
          </button>
        ))}
      </div>

      <TransactionStatisticsCards
        statistics={statistics}
        isLoading={statsLoading}
      />

      <RevenueChart
        data={revenueData}
        isLoading={revenueLoading}
        groupBy='DAY'
      />
    </div>
  )
}
