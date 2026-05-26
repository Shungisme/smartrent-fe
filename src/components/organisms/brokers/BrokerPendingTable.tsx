'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, Check, X, UserX } from 'lucide-react'
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
  const t = useTranslations('moderation.brokerPending')

  const columns: Column<AdminBrokerUserResponse>[] = [
    {
      id: 'name',
      header: t('table.headers.name'),
      accessor: (row) => `${row.firstName} ${row.lastName}`,
      render: (_, row) => (
        <div className='space-y-3'>
          <div>
            <div className='text-sm font-semibold text-foreground'>
              {row.firstName} {row.lastName}
            </div>
            <div className='text-xs text-muted-foreground'>{row.userId}</div>
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
        <div className='text-sm text-foreground'>{value as string}</div>
      ),
    },
    {
      id: 'phone',
      header: t('table.headers.phone'),
      accessor: (row) => `${row.phoneCode} ${row.phoneNumber}`,
      render: (_, row) => (
        <div className='text-sm text-foreground'>
          {row.phoneCode} {row.phoneNumber}
        </div>
      ),
    },
    {
      id: 'registeredAt',
      header: t('table.headers.registeredAt'),
      accessor: 'brokerRegisteredAt',
      render: (value) => (
        <div className='text-sm text-foreground'>
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
          <div className='flex flex-col items-center gap-1.5'>
            <div className='flex items-center justify-center gap-0.5'>
              {isPending && (
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => onApprove(row)}
                  disabled={isBusy}
                  className='h-8 w-8 p-0 text-muted-foreground hover:bg-success/10 hover:text-success-foreground'
                  title={t('actions.approve')}
                >
                  {action === 'approve' ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <Check className='h-4 w-4' />
                  )}
                </Button>
              )}

              {isPending && (
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => onReject(row)}
                  disabled={isBusy}
                  className='h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                  title={t('actions.reject')}
                >
                  {action === 'reject' ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <X className='h-4 w-4' />
                  )}
                </Button>
              )}

              {isApproved && (
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => onRemove(row)}
                  disabled={isBusy}
                  className='h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
                  title={t('actions.removeBroker')}
                >
                  {action === 'remove' ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    <UserX className='h-4 w-4' />
                  )}
                </Button>
              )}
            </div>

            <a
              href={BROKER_REGISTRY_URL}
              target='_blank'
              rel='noopener noreferrer'
              className='whitespace-nowrap text-[11px] font-medium text-primary hover:underline'
            >
              {t('table.verifyLink')}
            </a>
          </div>
        )
      },
    },
  ]

  const pageSize =
    typeof filterValues.pageSize === 'number' ? filterValues.pageSize : 10

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
      itemsPerPageOptions={[5, 10, 20, 50]}
      emptyMessage={t('states.empty')}
      getRowKey={(row) => row.userId}
    />
  )
}
