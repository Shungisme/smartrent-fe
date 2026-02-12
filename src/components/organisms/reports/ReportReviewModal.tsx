import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
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
  Loader2,
  Home,
  Building2,
  Briefcase,
  MapPin,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react'
import cn from 'classnames'
import { ListingReport } from '@/api/types/listing-report.type'
import { ListingService } from '@/api/services/listing.service'
import { ListingResponseWithAdmin } from '@/api/types/listing.type'
import { toast } from 'sonner'

interface ReportReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: ListingReport | null
  onActionComplete: () => void
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

export const ReportReviewModal: React.FC<ReportReviewModalProps> = ({
  open,
  onOpenChange,
  report,
  onActionComplete,
}) => {
  const t = useTranslations('reports')
  const [listingDetails, setListingDetails] =
    useState<ListingResponseWithAdmin | null>(null)
  const [loadingListing, setLoadingListing] = useState(false)
  const [actionReason, setActionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (open && report) {
      setActionReason(report.adminNotes || '')
      setListingDetails(null)
      setCurrentImageIndex(0)
      setLightboxOpen(false)
      fetchListingDetails(report.listingId)
    }
  }, [open, report])

  const fetchListingDetails = async (listingId: number) => {
    try {
      setLoadingListing(true)
      const response = await ListingService.getListingDetail(listingId)
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

  const handleResolve = async () => {
    if (!report) return

    if (!actionReason.trim()) {
      toast.warning('Please provide admin notes for resolution')
      return
    }

    try {
      setActionLoading(true)
      await ListingService.resolveReport(report.reportId, {
        status: 'RESOLVED',
        adminNotes: actionReason,
      })
      toast.success('Report has been resolved successfully')
      onOpenChange(false)
      onActionComplete()
    } catch (e) {
      console.error(e)
      toast.error('Failed to resolve report. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDismiss = async () => {
    if (!report) return

    if (!actionReason.trim()) {
      toast.warning('Please provide a reason for dismissal')
      return
    }

    try {
      setActionLoading(true)
      await ListingService.resolveReport(report.reportId, {
        status: 'REJECTED',
        adminNotes: actionReason,
      })
      toast.success('Report has been dismissed')
      onOpenChange(false)
      onActionComplete()
    } catch (e) {
      console.error(e)
      toast.error('Failed to dismiss report. Please try again.')
    } finally {
      setActionLoading(false)
    }
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (listingDetails?.media) {
      setCurrentImageIndex((prev) =>
        prev === listingDetails.media.length - 1 ? 0 : prev + 1,
      )
    }
  }

  const goToPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (listingDetails?.media) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? listingDetails.media.length - 1 : prev - 1,
      )
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)] mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl md:text-2xl font-semibold'>
              {t('review.title')}
            </DialogTitle>
          </DialogHeader>

          {report && (
            <div className='space-y-4 md:space-y-6'>
              {/* Report Info Alert */}
              <div className='rounded-lg bg-yellow-50 border border-yellow-200 p-3 md:p-4'>
                <div className='flex items-start gap-2 md:gap-3'>
                  <AlertTriangle className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
                  <div className='flex-1'>
                    <h4 className='text-sm md:text-base font-medium text-yellow-900'>
                      Report #{report.reportId} - {report.category}
                    </h4>
                    <p className='mt-1 text-xs md:text-sm text-yellow-800'>
                      Reported by <strong>{report.reporterName}</strong>
                      {report.createdAt && (
                        <>
                          {' '}
                          on {formatDateTime(report.createdAt).date} at{' '}
                          {formatDateTime(report.createdAt).time}
                        </>
                      )}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      'text-xs flex-shrink-0',
                      getStatusColor(report.status),
                    )}
                  >
                    {t(
                      `statuses.${statusMap[report.status as keyof typeof statusMap]}`,
                    )}
                  </Badge>
                </div>
              </div>

              {/* Report Reasons */}
              {report.reportReasons && report.reportReasons.length > 0 && (
                <div className='flex flex-col gap-2'>
                  <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2'>
                    {t('review.reportReasons')}
                  </h3>
                  <div className='space-y-2'>
                    {report.reportReasons.map((reason, idx) => (
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
              {report.otherFeedback && (
                <div className='flex flex-col gap-2'>
                  <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2'>
                    {t('review.additionalFeedback')}
                  </h3>
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 md:p-4'>
                    <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
                      {report.otherFeedback}
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
                      {getInitials(report.reporterName)}
                    </div>
                  </Avatar>
                  <div className='flex-1'>
                    <div className='font-medium text-gray-900 text-base'>
                      {report.reporterName}
                    </div>
                    <div className='text-sm text-gray-600 mt-0.5'>
                      {report.reporterEmail}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {report.reporterPhone}
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
              {report.adminNotes && report.status !== 'PENDING' && (
                <div>
                  <h3 className='text-base md:text-lg font-semibold text-gray-900 mb-2'>
                    {t('review.adminNotesLabel')}
                  </h3>
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 md:p-4'>
                    <p className='text-sm text-gray-700 leading-relaxed whitespace-pre-wrap'>
                      {report.adminNotes}
                    </p>
                  </div>
                  {report.resolvedAt && (
                    <p className='text-xs text-gray-500 mt-2'>
                      {t('review.resolvedOn')}{' '}
                      {formatDateTime(report.resolvedAt).date} {t('review.at')}{' '}
                      {formatDateTime(report.resolvedAt).time}
                      {report.resolvedByName &&
                        ` ${t('review.by')} ${report.resolvedByName}`}
                    </p>
                  )}
                </div>
              )}

              {/* Action Section for Pending Reports */}
              {report.status === 'PENDING' && (
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
                {report.status === 'PENDING' && (
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
            className='absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors'
          >
            <X className='h-6 w-6 text-white' />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={goToPreviousImage}
            className='absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors group'
          >
            <ChevronLeft className='h-8 w-8 text-white/50 group-hover:text-white transition-colors' />
          </button>

          <button
            onClick={goToNextImage}
            className='absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors group'
          >
            <ChevronRight className='h-8 w-8 text-white/50 group-hover:text-white transition-colors' />
          </button>

          {/* Main Image */}
          <div
            className='relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={listingDetails.media[currentImageIndex].url}
              alt={`View ${currentImageIndex + 1}`}
              width={1200}
              height={800}
              className='max-w-full max-h-[90vh] object-contain'
              quality={100}
            />

            {/* Image Counter */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/50 text-white text-sm backdrop-blur-sm'>
              {currentImageIndex + 1} / {listingDetails.media.length}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
