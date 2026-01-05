import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import AdminLayout from '@/components/layouts/AdminLayout'
import { DataTable } from '@/components/organisms/DataTable'
import { Dialog, DialogContent } from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Avatar } from '@/components/atoms/avatar'
import { AlertTriangle, Eye, CheckCircle, XCircle } from 'lucide-react'
import cn from 'classnames'
// TODO: API call to dismiss report

import { ListingReportService } from '@/api/services/listing-report.service'
import { ListingReport } from '@/api/types/listing-report.type'

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

const ViolationReportManagement = () => {
  const t = useTranslations('reports')
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    dismissed: 0,
  })
  const [reports, setReports] = useState<ListingReport[]>([])
  const [loading, setLoading] = useState(false)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<ListingReport | null>(
    null,
  )
  const [actionReason, setActionReason] = useState('')

  // Fetch reports from API
  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const res = await ListingReportService.getReports({ page: 1, size: 50 })
      setReports(res.data.data)
      // Calculate stats
      const statObj = { total: 0, pending: 0, resolved: 0, dismissed: 0 }
      statObj.total = res.data.totalElements
      statObj.pending = res.data.data.filter(
        (r) => r.status === 'PENDING',
      ).length
      statObj.resolved = res.data.data.filter(
        (r) => r.status === 'RESOLVED',
      ).length
      statObj.dismissed = res.data.data.filter(
        (r) => r.status === 'REJECTED',
      ).length
      setStats(statObj)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  // Open review modal
  const handleOpenReview = (report: ListingReport) => {
    setSelectedReport(report)
    setActionReason('')
    setReviewModalOpen(true)
  }

  // Resolve report
  const handleResolve = async () => {
    if (!selectedReport) return
    try {
      await ListingReportService.resolveReport(selectedReport.reportId, {
        status: 'RESOLVED',
        adminNotes: actionReason,
      })
      setReviewModalOpen(false)
      setSelectedReport(null)
      setActionReason('')
      fetchReports()
    } catch (e) {
      console.error(e)
    }
  }

  // Dismiss (reject) report
  const handleDismiss = async () => {
    if (!selectedReport) return
    try {
      await ListingReportService.resolveReport(selectedReport.reportId, {
        status: 'REJECTED',
        adminNotes: actionReason,
      })
      setReviewModalOpen(false)
      setSelectedReport(null)
      setActionReason('')
      fetchReports()
    } catch (e) {
      console.error(e)
    }
  }

  const handleViewPost = () => {
    if (!selectedReport) return
    window.open(`/listing/${selectedReport.listingId}`, '_blank')
  }

  // Columns for DataTable
  const columns = [
    {
      id: 'reportId',
      accessor: 'reportId' as keyof ListingReport,
      header: 'ID',
    },
    {
      id: 'listingId',
      accessor: 'listingId' as keyof ListingReport,
      header: t('review.postId'),
    },
    {
      id: 'category',
      accessor: 'category' as keyof ListingReport,
      header: t('review.category'),
    },
    {
      id: 'status',
      accessor: 'status' as keyof ListingReport,
      header: t('review.currentStatus'),
      cell: ({ row }: { row: { original: ListingReport } }) => (
        <Badge className={cn('text-xs', getStatusColor(row.original.status))}>
          {t(
            `statuses.${statusMap[row.original.status as keyof typeof statusMap]}`,
          )}
        </Badge>
      ),
    },
    {
      id: 'reporterName',
      accessor: 'reporterName' as keyof ListingReport,
      header: t('review.reportedBy'),
    },
    {
      id: 'actions',
      accessor: () => undefined as unknown,
      header: t('review.actions'),
      cell: ({ row }: { row: { original: ListingReport } }) => (
        <Button size='sm' onClick={() => handleOpenReview(row.original)}>
          {t('review.review')}
        </Button>
      ),
    },
  ]

  return (
    <div>
      <div className='space-y-6'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              {t('title')}
            </h1>
            <p className='mt-1 text-sm text-gray-600'>{t('description')}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-gray-900'>
              {stats.total}
            </div>
            <div className='mt-1 text-sm text-gray-400'>{t('stats.total')}</div>
            <div className='mt-2 text-xs text-gray-500'>
              {t('stats.allTime')}
            </div>
          </div>
          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-yellow-600'>
              {stats.pending}
            </div>
            <div className='mt-1 text-sm text-gray-400'>
              {t('stats.pending')}
            </div>
            <div className='mt-2 text-xs text-gray-500'>
              {t('stats.needAttention')}
            </div>
          </div>
          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-green-600'>
              {stats.resolved}
            </div>
            <div className='mt-1 text-sm text-gray-400'>
              {t('stats.resolved')}
            </div>
            <div className='mt-2 text-xs text-gray-500'>
              {t('stats.actionTaken')}
            </div>
          </div>
          <div className='rounded-xl border border-gray-100 bg-white p-6'>
            <div className='text-2xl font-bold text-gray-500'>
              {stats.dismissed}
            </div>
            <div className='mt-1 text-sm text-gray-400'>
              {t('stats.dismissed')}
            </div>
            <div className='mt-2 text-xs text-gray-500'>
              {t('stats.noAction')}
            </div>
          </div>
        </div>

        {/* DataTable Component */}
        <div className='bg-white rounded-xl border border-gray-100 p-4'>
          <DataTable columns={columns} data={reports} loading={loading} />
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent>
          {selectedReport && (
            <div className='space-y-4 md:space-y-6'>
              {/* Report Info */}
              <div className='rounded-lg bg-yellow-50 border border-yellow-200 p-3 md:p-4'>
                <div className='flex items-start gap-2 md:gap-3'>
                  <AlertTriangle className='h-4 w-4 md:h-5 md:w-5 text-yellow-600 mt-0.5' />
                  <div>
                    <h4 className='text-sm md:text-base font-medium text-yellow-900'>
                      {t('review.category')}:{' '}
                      {t(`categories.${selectedReport.category}`)}
                    </h4>
                    <p className='mt-1 text-xs md:text-sm text-yellow-800'>
                      {t('review.reportedBy')} {selectedReport.reporterName}
                      {selectedReport.createdAt && (
                        <>
                          {' '}
                          {t('review.on')}{' '}
                          {new Date(selectedReport.createdAt).toLocaleString()}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Listing Info */}
              <div>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>
                  {t('review.reportedPost')}
                </h3>
                <div className='rounded-lg border border-gray-200 p-3 md:p-4'>
                  <div className='flex flex-col sm:flex-row gap-3 md:gap-4'>
                    <Image
                      src={'/images/default-image.jpg'}
                      alt={selectedReport.listingId + ''}
                      width={96}
                      height={128}
                      className='h-32 w-full sm:h-24 sm:w-24 flex-shrink-0 rounded-lg object-cover'
                    />
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-semibold text-gray-900'>
                        {t('review.postId')}: {selectedReport.listingId}
                      </h4>
                      <div className='mt-2 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600'>
                        <span>{selectedReport.category}</span>
                        <span>•</span>
                        <span className='font-semibold'>
                          {selectedReport.status}
                        </span>
                        <span>•</span>
                        <Badge
                          className={cn(
                            'text-xs',
                            getStatusColor(selectedReport.status),
                          )}
                        >
                          {t(
                            `statuses.${statusMap[selectedReport.status as keyof typeof statusMap]}`,
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reporter Info */}
              <div>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>
                  {t('review.reporterInfo')}
                </h3>
                <div className='flex items-center gap-3 rounded-lg border border-gray-200 p-3 md:p-4'>
                  <Avatar className='h-10 w-10 md:h-12 md:w-12'>
                    <div className='flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 font-semibold'>
                      {getInitials(selectedReport.reporterName)}
                    </div>
                  </Avatar>
                  <div>
                    <div className='font-medium text-gray-900'>
                      {selectedReport.reporterName}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {selectedReport.reporterEmail}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {selectedReport.reporterPhone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Content */}
              <div>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>
                  {t('review.reportContent')}
                </h3>
                <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 md:p-4'>
                  <p className='text-xs md:text-sm text-gray-700 leading-relaxed'>
                    {selectedReport.otherFeedback}
                  </p>
                </div>
              </div>

              {/* Current Status */}
              <div>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2 md:mb-3'>
                  {t('review.currentStatus')}
                </h3>
                <Badge
                  variant='outline'
                  className={cn(
                    'text-sm',
                    getStatusColor(selectedReport.status),
                  )}
                >
                  {t(
                    `statuses.${statusMap[selectedReport.status as keyof typeof statusMap]}`,
                  )}
                </Badge>
              </div>

              {/* Action Reason (if taking action) */}
              {selectedReport.status === 'PENDING' && (
                <div>
                  <label
                    htmlFor='action-reason'
                    className='text-xs md:text-sm font-medium text-gray-700'
                  >
                    {t('review.actionReason')}
                  </label>
                  <textarea
                    id='action-reason'
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder={t('review.actionPlaceholder')}
                    className='mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs md:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                    rows={3}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                <Button
                  onClick={handleViewPost}
                  variant='outline'
                  className='flex-1 text-sm'
                >
                  <Eye className='mr-2 h-4 w-4' />
                  {t('review.viewPost')}
                </Button>

                {selectedReport.status === 'PENDING' && (
                  <>
                    <Button
                      onClick={handleResolve}
                      className='flex-1 bg-green-600 hover:bg-green-700 text-sm'
                    >
                      <CheckCircle className='mr-2 h-4 w-4' />
                      {t('review.resolve')}
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      variant='outline'
                      className='flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 text-sm'
                    >
                      <XCircle className='mr-2 h-4 w-4' />
                      {t('review.dismiss')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

ViolationReportManagement.getLayout = function getLayout(
  page: React.ReactNode,
) {
  return <AdminLayout activeItem='reports'>{page}</AdminLayout>
}

export default ViolationReportManagement
