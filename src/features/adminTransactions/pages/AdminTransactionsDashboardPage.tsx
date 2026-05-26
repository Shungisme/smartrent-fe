'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  useTransactionStatistics,
  useRevenueSeries,
} from '../hooks/useAdminTransactions'
import { TransactionStatisticsCards } from '../components/TransactionStatisticsCards'
import { RevenueChart } from '../components/RevenueChart'
import { getDateRange } from '@/utils/format'

/**
 * Admin Transactions Dashboard
 * Shows high-level overview of transaction metrics and trends
 */
export const AdminTransactionsDashboardPage = () => {
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
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>
          {t('dashboard.title')}
        </h1>
        <p className='mt-2 text-gray-600'>{t('dashboard.description')}</p>
      </div>

      {/* Date Range Quick Select */}
      <div className='flex gap-2'>
        <button
          onClick={() => setDateRangeType('week')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            dateRangeType === 'week'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t('dashboard.week')}
        </button>
        <button
          onClick={() => setDateRangeType('month')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            dateRangeType === 'month'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t('dashboard.month')}
        </button>
        <button
          onClick={() => setDateRangeType('quarter')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${
            dateRangeType === 'quarter'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {t('dashboard.quarter')}
        </button>
      </div>

      {/* Statistics Cards */}
      <TransactionStatisticsCards
        statistics={statistics}
        isLoading={statsLoading}
      />

      {/* Revenue Chart */}
      <RevenueChart
        data={revenueData}
        isLoading={revenueLoading}
        groupBy='DAY'
      />
    </div>
  )
}
