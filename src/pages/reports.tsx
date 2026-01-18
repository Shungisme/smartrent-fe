import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import AdminLayout from '@/components/layouts/AdminLayout'
import { DataTable, Column } from '@/components/organisms/DataTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Avatar } from '@/components/atoms/avatar'
import {
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Home,
  Building2,
  Briefcase,
  MapPin,
} from 'lucide-react'
import cn from 'classnames'
import { ListingReport } from '@/api/types/listing-report.type'
import { ListingService } from '@/api/services/listing.service'
import { ListingResponseWithAdmin } from '@/api/types/listing.type'
import { toast } from 'sonner'

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

const getPropertyIcon = (type: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    HOUSE: <Home className='h-4 w-4' />,
    APARTMENT: <Building2 className='h-4 w-4' />,
    OFFICE: <Briefcase className='h-4 w-4' />,
    LAND: <MapPin className='h-4 w-4' />,
    ROOM: <Building2 className='h-4 w-4' />,
  }
  return iconMap[type] || <Home className='h-4 w-4' />
}

const formatPrice = (price: number, priceUnit: string): string => {
  const formatted = new Intl.NumberFormat('vi-VN').format(price)
  const unitMap: Record<string, string> = {
    VND_PER_MONTH: 'đ/tháng',
    VND_PER_YEAR: 'đ/năm',
    VND_TOTAL: 'đ',
  }
  return `${formatted}${unitMap[priceUnit] || 'đ'}`
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
  const [listingDetails, setListingDetails] =
    useState<ListingResponseWithAdmin | null>(null)
  const [loadingListing, setLoadingListing] = useState(false)
  const [actionReason, setActionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Fetch reports from API
  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const res = await ListingService.getReports({ page: 1, size: 50 })
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

  // Open review modal and fetch listing details
  const handleOpenReview = async (report: ListingReport) => {
    setSelectedReport(report)
    setActionReason(report.adminNotes || '')
    setReviewModalOpen(true)
    setListingDetails(null)
    setCurrentImageIndex(0)
    setLightboxOpen(false)

    // Fetch listing details
    try {
      setLoadingListing(true)
      const response = await ListingService.getListingDetail(report.listingId)
      if (response.data) {
        setListingDetails(response.data)
      }
    } catch (error) {
      console.error('Error fetching listing details:', error)
      toast.error('Failed to load listing details')
    } finally {
      setLoadingListing(false)
    }
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToNextImage = () => {
    if (listingDetails?.media) {
      setCurrentImageIndex((prev) =>
        prev === listingDetails.media.length - 1 ? 0 : prev + 1,
      )
    }
  }

  const goToPreviousImage = () => {
    if (listingDetails?.media) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listingDetails.media.length - 1 : prev - 1,
      )
    }
  }

  // Resolve report
  const handleResolve = async () => {
    if (!selectedReport) return

    if (!actionReason.trim()) {
      toast.warning('Please provide admin notes for resolution')
      return
    }

    try {
      setActionLoading(true)
      await ListingService.resolveReport(selectedReport.reportId, {
        status: 'RESOLVED',
        adminNotes: actionReason,
      })
      toast.success('Report has been resolved successfully')
      setReviewModalOpen(false)
      setSelectedReport(null)
      setListingDetails(null)
      setActionReason('')
      fetchReports()
    } catch (e) {
      console.error(e)
      toast.error('Failed to resolve report. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  // Dismiss (reject) report
  const handleDismiss = async () => {
    if (!selectedReport) return

    if (!actionReason.trim()) {
      toast.warning('Please provide a reason for dismissal')
      return
    }

    try {
      setActionLoading(true)
      await ListingService.resolveReport(selectedReport.reportId, {
        status: 'REJECTED',
        adminNotes: actionReason,
      })
      toast.success('Report has been dismissed')
      setReviewModalOpen(false)
      setSelectedReport(null)
      setListingDetails(null)
      setActionReason('')
      fetchReports()
    } catch (e) {
      console.error(e)
      toast.error('Failed to dismiss report. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  // Columns for DataTable
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
        <Button
          size='sm'
          onClick={() => handleOpenReview(row)}
          className='text-sm'
        >
          <Eye className='h-4 w-4 mr-1' />
          {t('table.viewDetails')}
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
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)] mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl md:text-2xl font-semibold'>
              {t('review.title')}
            </DialogTitle>
          </DialogHeader>

          {selectedReport && (
            <div className='space-y-4 md:space-y-6'>
              {/* Report Info Alert */}
              <div className='rounded-lg bg-yellow-50 border border-yellow-200 p-3 md:p-4'>
                <div className='flex items-start gap-2 md:gap-3'>
                  <AlertTriangle className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
                  <div className='flex-1'>
                    <h4 className='text-sm md:text-base font-medium text-yellow-900'>
                      Report #{selectedReport.reportId} -{' '}
                      {selectedReport.category}
                    </h4>
                    <p className='mt-1 text-xs md:text-sm text-yellow-800'>
                      Reported by <strong>{selectedReport.reporterName}</strong>
                      {selectedReport.createdAt && (
                        <>
                          {' '}
                          on {
                            formatDateTime(selectedReport.createdAt).date
                          } at {formatDateTime(selectedReport.createdAt).time}
                        </>
                      )}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      'text-xs flex-shrink-0',
                      getStatusColor(selectedReport.status),
                    )}
                  >
                    {t(
                      `statuses.${statusMap[selectedReport.status as keyof typeof statusMap]}`,
                    )}
                  </Badge>
                </div>
              </div>

              {/* Report Reasons */}
              {selectedReport.reportReasons &&
                selectedReport.reportReasons.length > 0 && (
                  <div className='flex flex-col gap-2'>
                    <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2'>
                      {t('review.reportReasons')}
                    </h3>
                    <div className='space-y-2'>
                      {selectedReport.reportReasons.map((reason, idx) => (
                        <div
                          key={reason.reasonId}
                          className='flex items-start gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3'
                        >
                          <div className='flex-shrink-0 mt-0.5'>
                            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-700 text-xs font-semibold'>
                              {idx + 1}
                            </div>
                          </div>
                          <div className='flex-1'>
                            <p className='text-sm text-gray-900 font-medium'>
                              {reason.reasonText}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Additional Feedback */}
              {selectedReport.otherFeedback && (
                <div className='flex flex-col gap-2'>
                  <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2'>
                    {t('review.additionalFeedback')}
                  </h3>
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 md:p-4'>
                    <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
                      {selectedReport.otherFeedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Reporter Info */}
              <div className='flex flex-col gap-2'>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2'>
                  {t('review.reporterInfo')}
                </h3>
                <div className='flex items-center gap-3 rounded-lg border border-gray-200 p-3 md:p-4'>
                  <Avatar className='h-12 w-12'>
                    <div className='flex h-full w-full items-center justify-center bg-blue-100 text-blue-700 font-semibold text-lg'>
                      {getInitials(selectedReport.reporterName)}
                    </div>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='font-medium text-gray-900 text-base'>
                      {selectedReport.reporterName}
                    </div>
                    <div className='text-sm text-gray-600 mt-0.5'>
                      {selectedReport.reporterEmail}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {selectedReport.reporterPhone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Listing Details */}
              <div className='flex flex-col gap-2'>
                <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2'>
                  {t('review.reportedPost')}
                </h3>

                {loadingListing ? (
                  <div className='flex items-center justify-center p-8 border border-gray-200 rounded-lg'>
                    <Loader2 className='h-6 w-6 animate-spin text-blue-600' />
                    <span className='ml-2 text-sm text-gray-600'>
                      Loading listing details...
                    </span>
                  </div>
                ) : listingDetails ? (
                  <div className='rounded-lg border border-gray-200 p-4 space-y-4'>
                    {/* Images Gallery */}
                    {listingDetails.media &&
                      listingDetails.media.length > 0 && (
                        <div className='flex gap-2 overflow-x-auto pb-2'>
                          {listingDetails.media.map((media, idx) => (
                            <div
                              key={idx}
                              onClick={() => openLightbox(idx)}
                              className='relative h-24 w-32 md:h-32 md:w-48 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group'
                            >
                              <Image
                                src={media.url}
                                alt={`${listingDetails.title} ${idx + 1}`}
                                width={192}
                                height={128}
                                className='h-full w-full object-cover transition-transform group-hover:scale-110'
                              />
                              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center'>
                                <Eye className='h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity' />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Basic Info */}
                    <div>
                      <h4 className='text-lg font-semibold text-gray-900'>
                        {listingDetails.title}
                      </h4>
                      <p className='text-sm text-gray-500 mt-1'>
                        Listing ID: #{listingDetails.listingId}
                      </p>
                    </div>

                    {/* Description */}
                    {listingDetails.description && (
                      <div>
                        <div className='text-sm font-medium text-gray-700 mb-1'>
                          {t('review.description')}
                        </div>
                        <div className='text-sm text-gray-600 whitespace-pre-wrap'>
                          {listingDetails.description}
                        </div>
                      </div>
                    )}

                    {/* Property Details Grid */}
                    <div className='grid grid-cols-2 gap-3 md:gap-4'>
                      <div>
                        <div className='text-xs text-gray-500'>
                          {t('review.propertyType')}
                        </div>
                        <div className='flex items-center gap-2 mt-1'>
                          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100'>
                            {getPropertyIcon(listingDetails.productType)}
                          </div>
                          <span className='text-sm font-medium'>
                            {listingDetails.productType}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className='text-xs text-gray-500'>
                          {t('review.price')}
                        </div>
                        <div className='text-sm font-semibold text-gray-900 mt-1'>
                          {formatPrice(
                            listingDetails.price,
                            listingDetails.priceUnit,
                          )}
                        </div>
                      </div>
                      {listingDetails.area && (
                        <div>
                          <div className='text-xs text-gray-500'>
                            {t('review.area')}
                          </div>
                          <div className='text-sm font-medium mt-1'>
                            {listingDetails.area}m²
                          </div>
                        </div>
                      )}
                      {listingDetails.bedrooms !== null &&
                        listingDetails.bedrooms !== undefined && (
                          <div>
                            <div className='text-xs text-gray-500'>
                              {t('review.bedrooms')}
                            </div>
                            <div className='text-sm font-medium mt-1'>
                              {listingDetails.bedrooms}
                            </div>
                          </div>
                        )}
                      {listingDetails.bathrooms !== null &&
                        listingDetails.bathrooms !== undefined && (
                          <div>
                            <div className='text-xs text-gray-500'>
                              {t('review.bathrooms')}
                            </div>
                            <div className='text-sm font-medium mt-1'>
                              {listingDetails.bathrooms}
                            </div>
                          </div>
                        )}
                      {listingDetails.direction && (
                        <div>
                          <div className='text-xs text-gray-500'>
                            {t('review.direction')}
                          </div>
                          <div className='text-sm font-medium mt-1'>
                            {listingDetails.direction}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    {listingDetails.address && (
                      <div>
                        <div className='text-xs text-gray-500'>
                          {t('review.location')}
                        </div>
                        <div className='text-sm text-gray-700 mt-1'>
                          {listingDetails.address.fullAddress}
                        </div>
                      </div>
                    )}

                    {/* Listing Status */}
                    <div className='flex items-center gap-2 pt-2 border-t'>
                      <span className='text-xs text-gray-500'>
                        {t('review.listingStatus')}
                      </span>
                      <Badge
                        className={cn(
                          'text-xs',
                          listingDetails.verified
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800',
                        )}
                      >
                        {listingDetails.verified
                          ? t('review.verified')
                          : t('review.pendingVerification')}
                      </Badge>
                      {listingDetails.expired && (
                        <Badge className='text-xs bg-gray-100 text-gray-800'>
                          {t('review.expired')}
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className='rounded-lg border border-gray-200 p-4 text-center text-sm text-gray-500'>
                    {t('review.couldNotLoad')}
                  </div>
                )}
              </div>

              {/* Admin Notes (if resolved) */}
              {selectedReport.adminNotes &&
                selectedReport.status !== 'PENDING' && (
                  <div>
                    <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2'>
                      {t('review.adminNotesLabel')}
                    </h3>
                    <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 md:p-4'>
                      <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
                        {selectedReport.adminNotes}
                      </p>
                    </div>
                    {selectedReport.resolvedAt && (
                      <p className='text-xs text-gray-500 mt-2'>
                        {t('review.resolvedOn')}{' '}
                        {formatDateTime(selectedReport.resolvedAt).date}{' '}
                        {t('review.at')}{' '}
                        {formatDateTime(selectedReport.resolvedAt).time}
                        {selectedReport.resolvedByName &&
                          ` ${t('review.by')} ${selectedReport.resolvedByName}`}
                      </p>
                    )}
                  </div>
                )}

              {/* Action Section for Pending Reports */}
              {selectedReport.status === 'PENDING' && (
                <div>
                  <label
                    htmlFor='action-reason'
                    className='text-sm font-medium text-gray-700 block mb-2'
                  >
                    {t('review.adminNotesLabel')}{' '}
                    <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    id='action-reason'
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder={t('review.adminNotesPlaceholder')}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                    rows={3}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className='flex flex-col sm:flex-row gap-2 md:gap-3 pt-2'>
                {selectedReport.status === 'PENDING' && (
                  <>
                    <Button
                      onClick={handleResolve}
                      disabled={actionLoading}
                      className='flex-1 bg-green-600 hover:bg-green-700 text-sm'
                    >
                      {actionLoading ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <CheckCircle className='mr-2 h-4 w-4' />
                      )}
                      {t('review.resolve')}
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      disabled={actionLoading}
                      variant='outline'
                      className='flex-1 border-red-300 text-red-600 hover:bg-red-50 text-sm'
                    >
                      {actionLoading ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <XCircle className='mr-2 h-4 w-4' />
                      )}
                      {t('review.dismiss')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {lightboxOpen && listingDetails?.media && (
        <div
          className='fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center'
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className='absolute top-4 right-4 text-white hover:text-gray-300 z-10'
          >
            <XCircle className='h-8 w-8' />
          </button>

          {/* Previous button */}
          {listingDetails.media.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPreviousImage()
              }}
              className='absolute left-4 text-white hover:text-gray-300 z-10'
            >
              <ChevronLeft className='h-12 w-12' />
            </button>
          )}

          {/* Image */}
          <div
            className='relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={listingDetails.media[currentImageIndex].url}
              alt={`${listingDetails.title} ${currentImageIndex + 1}`}
              width={1920}
              height={1080}
              className='max-w-full max-h-full object-contain'
            />
          </div>

          {/* Next button */}
          {listingDetails.media.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNextImage()
              }}
              className='absolute right-4 text-white hover:text-gray-300 z-10'
            >
              <ChevronRight className='h-12 w-12' />
            </button>
          )}

          {/* Image counter */}
          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full'>
            {currentImageIndex + 1} / {listingDetails.media.length}
          </div>
        </div>
      )}
    </div>
  )
}

ViolationReportManagement.getLayout = function getLayout(
  page: React.ReactNode,
) {
  return <AdminLayout activeItem='reports'>{page}</AdminLayout>
}

export default ViolationReportManagement
