'use client'

import { useQuery } from '@tanstack/react-query'
import { adminTransactionsApi } from '../api/adminTransactionsApi'
import { AdminTransactionFilters } from '../types/transaction.type'

/**
 * Hook to fetch paginated transaction list
 */
export const useAdminTransactions = (filters: AdminTransactionFilters) => {
  return useQuery({
    queryKey: ['adminTransactions', filters],
    queryFn: () => adminTransactionsApi.listTransactions(filters),
    enabled: true,
  })
}

/**
 * Hook to fetch single transaction detail
 */
export const useAdminTransactionDetail = (transactionId: string) => {
  return useQuery({
    queryKey: ['adminTransactionDetail', transactionId],
    queryFn: () => adminTransactionsApi.getTransactionDetail(transactionId),
    enabled: !!transactionId,
  })
}

/**
 * Hook to fetch transaction statistics
 */
export const useTransactionStatistics = (
  fromDate?: string,
  toDate?: string,
) => {
  return useQuery({
    queryKey: ['transactionStatistics', fromDate, toDate],
    queryFn: () => adminTransactionsApi.getStatistics(fromDate, toDate),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  })
}

/**
 * Hook to fetch revenue series data
 */
export const useRevenueSeries = (
  groupBy: 'DAY' | 'MONTH' = 'DAY',
  fromDate?: string,
  toDate?: string,
) => {
  return useQuery({
    queryKey: ['revenueSeries', groupBy, fromDate, toDate],
    queryFn: () =>
      adminTransactionsApi.getRevenueSeries(groupBy, fromDate, toDate),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  })
}
