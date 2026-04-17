'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { DataTable, Column } from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/button'
import { AdminBrokerUserResponse } from '@/api/types/broker.type'
import { BrokerDocumentViewer } from './BrokerDocumentViewer'

const BROKER_REGISTRY_URL =
  'https://www.nangluchdxd.gov.vn/Canhan?page=2&pagesize=20'

type ActionKind = 'approve' | 'reject' | 'remove'

type BrokerPendingTableProps = {
  data: AdminBrokerUserResponse[]
  loading: boolean
  totalItems: number
  filterValues: Record<string, unknown>
  onFilterChange: (filters: Record<string, unknown>) => void
  actionState: Record<string, ActionKind | undefined>
  onApprove: (user: AdminBrokerUserResponse) => void
  onReject: (user: AdminBrokerUserResponse) => void
  onRemove: (user: AdminBrokerUserResponse) => void
  onDocError?: () => void
}

const formatRegistrationDate = (value?: string | null) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '--'
  return date.toLocaleDateString('vi-VN')
}

export const BrokerPendingTable: React.FC<BrokerPendingTableProps> = ({
  data,
  loading,
  totalItems,
  filterValues,
  onFilterChange,
  actionState,
  onApprove,
  onReject,
  onRemove,
  onDocError,
}) => {
  const t = useTranslations('admin.brokerPending')

  const columns: Column<AdminBrokerUserResponse>[] = [
    {
      id: 'name',
      header: t('table.headers.name'),
      accessor: (row) => `${row.firstName} ${row.lastName}`,
      render: (_, row) => (
        <div className='space-y-3'>
          <div>
            <div className='text-sm font-semibold text-gray-900'>
              {row.firstName} {row.lastName}
            </div>
            <div className='text-xs text-gray-500'>{row.userId}</div>
          </div>
          <BrokerDocumentViewer user={row} onImageError={onDocError} />
        </div>
      ),
    },
    {
      id: 'email',
      header: t('table.headers.email'),
      accessor: 'email',
      render: (value) => (
        <div className='text-sm text-gray-700'>{value as string}</div>
      ),
    },
    {
      id: 'phone',
      header: t('table.headers.phone'),
      accessor: (row) => `${row.phoneCode} ${row.phoneNumber}`,
      render: (_, row) => (
        <div className='text-sm text-gray-700'>
          {row.phoneCode} {row.phoneNumber}
        </div>
      ),
    },
    {
      id: 'registeredAt',
      header: t('table.headers.registeredAt'),
      accessor: 'brokerRegisteredAt',
      render: (value) => (
        <div className='text-sm text-gray-700'>
          {formatRegistrationDate(value as string | null)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: t('table.headers.actions'),
      accessor: () => '',
      render: (_, row) => {
        const action = actionState[row.userId]
        const isBusy = !!action
        const isPending = row.brokerVerificationStatus === 'PENDING'
        const isApproved = row.brokerVerificationStatus === 'APPROVED'

        return (
          <div className='flex flex-col gap-2'>
            <div className='flex flex-wrap gap-2'>
              {isPending && (
                <Button
                  size='sm'
                  onClick={() => onApprove(row)}
                  disabled={isBusy}
                  className='bg-blue-600 text-white hover:bg-blue-700'
                >
                  {action === 'approve' && (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  )}
                  {t('actions.approve')}
                </Button>
              )}

              {isPending && (
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => onReject(row)}
                  disabled={isBusy}
                  className='border-red-200 text-red-700 hover:bg-red-50'
                >
                  {action === 'reject' && (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  )}
                  {t('actions.reject')}
                </Button>
              )}

              {isApproved && (
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => onRemove(row)}
                  disabled={isBusy}
                >
                  {action === 'remove' && (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  )}
                  {t('actions.removeBroker')}
                </Button>
              )}
            </div>

            <a
              href={BROKER_REGISTRY_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='text-xs font-medium text-blue-600 hover:text-blue-700'
            >
              {t('table.verifyLink')}
            </a>
          </div>
        )
      },
    },
  ]

  const pageSize =
    typeof filterValues.pageSize === 'number' ? filterValues.pageSize : 20

  return (
    <DataTable
      data={data}
      columns={columns}
      filterMode='api'
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      loading={loading}
      pagination
      totalItems={totalItems}
      itemsPerPage={pageSize}
      itemsPerPageOptions={[10, 20, 50]}
      emptyMessage={t('states.empty')}
      getRowKey={(row) => row.userId}
    />
  )
}
