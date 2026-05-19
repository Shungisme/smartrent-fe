'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
    router.push(`/admin/transactions/${transactionId}`)
  }

  const handleExport = async () => {
    try {
      await adminTransactionsApi.exportTransactions(filters)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900'>Quản lý giao dịch</h1>
        <p className='mt-2 text-gray-600'>
          Xem và quản lý tất cả các giao dịch thanh toán từ khách hàng
        </p>
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
        isLoading={isLoadingTransactions}
        onViewDetails={handleViewDetails}
      />

      {/* Pagination */}
      {transactionsList && transactionsList.totalPages > 1 && (
        <div className='flex items-center justify-between rounded-lg border border-gray-200 p-4 bg-white'>
          <div className='text-sm text-gray-600'>
            Hiển thị trang {transactionsList.page} /{' '}
            {transactionsList.totalPages} (Tổng {transactionsList.totalElements}{' '}
            giao dịch)
          </div>
          <div className='flex gap-2'>
            <button
              onClick={() =>
                handlePageChange(Math.max(1, (filters.page || 1) - 1))
              }
              disabled={(filters.page || 1) <= 1}
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50'
            >
              Trước
            </button>
            <button
              onClick={() => handlePageChange((filters.page || 1) + 1)}
              disabled={
                !transactionsList ||
                (filters.page || 1) >= transactionsList.totalPages
              }
              className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50'
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
