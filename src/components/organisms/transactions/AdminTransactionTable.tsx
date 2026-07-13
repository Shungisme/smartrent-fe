'use client'

import { ReactNode } from 'react'
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
  PaymentType,
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
  toolbarActions?: ReactNode
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
  toolbarActions,
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

  const paymentTypeOptions: PaymentType[] = [
    'MONTHLY_INVOICE',
    'MEMBERSHIP_PURCHASE',
    'MEMBERSHIP_UPGRADE',
    'MEMBERSHIP_RENEWAL',
    'LISTING_BOOST',
    'LISTING_POST',
    'POST_FEE',
    'REPOST_FEE',
    'PUSH_FEE',
  ]

  const filterConfig: FilterConfig[] = [
    {
      // Visible quick-search mapped to the backend `q` param, which OR-searches
      // transaction/gateway/reference/invoice codes and order info.
      id: 'q',
      type: 'search',
      label: t('filters.search'),
      placeholder: t('filters.search'),
    },
    {
      id: 'transactionId',
      type: 'search',
      label: t('filters.transactionId'),
      placeholder: t('filters.transactionIdPlaceholder'),
      isFilterField: true,
    },
    {
      id: 'customer',
      type: 'search',
      label: t('filters.customer'),
      placeholder: t('filters.customerPlaceholder'),
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
      id: 'paymentGateway',
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
      id: 'paymentType',
      type: 'select',
      label: t('filters.paymentType'),
      options: paymentTypeOptions.map((value) => ({
        value,
        label: t.has(`type.${value}`) ? t(`type.${value}`) : value,
      })),
      isFilterField: true,
    },
    {
      id: 'createdAt',
      type: 'date-range',
      label: t('filters.createdAt'),
      isFilterField: true,
    },
  ]

  return (
    <DataTable<AdminTransaction>
      data={transactions}
      toolbarActions={toolbarActions}
      columns={columns}
      filters={filterConfig}
      filterMode='api'
      filterValues={{
        q: filters.q ?? '',
        transactionId: filters.transactionId ?? '',
        customer: filters.customer ?? '',
        status: filters.status ?? '',
        paymentGateway: filters.paymentGateway ?? '',
        paymentType: filters.paymentType ?? '',
        createdAt: filters.createdAt ?? '',
        page: filters.page ?? 1,
        pageSize,
      }}
      onFilterChange={(next) =>
        onFiltersChange({
          ...filters,
          q: (next.q as string) || undefined,
          transactionId: (next.transactionId as string) || undefined,
          customer: (next.customer as string) || undefined,
          status: (next.status as PaymentStatus) || undefined,
          paymentGateway: (next.paymentGateway as PaymentGateway) || undefined,
          paymentType: (next.paymentType as PaymentType) || undefined,
          createdAt: (next.createdAt as string) || undefined,
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
        <div className='flex items-center justify-center gap-0.5'>
          <Button
            size='sm'
            variant='ghost'
            onClick={() => onViewDetails(row.transactionId)}
            className='h-8 w-8 p-0'
            title={t('table.viewDetails')}
          >
            <Eye className='h-4 w-4' />
          </Button>
        </div>
      )}
    />
  )
}
