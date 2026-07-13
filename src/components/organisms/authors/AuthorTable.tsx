'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Eye, Ban, ShieldCheck, AlertTriangle } from 'lucide-react'
import { DataTable } from '@/components/organisms/DataTable'
import type {
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable/types'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { InitialsAvatar } from '@/components/molecules/initialsAvatar'
import { ReportedAuthor } from '@/api/types/reported-author.type'

interface AuthorTableProps {
  authors: ReportedAuthor[]
  totalItems: number
  loading: boolean
  filterValues: Record<string, unknown>
  onFilterChange: (filters: Record<string, unknown>) => void
  onViewReports: (author: ReportedAuthor) => void
  onToggleBlock: (author: ReportedAuthor) => void
}

const fullName = (a: ReportedAuthor) =>
  `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() || a.userId

export const AuthorTable: React.FC<AuthorTableProps> = ({
  authors,
  totalItems,
  loading,
  filterValues,
  onFilterChange,
  onViewReports,
  onToggleBlock,
}) => {
  const t = useTranslations('authors')

  const columns: Column<ReportedAuthor>[] = [
    {
      id: 'author',
      header: t('table.headers.author'),
      accessor: (row) => fullName(row),
      render: (_v, row) => (
        <div className='flex items-center gap-3'>
          <InitialsAvatar name={fullName(row)} src={row.avatarUrl} size='sm' />
          <div className='min-w-0'>
            <div className='truncate font-medium text-foreground'>
              {fullName(row)}
            </div>
            <div className='truncate text-xs text-muted-foreground'>
              {row.email || '—'}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'phone',
      header: t('table.headers.phone'),
      accessor: 'phoneNumber',
      render: (v) => (
        <span className='text-sm text-muted-foreground'>
          {(v as string) || '—'}
        </span>
      ),
    },
    {
      id: 'totalReports',
      header: t('table.headers.totalReports'),
      accessor: 'totalReports',
      align: 'center',
      render: (v) => <Badge variant='secondary'>{v as number}</Badge>,
    },
    {
      id: 'resolvedReports',
      header: t('table.headers.approvedReports'),
      accessor: 'resolvedReports',
      align: 'center',
      render: (v, row) => (
        <Badge variant={row.blockEligible ? 'warning' : 'secondary'}>
          {v as number}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: t('table.headers.status'),
      accessor: 'postingBlocked',
      render: (_v, row) => {
        if (row.postingBlocked) {
          return (
            <Badge variant='destructive' className='gap-1'>
              <Ban className='h-3 w-3' />
              {t('status.blocked')}
            </Badge>
          )
        }
        if (row.blockEligible) {
          return (
            <Badge variant='warning' className='gap-1'>
              <AlertTriangle className='h-3 w-3' />
              {t('status.eligible')}
            </Badge>
          )
        }
        return (
          <Badge variant='success' className='gap-1'>
            <ShieldCheck className='h-3 w-3' />
            {t('status.active')}
          </Badge>
        )
      },
    },
  ]

  const filterConfig: FilterConfig[] = [
    {
      // Visible quick-search mapped to the `name` param, which the backend
      // OR-matches against first + last name. email/phone stay in the dialog —
      // the backend AND-combines them, so they can't share one search box.
      id: 'name',
      type: 'search',
      label: t('filters.searchPlaceholder'),
      placeholder: t('filters.searchPlaceholder'),
    },
    {
      id: 'email',
      type: 'search',
      label: t('table.headers.email'),
      placeholder: t('filters.emailPlaceholder'),
      isFilterField: true,
    },
    {
      id: 'phone',
      type: 'search',
      label: t('table.headers.phone'),
      placeholder: t('filters.phonePlaceholder'),
      isFilterField: true,
    },
    {
      id: 'blockEligible',
      type: 'select',
      label: t('filters.blockEligible'),
      isFilterField: true,
      options: [
        { value: 'true', label: t('filters.eligibleOnly') },
        { value: 'false', label: t('filters.notEligibleOnly') },
      ],
    },
  ]

  return (
    <DataTable
      data={authors}
      columns={columns}
      filters={filterConfig}
      filterMode='api'
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      totalItems={totalItems}
      itemsPerPageOptions={[10, 20, 50]}
      loading={loading}
      emptyMessage={t('table.empty')}
      getRowKey={(row) => row.userId}
      actions={(row) => (
        <div className='flex items-center justify-end gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => onViewReports(row)}
          >
            <Eye className='h-4 w-4' />
            {t('table.actions.viewReports')}
          </Button>
          {row.postingBlocked ? (
            <Button
              variant='outline'
              size='sm'
              onClick={() => onToggleBlock(row)}
            >
              <ShieldCheck className='h-4 w-4' />
              {t('table.actions.unblock')}
            </Button>
          ) : (
            <Button
              variant='destructive'
              size='sm'
              disabled={!row.blockEligible}
              title={
                !row.blockEligible
                  ? t('table.actions.blockDisabledHint')
                  : undefined
              }
              onClick={() => onToggleBlock(row)}
            >
              <Ban className='h-4 w-4' />
              {t('table.actions.block')}
            </Button>
          )}
        </div>
      )}
    />
  )
}
