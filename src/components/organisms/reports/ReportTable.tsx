import React from 'react'
import { useTranslations } from 'next-intl'
import { DataTable, Column } from '@/components/organisms/DataTable'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { InitialsAvatar } from '@/components/molecules/initialsAvatar'
import { Eye } from 'lucide-react'
import { ListingReport } from '@/api/types/listing-report.type'

type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info'

interface ReportTableProps {
  data: ListingReport[]
  loading: boolean
  onReview: (report: ListingReport) => void
}

const getStatusVariant = (status: string): BadgeVariant => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'RESOLVED':
      return 'success'
    case 'REJECTED':
      return 'secondary'
    default:
      return 'secondary'
  }
}

const statusMap = {
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'dismissed',
}

const formatDateTime = (isoString: string): { date: string; time: string } => {
  const date = new Date(isoString)
  return {
    date: date.toLocaleDateString('vi-VN'),
    time: date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  }
}

export const ReportTable: React.FC<ReportTableProps> = ({
  data,
  loading,
  onReview,
}) => {
  const t = useTranslations('reports')

  const columns: Column<ListingReport>[] = [
    {
      id: 'reportId',
      accessor: 'reportId',
      header: t('table.id'),
      defaultHidden: true,
      render: (_, row) => (
        <Badge variant='outline' className='font-mono text-xs'>
          #{row.reportId}
        </Badge>
      ),
    },
    {
      id: 'listing',
      accessor: 'listingId',
      header: t('review.reportedPost'),
      render: (_, row) => (
        <div className='leading-tight'>
          <div className='text-sm font-medium text-foreground'>
            {t('table.listingNumber')}
            {row.listingId}
          </div>
          <div className='text-xs text-muted-foreground'>
            {t.has(`categories.${row.category}`)
              ? t(`categories.${row.category}`)
              : row.category}
          </div>
        </div>
      ),
    },
    {
      id: 'reporter',
      accessor: 'reporterName',
      header: t('review.reportedBy'),
      render: (_, row) => (
        <div className='flex items-center gap-2.5'>
          <InitialsAvatar name={row.reporterName || '?'} size='sm' />
          <div className='leading-tight'>
            <div className='text-sm font-medium text-foreground'>
              {row.reporterName}
            </div>
            <div className='text-xs text-muted-foreground'>
              {row.reporterPhone}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'reasons',
      accessor: (row) => row.reportReasons?.[0]?.reasonText || '',
      header: t('review.reportReasons'),
      render: (_, row) => (
        <div className='max-w-xs'>
          {row.reportReasons && row.reportReasons.length > 0 ? (
            <div className='leading-tight'>
              <div className='text-sm font-medium text-foreground'>
                {row.reportReasons[0].reasonText}
              </div>
              {row.reportReasons.length > 1 && (
                <div className='mt-0.5 text-xs text-muted-foreground'>
                  {t('table.moreReasons', {
                    count: row.reportReasons.length - 1,
                  })}
                </div>
              )}
            </div>
          ) : (
            <span className='text-xs text-muted-foreground/70'>
              {t('table.noReasons')}
            </span>
          )}
        </div>
      ),
    },
    {
      id: 'createdAt',
      accessor: 'createdAt',
      header: t('review.reportedAt'),
      render: (_, row) => {
        const { date, time } = formatDateTime(row.createdAt)
        return (
          <div className='leading-tight'>
            <div className='text-sm text-foreground'>{date}</div>
            <div className='text-xs text-muted-foreground'>{time}</div>
          </div>
        )
      },
    },
    {
      id: 'status',
      accessor: 'status',
      header: t('review.currentStatus'),
      render: (_, row) => (
        <Badge variant={getStatusVariant(row.status)}>
          {t(`statuses.${statusMap[row.status as keyof typeof statusMap]}`)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      accessor: () => '',
      header: t('review.actions'),
      render: (_, row) => (
        <div className='flex items-center justify-center gap-0.5'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onReview(row)}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
            title={t('table.viewDetails')}
          >
            <Eye className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={data} loading={loading} />
}
