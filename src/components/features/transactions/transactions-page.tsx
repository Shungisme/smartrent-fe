'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Download } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { PageHeader } from '@/components/molecules/pageHeader'
import { AdminTransactionTable } from '@/components/organisms/transactions/AdminTransactionTable'
import { TransactionStatisticsCards } from '@/components/organisms/transactions/TransactionStatisticsCards'
import { TransactionService } from '@/api/services/transaction.service'
import {
  useAdminTransactions,
  useTransactionStatistics,
} from '@/hooks/useTransactions'
import { AdminTransactionFilters } from '@/types/transaction.type'

export const TransactionsPage = () => {
  const t = useTranslations('transactions')
  const router = useRouter()
  const [filters, setFilters] = useState<AdminTransactionFilters>({
    page: 1,
    size: 20,
  })

  const { data: transactionsList, isLoading: isLoadingTransactions } =
    useAdminTransactions(filters)

  const [statsFromDate, statsToDate] = (filters.createdAt ?? '').split('..')
  const { data: statistics } = useTransactionStatistics(
    statsFromDate || undefined,
    statsToDate || undefined,
  )

  const handleFiltersChange = (newFilters: AdminTransactionFilters) => {
    setFilters(newFilters)
  }

  const handleViewDetails = (transactionId: string) => {
    router.push(`/management/transactions/${transactionId}`)
  }

  const handleExport = async () => {
    try {
      await TransactionService.exportTransactions(filters)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  return (
    <div className='flex flex-col gap-6 lg:min-h-0 lg:flex-1'>
      <PageHeader title={t('title')} description={t('description')} />

      <TransactionStatisticsCards statistics={statistics} />

      <div className='flex justify-end'>
        <Button variant='outline' size='sm' onClick={handleExport}>
          <Download className='h-4 w-4' />
          {t('filters.export')}
        </Button>
      </div>

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
