'use client'

import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Select } from '@/components/atoms/Select'
import {
  AdminTransactionFilters,
  PaymentGateway,
  PaymentStatus,
  PaymentType,
} from '../types/transaction.type'
import { getDateRange } from '../utils/formatters'

interface AdminTransactionFiltersProps {
  filters: AdminTransactionFilters
  onFiltersChange: (filters: AdminTransactionFilters) => void
  onExport?: () => void
}

/**
 * Admin Transaction Filters Component
 * Provides search, filters, and date range selection
 */
export const AdminTransactionFiltersComponent = ({
  filters,
  onFiltersChange,
  onExport,
}: AdminTransactionFiltersProps) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState(filters.q || '')
  const [status, setStatus] = useState<PaymentStatus | ''>(filters.status || '')
  const [gateway, setGateway] = useState<PaymentGateway | ''>(
    filters.gateway || '',
  )
  const [fromDate, setFromDate] = useState(filters.fromDate || '')
  const [toDate, setToDate] = useState(filters.toDate || '')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange({
        ...filters,
        q: searchQuery,
        page: 1,
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const handleStatusChange = (value: string) => {
    setStatus(value as PaymentStatus)
    onFiltersChange({
      ...filters,
      status: (value as PaymentStatus) || undefined,
      page: 1,
    })
  }

  const handleGatewayChange = (value: string) => {
    setGateway(value as PaymentGateway)
    onFiltersChange({
      ...filters,
      gateway: (value as PaymentGateway) || undefined,
      page: 1,
    })
  }

  const handleFromDateChange = (value: string) => {
    setFromDate(value)
    onFiltersChange({
      ...filters,
      fromDate: value || undefined,
      page: 1,
    })
  }

  const handleToDateChange = (value: string) => {
    setToDate(value)
    onFiltersChange({
      ...filters,
      toDate: value || undefined,
      page: 1,
    })
  }

  const handleQuickDateRange = (range: 'today' | 'week' | 'month') => {
    const { fromDate, toDate } = getDateRange(range)
    setFromDate(fromDate)
    setToDate(toDate)
    onFiltersChange({
      ...filters,
      fromDate,
      toDate,
      page: 1,
    })
  }

  const handleReset = () => {
    setSearchQuery('')
    setStatus('')
    setGateway('')
    setFromDate('')
    setToDate('')
    onFiltersChange({
      page: 1,
      size: filters.size,
    })
  }

  const hasActiveFilters =
    searchQuery || status || gateway || fromDate || toDate

  return (
    <div className='space-y-4 rounded-lg border border-gray-200 p-4 bg-white'>
      {/* Search Bar */}
      <div className='relative'>
        <Search className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
        <Input
          placeholder='Tìm kiếm mã giao dịch, mã hóa đơn hoặc mã cổng...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Filter Row */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        {/* Status Filter */}
        <Select
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          options={[
            { label: 'Tất cả trạng thái', value: '' },
            { label: 'Chờ xử lý', value: 'PENDING' },
            { label: 'Thành công', value: 'SUCCESS' },
            { label: 'Thất bại', value: 'FAILED' },
            { label: 'Đã huỷ', value: 'CANCELLED' },
            { label: 'Hoàn tiền', value: 'REFUNDED' },
          ]}
          label='Trạng thái'
        />

        {/* Gateway Filter */}
        <Select
          value={gateway}
          onChange={(e) => handleGatewayChange(e.target.value)}
          options={[
            { label: 'Tất cả cổng', value: '' },
            { label: 'VNPay', value: 'VNPAY' },
            { label: 'ZaloPay', value: 'ZALOPAY' },
            { label: 'MoMo', value: 'MOMO' },
          ]}
          label='Cổng thanh toán'
        />

        {/* From Date */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Từ ngày
          </label>
          <input
            type='date'
            value={fromDate}
            onChange={(e) => handleFromDateChange(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>

        {/* To Date */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Đến ngày
          </label>
          <input
            type='date'
            value={toDate}
            onChange={(e) => handleToDateChange(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
          />
        </div>
      </div>

      {/* Quick Date Range Buttons */}
      <div className='flex gap-2 flex-wrap'>
        <span className='text-sm font-medium text-gray-700 self-center'>
          Nhanh:
        </span>
        <Button
          size='sm'
          variant={
            fromDate === new Date().toISOString().split('T')[0] &&
            toDate === new Date().toISOString().split('T')[0]
              ? 'primary'
              : 'secondary'
          }
          onClick={() => handleQuickDateRange('today')}
        >
          Hôm nay
        </Button>
        <Button
          size='sm'
          variant='secondary'
          onClick={() => handleQuickDateRange('week')}
        >
          7 ngày qua
        </Button>
        <Button
          size='sm'
          variant='secondary'
          onClick={() => handleQuickDateRange('month')}
        >
          Tháng này
        </Button>
      </div>

      {/* Action Buttons */}
      <div className='flex gap-2 justify-between'>
        <div className='flex gap-2'>
          {hasActiveFilters && (
            <Button
              size='sm'
              variant='secondary'
              onClick={handleReset}
              className='gap-2'
            >
              <X className='h-4 w-4' />
              Xóa bộ lọc
            </Button>
          )}
        </div>
        {onExport && (
          <Button size='sm' variant='secondary' onClick={onExport}>
            Xuất CSV
          </Button>
        )}
      </div>
    </div>
  )
}
