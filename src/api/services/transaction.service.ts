import { instanceClientAxios as axiosInstance } from '@/configs/axios/axiosClient'
import {
  AdminTransactionDetail,
  AdminTransactionFilters,
  AdminTransactionListResponse,
  RevenueSeries,
  TransactionStatistics,
} from '@/types/transaction.type'

export const TransactionService = {
  listTransactions: async (filters: AdminTransactionFilters) => {
    const params = new URLSearchParams()

    if (filters.page) params.append('page', String(filters.page))
    if (filters.size) params.append('size', String(filters.size))
    if (filters.q) params.append('q', filters.q)
    if (filters.status) params.append('status', filters.status)
    if (filters.gateway) params.append('gateway', filters.gateway)
    if (filters.type) params.append('type', filters.type)
    if (filters.customerId) params.append('customerId', filters.customerId)
    if (filters.landlordId) params.append('landlordId', filters.landlordId)
    if (filters.fromDate) params.append('fromDate', filters.fromDate)
    if (filters.toDate) params.append('toDate', filters.toDate)
    if (filters.sort) params.append('sort', filters.sort)

    const response = await axiosInstance.get<{
      data: AdminTransactionListResponse
    }>(`/v1/admin/transactions?${params.toString()}`)
    return response.data.data
  },

  getTransactionDetail: async (transactionId: string) => {
    const response = await axiosInstance.get<{ data: AdminTransactionDetail }>(
      `/v1/admin/transactions/${transactionId}`,
    )
    return response.data.data
  },

  getStatistics: async (fromDate?: string, toDate?: string) => {
    const params = new URLSearchParams()
    if (fromDate) params.append('fromDate', fromDate)
    if (toDate) params.append('toDate', toDate)

    const response = await axiosInstance.get<{ data: TransactionStatistics }>(
      `/v1/admin/transactions/statistics?${params.toString()}`,
    )
    return response.data.data
  },

  getRevenueSeries: async (
    groupBy: 'DAY' | 'MONTH',
    fromDate?: string,
    toDate?: string,
  ) => {
    const params = new URLSearchParams()
    params.append('groupBy', groupBy)
    if (fromDate) params.append('fromDate', fromDate)
    if (toDate) params.append('toDate', toDate)

    const response = await axiosInstance.get<{ data: RevenueSeries[] }>(
      `/v1/admin/transactions/revenue-series?${params.toString()}`,
    )
    return response.data.data
  },

  exportTransactions: async (filters: AdminTransactionFilters) => {
    const params = new URLSearchParams()

    if (filters.q) params.append('q', filters.q)
    if (filters.status) params.append('status', filters.status)
    if (filters.gateway) params.append('gateway', filters.gateway)
    if (filters.type) params.append('type', filters.type)
    if (filters.customerId) params.append('customerId', filters.customerId)
    if (filters.landlordId) params.append('landlordId', filters.landlordId)
    if (filters.fromDate) params.append('fromDate', filters.fromDate)
    if (filters.toDate) params.append('toDate', filters.toDate)

    const response = await axiosInstance.get(
      `/v1/admin/transactions/export?${params.toString()}`,
      { responseType: 'blob' },
    )

    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      `transactions-${new Date().toISOString().split('T')[0]}.csv`,
    )
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
}
