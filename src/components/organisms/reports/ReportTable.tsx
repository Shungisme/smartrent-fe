import React from 'react'
import { useTranslations } from 'next-intl'
import { DataTable, Column } from '@/components/organisms/DataTable'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Avatar } from '@/components/atoms/avatar'
import { Eye } from 'lucide-react'
import cn from 'classnames'
import { ListingReport } from '@/api/types/listing-report.type'

interface ReportTableProps {
  data: ListingReport[]
  loading: boolean
  onReview: (report: ListingReport) => void
}

const getInitials = (name: string) =>
  name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || ''

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'RESOLVED':
      return 'bg-green-100 text-green-800'
    case 'REJECTED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
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
      header: 'ID',
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
        <div>
          <div className='font-medium text-sm'>Listing #{row.listingId}</div>
          <div className='text-xs text-gray-500'>{row.category}</div>
        </div>
      ),
    },
    {
      id: 'reporter',
      accessor: 'reporterName',
      header: t('review.reportedBy'),
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <Avatar className='h-8 w-8'>
            <div className='flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 font-semibold text-xs'>
              {getInitials(row.reporterName)}
            </div>
          </Avatar>
          <div>
            <div className='text-sm font-medium'>{row.reporterName}</div>
            <div className='text-xs text-gray-500'>{row.reporterPhone}</div>
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
            <div className='text-sm'>
              <div className='font-medium text-gray-700'>
                {row.reportReasons[0].reasonText}
              </div>
              {row.reportReasons.length > 1 && (
                <div className='text-xs text-gray-500 mt-1'>
                  +{row.reportReasons.length - 1} more reason(s)
                </div>
              )}
            </div>
          ) : (
            <span className='text-xs text-gray-400'>No reasons specified</span>
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
          <div className='text-sm'>
            <div>{date}</div>
            <div className='text-xs text-gray-500'>{time}</div>
          </div>
        )
      },
    },
    {
      id: 'status',
      accessor: 'status',
      header: t('review.currentStatus'),
      render: (_, row) => (
        <Badge className={cn('text-xs', getStatusColor(row.status))}>
          {t(`statuses.${statusMap[row.status as keyof typeof statusMap]}`)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      accessor: () => '',
      header: t('review.actions'),
      render: (_, row) => (
        <Button size='sm' onClick={() => onReview(row)} className='text-sm'>
          <Eye className='h-4 w-4 mr-1' />
          {t('table.viewDetails')}
        </Button>
      ),
    },
  ]

  return (
    <div className='bg-white rounded-xl border border-gray-100 p-4'>
      <DataTable columns={columns} data={data} loading={loading} />
    </div>
  )
}
