'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { adminTransactionsApi } from '../api/adminTransactionsApi'
import {
  useAdminTransactions,
  useTransactionStatistics,
} from '../hooks/useAdminTransactions'
import { AdminTransactionFilters } from '../types/transaction.type'
import { AdminTransactionFiltersComponent } from '../components/AdminTransactionFilters'
import { AdminTransactionTable } from '../components/AdminTransactionTable'
import { TransactionStatisticsCards } from '../components/TransactionStatisticsCards'

/**
 * Admin Transactions List Page
 */
export const AdminTransactionsPage = () => {
  const t = useTranslations('transactions')
  const router = useRouter()
  const [filters, setFilters] = useState<AdminTransactionFilters>({
    page: 1,
    size: 20,
  })

  const { data: transactionsList, isLoading: isLoadingTransactions } =
    useAdminTransactions(filters)
  const { data: statistics, isLoading: isLoadingStatistics } =
    useTransactionStatistics(filters.fromDate, filters.toDate)

  const handleFiltersChange = (newFilters: AdminTransactionFilters) => {
    setFilters(newFilters)
  }

  const handleViewDetails = (transactionId: string) => {
    router.push(`/management/transactions/${transactionId}`)
  }

  const handleExport = async () => {
    try {
      await adminTransactionsApi.exportTransactions(filters)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>{t('title')}</h1>
        <p className='mt-2 text-gray-600'>{t('description')}</p>
      </div>

      {/* Statistics Cards */}
      <TransactionStatisticsCards
        statistics={statistics}
        isLoading={isLoadingStatistics}
      />

      {/* Filters */}
      <AdminTransactionFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
      />

      {/* Transaction Table */}
      <AdminTransactionTable
        transactions={transactionsList?.data || []}
        totalItems={transactionsList?.totalElements || 0}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        isLoading={isLoadingTransactions}
        onViewDetails={handleViewDetails}
      />
    </div>
  )
}
