'use client'

import { useQuery } from '@tanstack/react-query'
import { TransactionService } from '@/api/services/transaction.service'
import { AdminTransactionFilters } from '@/types/transaction.type'

export const useAdminTransactions = (filters: AdminTransactionFilters) => {
  return useQuery({
    queryKey: ['adminTransactions', filters],
    queryFn: () => TransactionService.listTransactions(filters),
    enabled: true,
  })
}

export const useAdminTransactionDetail = (transactionId: string) => {
  return useQuery({
    queryKey: ['adminTransactionDetail', transactionId],
    queryFn: () => TransactionService.getTransactionDetail(transactionId),
    enabled: !!transactionId,
  })
}

export const useTransactionStatistics = (
  fromDate?: string,
  toDate?: string,
) => {
  return useQuery({
    queryKey: ['transactionStatistics', fromDate, toDate],
    queryFn: () => TransactionService.getStatistics(fromDate, toDate),
    staleTime: 5 * 60 * 1000,
  })
}

export const useRevenueSeries = (
  groupBy: 'DAY' | 'MONTH' = 'DAY',
  fromDate?: string,
  toDate?: string,
) => {
  return useQuery({
    queryKey: ['revenueSeries', groupBy, fromDate, toDate],
    queryFn: () =>
      TransactionService.getRevenueSeries(groupBy, fromDate, toDate),
    staleTime: 5 * 60 * 1000,
  })
}
