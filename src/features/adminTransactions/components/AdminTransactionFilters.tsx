'use client'

import { Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import {
  AdminTransactionFilters,
  PaymentGateway,
  PaymentStatus,
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
  const t = useTranslations('transactions')
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
          placeholder={t('filters.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Filter Row */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        {/* Status Filter */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            {t('filters.status')}
          </label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
          >
            <option value=''>{t('filters.allStatus')}</option>
            <option value='PENDING'>{t('status.PENDING')}</option>
            <option value='SUCCESS'>{t('status.SUCCESS')}</option>
            <option value='FAILED'>{t('status.FAILED')}</option>
            <option value='CANCELLED'>{t('status.CANCELLED')}</option>
            <option value='REFUNDED'>{t('status.REFUNDED')}</option>
          </select>
        </div>

        {/* Gateway Filter */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            {t('filters.gateway')}
          </label>
          <select
            value={gateway}
            onChange={(e) => handleGatewayChange(e.target.value)}
            className='w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary'
          >
            <option value=''>{t('filters.allGateways')}</option>
            <option value='VNPAY'>VNPay</option>
            <option value='ZALOPAY'>ZaloPay</option>
            <option value='MOMO'>MoMo</option>
          </select>
        </div>

        {/* From Date */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {t('filters.fromDate')}
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
            {t('filters.toDate')}
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
          {t('filters.quick')}
        </span>
        <Button
          size='sm'
          variant={
            fromDate === new Date().toISOString().split('T')[0] &&
            toDate === new Date().toISOString().split('T')[0]
              ? 'default'
              : 'secondary'
          }
          onClick={() => handleQuickDateRange('today')}
        >
          {t('filters.today')}
        </Button>
        <Button
          size='sm'
          variant='secondary'
          onClick={() => handleQuickDateRange('week')}
        >
          {t('filters.week')}
        </Button>
        <Button
          size='sm'
          variant='secondary'
          onClick={() => handleQuickDateRange('month')}
        >
          {t('filters.month')}
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
              {t('filters.clearFilters')}
            </Button>
          )}
        </div>
        {onExport && (
          <Button size='sm' variant='secondary' onClick={onExport}>
            {t('filters.export')}
          </Button>
        )}
      </div>
    </div>
  )
}
