'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Eye } from 'lucide-react'
import { DataTable, Column } from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/atoms/avatar'
import { AdminBrokerUserResponse } from '@/api/types/broker.type'
import { formatDate } from '@/utils/format'

type BrokerPendingTableProps = {
  data: AdminBrokerUserResponse[]
  loading: boolean
  totalItems: number
  filterValues: Record<string, unknown>
  onFilterChange: (filters: Record<string, unknown>) => void
  onReview: (user: AdminBrokerUserResponse) => void
}

export const BrokerPendingTable: React.FC<BrokerPendingTableProps> = ({
  data,
  loading,
  totalItems,
  filterValues,
  onFilterChange,
  onReview,
}) => {
  const t = useTranslations('moderation.brokerPending')

  const columns: Column<AdminBrokerUserResponse>[] = [
    {
      id: 'name',
      header: t('table.headers.name'),
      accessor: (row) => `${row.firstName} ${row.lastName}`,
      render: (_, row) => (
        <div className='flex items-center gap-2.5 justify-end lg:justify-start'>
          <Avatar className='h-8 w-8 shrink-0'>
            <AvatarImage src={row.avatarUrl ?? undefined} />
            <AvatarFallback className='bg-primary/10 text-primary text-xs font-semibold'>
              {row.firstName[0]}
              {row.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <span className='text-sm font-semibold text-foreground'>
            {row.firstName} {row.lastName}
          </span>
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
          {formatDate(value as string | null)}
        </div>
      ),
    },
    {
      id: 'actions',
      header: t('table.headers.actions'),
      accessor: () => '',
      render: (_, row) => (
        <Button
          size='sm'
          variant='ghost'
          onClick={() => onReview(row)}
          className='h-8 w-8 p-0 text-muted-foreground hover:bg-primary/10 hover:text-primary'
          title={t('review.title')}
        >
          <Eye className='h-4 w-4' />
        </Button>
      ),
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
