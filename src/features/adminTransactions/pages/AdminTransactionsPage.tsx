'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Download } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { adminTransactionsApi } from '../api/adminTransactionsApi'
import {
  useAdminTransactions,
  useTransactionStatistics,
} from '../hooks/useAdminTransactions'
import { AdminTransactionFilters } from '../types/transaction.type'
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
  const { data: statistics } = useTransactionStatistics(
    filters.fromDate,
    filters.toDate,
  )

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
      {/* Statistics Cards */}
      <TransactionStatisticsCards statistics={statistics} />

      {/* Export action */}
      <div className='flex justify-end'>
        <Button variant='outline' size='sm' onClick={handleExport}>
          <Download className='h-4 w-4' />
          {t('filters.export')}
        </Button>
      </div>

      {/* Transaction Table (filter button + popup handled by DataTable) */}
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
