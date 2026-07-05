'use client'

import { useTranslations } from 'next-intl'
import { Eye } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import {
  AdminTransaction,
  AdminTransactionFilters,
  PaymentGateway,
  PaymentStatus,
} from '@/types/transaction.type'
import {
  formatCurrency,
  formatDateTime,
  getPaymentGatewayLabel,
  formatPhoneNumber,
} from '@/utils/format'

interface AdminTransactionTableProps {
  transactions: AdminTransaction[]
  totalItems: number
  filters: AdminTransactionFilters
  onFiltersChange: (filters: AdminTransactionFilters) => void
  isLoading?: boolean
  onViewDetails: (transactionId: string) => void
}

const STATUS_BADGE_CLASS: Record<PaymentStatus, string> = {
  PENDING:
    'bg-warning/10 text-warning-foreground dark:bg-warning/20 border-warning/30',
  SUCCESS:
    'bg-success/10 text-success-foreground dark:bg-success/20 border-success/30',
  COMPLETED:
    'bg-success/10 text-success-foreground dark:bg-success/20 border-success/30',
  FAILED:
    'bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/30',
  CANCELLED: 'bg-muted text-foreground/80',
  REFUNDED: 'bg-primary/10 text-primary dark:bg-primary/20 border-primary/30',
}

export const AdminTransactionTable = ({
  transactions,
  totalItems,
  filters,
  onFiltersChange,
  isLoading,
  onViewDetails,
}: AdminTransactionTableProps) => {
  const t = useTranslations('transactions')
  const pageSize = filters.size ?? 20

  const columns: Column<AdminTransaction>[] = [
    {
      id: 'transaction',
      header: t('table.transactionId'),
      accessor: (row) => row.transactionCode,
      defaultHidden: true,
      render: (_, row) => (
        <div className='flex flex-col gap-1'>
          <span className='font-semibold'>{row.transactionCode}</span>
          {row.gatewayTransactionCode && (
            <span className='text-xs text-muted-foreground'>
              {t('table.gatewayPrefix')}: {row.gatewayTransactionCode}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'customer',
      header: t('table.customer'),
      accessor: (row) => row.customer.name,
      render: (_, row) => (
        <div className='flex flex-col gap-1'>
          <span className='text-sm font-medium'>{row.customer.name}</span>
          <span className='text-xs text-muted-foreground'>
            {formatPhoneNumber(row.customer.phone)}
          </span>
        </div>
      ),
    },
    {
      id: 'paymentType',
      header: t('table.type'),
      accessor: (row) => row.paymentType,
      render: (_, row) => {
        const key = `type.${row.paymentType}`
        return (
          <span className='text-sm'>
            {t.has(key) ? t(key) : row.paymentType}
          </span>
        )
      },
    },
    {
      id: 'gateway',
      header: t('table.gateway'),
      accessor: (row) => row.paymentGateway,
      render: (_, row) => (
        <span className='text-sm'>
          {getPaymentGatewayLabel(row.paymentGateway)}
        </span>
      ),
    },
    {
      id: 'amount',
      header: t('table.amount'),
      accessor: (row) => row.amount,
      className: 'text-right',
      render: (_, row) => (
        <span className='font-medium'>{formatCurrency(row.amount)}</span>
      ),
    },
    {
      id: 'status',
      header: t('table.status'),
      accessor: (row) => row.status,
      render: (_, row) => (
        <span
          className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ${
            STATUS_BADGE_CLASS[row.status] ?? STATUS_BADGE_CLASS.PENDING
          }`}
        >
          {t(`status.${row.status}`)}
        </span>
      ),
      minWidth: 160,
    },
    {
      id: 'createdAt',
      header: t('table.created'),
      accessor: (row) => row.createdAt,
      render: (_, row) => (
        <span className='text-sm'>{formatDateTime(row.createdAt)}</span>
      ),
    },
  ]

  const filterConfig: FilterConfig[] = [
    {
      id: 'q',
      type: 'search',
      label: t('filters.keyword'),
      placeholder: t('filters.search'),
      isFilterField: true,
    },
    {
      id: 'status',
      type: 'select',
      label: t('filters.status'),
      options: [
        { value: 'PENDING', label: t('status.PENDING') },
        { value: 'COMPLETED', label: t('status.COMPLETED') },
        { value: 'FAILED', label: t('status.FAILED') },
        { value: 'CANCELLED', label: t('status.CANCELLED') },
      ],
      isFilterField: true,
    },
    {
      id: 'gateway',
      type: 'select',
      label: t('filters.gateway'),
      options: [
        { value: 'VNPAY', label: 'VNPay' },
        { value: 'ZALOPAY', label: 'ZaloPay' },
        { value: 'MOMO', label: 'MoMo' },
        { value: 'SEPAY', label: 'SePay' },
      ],
      isFilterField: true,
    },
    {
      id: 'fromDate',
      type: 'search',
      label: t('filters.fromDate'),
      placeholder: t('filters.datePlaceholder'),
      isFilterField: true,
    },
    {
      id: 'toDate',
      type: 'search',
      label: t('filters.toDate'),
      placeholder: t('filters.datePlaceholder'),
      isFilterField: true,
    },
  ]

  return (
    <DataTable<AdminTransaction>
      data={transactions}
      columns={columns}
      filters={filterConfig}
      filterMode='api'
      filterValues={{
        q: filters.q ?? '',
        status: filters.status ?? '',
        gateway: filters.gateway ?? '',
        fromDate: filters.fromDate ?? '',
        toDate: filters.toDate ?? '',
        page: filters.page ?? 1,
        pageSize,
      }}
      onFilterChange={(next) =>
        onFiltersChange({
          ...filters,
          q: (next.q as string) || undefined,
          status: (next.status as PaymentStatus) || undefined,
          gateway: (next.gateway as PaymentGateway) || undefined,
          fromDate: (next.fromDate as string) || undefined,
          toDate: (next.toDate as string) || undefined,
          page: Number(next.page) || 1,
          size: Number(next.pageSize) || pageSize,
        })
      }
      totalItems={totalItems}
      itemsPerPage={pageSize}
      itemsPerPageOptions={[10, 20, 50]}
      loading={isLoading}
      emptyMessage={t('table.noData')}
      getRowKey={(row) => row.transactionId}
      actions={(row) => (
        <Button
          size='sm'
          variant='ghost'
          onClick={() => onViewDetails(row.transactionId)}
          className='h-8 w-8 p-0'
          title={t('table.viewDetails')}
        >
          <Eye className='h-4 w-4' />
        </Button>
      )}
    />
  )
}
