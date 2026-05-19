'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { DataTable, Column } from '@/components/organisms/DataTable'
import {
  AdminTransaction,
  AdminTransactionFilters,
  PaymentStatus,
} from '../types/transaction.type'
import {
  formatDateTime,
  formatPhoneNumber,
  formatVND,
  getPaymentGatewayLabel,
} from '../utils/formatters'

interface AdminTransactionTableProps {
  transactions: AdminTransaction[]
  totalItems: number
  filters: AdminTransactionFilters
  onFiltersChange: (filters: AdminTransactionFilters) => void
  isLoading?: boolean
  onViewDetails: (transactionId: string) => void
}

const STATUS_BADGE_CLASS: Record<PaymentStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  SUCCESS: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  REFUNDED: 'bg-blue-100 text-blue-800',
}

/**
 * Admin Transaction Table
 * Renders the transaction list through the shared DataTable organism
 * (server-driven pagination via filterMode="api").
 */
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
      header: t('table.transaction'),
      accessor: (row) => row.transactionCode,
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
      id: 'invoiceRoom',
      header: t('table.invoice'),
      accessor: (row) => row.invoice?.invoiceCode ?? '',
      render: (_, row) => (
        <div className='flex flex-col gap-1'>
          {row.invoice && (
            <span className='text-sm'>{row.invoice.invoiceCode}</span>
          )}
          {row.room && (
            <span className='text-xs text-muted-foreground'>
              {row.room.roomCode} - {row.room.roomName}
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
      id: 'landlord',
      header: t('table.landlord'),
      accessor: (row) => row.landlord?.name ?? '',
      render: (_, row) =>
        row.landlord ? (
          <div className='flex flex-col gap-1'>
            <span className='text-sm font-medium'>{row.landlord.name}</span>
            <span className='text-xs text-muted-foreground'>
              {formatPhoneNumber(row.landlord.phone)}
            </span>
          </div>
        ) : (
          <span className='text-muted-foreground'>-</span>
        ),
    },
    {
      id: 'paymentType',
      header: t('table.type'),
      accessor: (row) => row.paymentType,
      render: (_, row) => (
        <span className='text-sm'>{t(`type.${row.paymentType}`)}</span>
      ),
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
        <span className='font-medium'>{formatVND(row.amount)}</span>
      ),
    },
    {
      id: 'status',
      header: t('table.status'),
      accessor: (row) => row.status,
      render: (_, row) => (
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
            STATUS_BADGE_CLASS[row.status] ?? STATUS_BADGE_CLASS.PENDING
          }`}
        >
          {t(`status.${row.status}`)}
        </span>
      ),
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

  return (
    <DataTable<AdminTransaction>
      data={transactions}
      columns={columns}
      filterMode='api'
      filterValues={{ page: filters.page ?? 1, pageSize }}
      onFilterChange={(next) =>
        onFiltersChange({
          ...filters,
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
        >
          {t('table.viewDetails')}
        </Button>
      )}
    />
  )
}
