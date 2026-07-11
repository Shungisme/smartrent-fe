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
  EyeOff,
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
  Edit,
  Ban,
} from 'lucide-react'
import cn from 'classnames'
import { ListingReport } from '@/api/types/listing-report.type'
import { ListingService } from '@/api/services/listing.service'
import { ListingResponseWithAdmin } from '@/api/types/listing.type'
import { toast } from 'sonner'
import { formatPrice, formatDateTimeParts } from '@/utils/format'

interface ReportReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: ListingReport | null
  onActionComplete: () => void
  onRequestRevision?: (reason: string) => void | Promise<void>
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
      return 'bg-warning/10 text-warning-foreground dark:bg-warning/20 border-warning/30'
    case 'RESOLVED':
      return 'bg-success/10 text-success-foreground dark:bg-success/20 border-success/30'
    case 'REJECTED':
      return 'bg-muted text-muted-foreground border-border/70'
    default:
      return 'bg-muted text-muted-foreground border-border/70'
  }
}

const getAlertIcon = (status: string) => {
  const cls = 'h-5 w-5 mt-0.5 flex-shrink-0'
  switch (status) {
    case 'RESOLVED':
      return <CheckCircle className={cls} />
    case 'REJECTED':
      return <XCircle className={cls} />
    default:
      return <AlertTriangle className={cls} />
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

export const ReportReviewModal: React.FC<ReportReviewModalProps> = ({
  open,
  onOpenChange,
  report,
  onActionComplete,
  onRequestRevision,
}) => {
  const t = useTranslations('reports')
  const tPosts = useTranslations('posts')
  const [listingDetails, setListingDetails] =
    useState<ListingResponseWithAdmin | null>(null)
  const [loadingListing, setLoadingListing] = useState(false)
  const [actionReason, setActionReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [visibilityLoading, setVisibilityLoading] = useState(false)

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
      toast.error(t('toasts.loadListingError'))
    } finally {
      setLoadingListing(false)
    }
  }

  const handleRemoveListing = async () => {
    if (!report) return

    if (!actionReason.trim()) {
      toast.warning(t('toasts.removeListingNoteRequired'))
      return
    }

    if (!window.confirm(t('toasts.removeListingConfirm'))) {
      return
    }

    try {
      setActionLoading(true)
      await ListingService.resolveReport(report.reportId, {
        status: 'RESOLVED',
        adminNotes: actionReason,
        removeListing: true,
      })
      toast.success(t('toasts.removeListingSuccess'))
      onOpenChange(false)
      onActionComplete()
    } catch (e) {
      console.error(e)
      toast.error(t('toasts.removeListingError'))
    } finally {
      setActionLoading(false)
    }
  }

  const handleDismiss = async () => {
    if (!report) return

    if (!actionReason.trim()) {
      toast.warning(t('toasts.dismissNoteRequired'))
      return
    }

    try {
      setActionLoading(true)
      await ListingService.resolveReport(report.reportId, {
        status: 'REJECTED',
        adminNotes: actionReason,
      })
      toast.success(t('toasts.dismissSuccess'))
      onOpenChange(false)
      onActionComplete()
    } catch (e) {
      console.error(e)
      toast.error(t('toasts.dismissError'))
    } finally {
      setActionLoading(false)
    }
  }

  const handleHideListing = async () => {
    if (!report) return
    try {
      setVisibilityLoading(true)
      await ListingService.hideListing(report.listingId, t('review.hideReason'))
      toast.success(t('toasts.hideSuccess'))
      await fetchListingDetails(report.listingId)
      onActionComplete()
    } catch (e) {
      console.error('Error hiding listing:', e)
      toast.error(t('toasts.hideError'))
    } finally {
      setVisibilityLoading(false)
    }
  }

  const handleUnhideListing = async () => {
    if (!report) return
    try {
      setVisibilityLoading(true)
      await ListingService.unhideListing(report.listingId)
      toast.success(t('toasts.unhideSuccess'))
      await fetchListingDetails(report.listingId)
      onActionComplete()
    } catch (e) {
      console.error('Error unhiding listing:', e)
      toast.error(t('toasts.unhideError'))
    } finally {
      setVisibilityLoading(false)
    }
  }

  const handleRequestRevision = async () => {
    if (!report || !onRequestRevision) return

    if (!actionReason.trim()) {
      toast.warning(t('toasts.revisionDetailsRequired'))
      return
    }

    setActionLoading(true)
    try {
      await onRequestRevision(actionReason)
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
        <DialogContent className='flex max-w-4xl max-h-[90vh] flex-col overflow-hidden p-0 gap-0 w-[calc(100%-2rem)] mx-auto'>
          <DialogHeader className='shrink-0 border-b border-border/60 px-6 py-4'>
            <DialogTitle className='text-xl md:text-2xl font-semibold'>
              {t('review.title')}
            </DialogTitle>
          </DialogHeader>

          {report && (
            <div className='min-h-0 flex-1 overflow-y-auto px-6 py-5'>
              <div className='space-y-4 md:space-y-6'>
                {/* Report Info Alert */}
                <div
                  className={cn(
                    'rounded-lg border p-3 md:p-4',
                    getStatusColor(report.status),
                  )}
                >
                  <div className='flex items-start gap-2 md:gap-3'>
                    {getAlertIcon(report.status)}
                    <div className='flex-1'>
                      <h4 className='text-sm md:text-base font-medium'>
                        {t('review.reportPrefix')}
                        {report.reportId} -{' '}
                        {t.has(`categories.${report.category}`)
                          ? t(`categories.${report.category}`)
                          : report.category}
                      </h4>
                      <p className='mt-1 text-xs md:text-sm opacity-90'>
                        {t('review.reportedBy')}{' '}
                        <strong>{report.reporterName}</strong>
                        {report.createdAt && (
                          <>
                            {' '}
                            {t('review.on')}{' '}
                            {formatDateTimeParts(report.createdAt).date}{' '}
                            {t('review.at')}{' '}
                            {formatDateTimeParts(report.createdAt).time}
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
                    <h3 className='text-base md:text-lg font-semibold text-foreground mb-2'>
                      {t('review.reportReasons')}
                    </h3>
                    <div className='space-y-2'>
                      {report.reportReasons.map((reason, idx) => (
                        <div
                          key={reason.reasonId}
                          className='flex items-start gap-2 rounded-lg border border-border/70 bg-muted/50 p-3'
                        >
                          <div className='flex-shrink-0 mt-0.5'>
                            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-destructive/10 text-destructive dark:bg-destructive/20 text-xs font-semibold'>
                              {idx + 1}
                            </div>
                          </div>
                          <div className='flex-1'>
                            <p className='text-sm text-foreground font-medium'>
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
                    <h3 className='text-base md:text-lg font-semibold text-foreground mb-2'>
                      {t('review.additionalFeedback')}
                    </h3>
                    <div className='rounded-lg border border-border/70 bg-muted/50 p-3 md:p-4'>
                      <p className='text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap'>
                        {report.otherFeedback}
                      </p>
                    </div>
                  </div>
                )}

                {/* Reporter Info */}
                <div className='flex flex-col gap-2'>
                  <h3 className='text-base md:text-lg font-semibold text-foreground mb-2'>
                    {t('review.reporterInfo')}
                  </h3>
                  <div className='flex items-center gap-3 rounded-lg border border-border/70 p-3 md:p-4'>
                    <Avatar className='h-12 w-12'>
                      <div className='flex h-full w-full items-center justify-center bg-primary/10 text-primary dark:bg-primary/20 font-semibold text-lg'>
                        {getInitials(report.reporterName)}
                      </div>
                    </Avatar>
                    <div className='flex-1'>
                      <div className='font-medium text-foreground text-base'>
                        {report.reporterName}
                      </div>
                      <div className='text-sm text-muted-foreground mt-0.5'>
                        {report.reporterEmail}
                      </div>
                      <div className='text-sm text-muted-foreground'>
                        {report.reporterPhone}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listing Details */}
                <div className='flex flex-col gap-2'>
                  <h3 className='text-base md:text-lg font-semibold text-foreground mb-2'>
                    {t('review.reportedPost')}
                  </h3>

                  {loadingListing ? (
                    <div className='flex items-center justify-center p-8 border border-border/70 rounded-lg'>
                      <Loader2 className='h-6 w-6 animate-spin text-primary' />
                      <span className='ml-2 text-sm text-muted-foreground'>
                        {t('review.loadingDetails')}
                      </span>
                    </div>
                  ) : listingDetails ? (
                    <div className='rounded-lg border border-border/70 p-4 space-y-4'>
                      {/* Images Gallery */}
                      {listingDetails.media &&
                        listingDetails.media.length > 0 && (
                          <div className='w-full overflow-x-auto overscroll-x-contain pb-2'>
                            <div className='flex min-w-max gap-2'>
                              {listingDetails.media.map((media, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => openLightbox(idx)}
                                  className='relative h-24 w-32 shrink-0 cursor-pointer overflow-hidden rounded-lg group md:h-32 md:w-48'
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
                          </div>
                        )}

                      {/* Basic Info */}
                      <div>
                        <h4 className='text-lg font-semibold text-foreground'>
                          {listingDetails.title}
                        </h4>
                        <p className='text-sm text-muted-foreground mt-1'>
                          {t('review.listingIdPrefix')}
                          {listingDetails.listingId}
                        </p>
                      </div>

                      {/* Description */}
                      {listingDetails.description && (
                        <div>
                          <div className='text-sm font-medium text-foreground/80 mb-1'>
                            {t('review.description')}
                          </div>
                          <div className='text-sm text-muted-foreground whitespace-pre-wrap'>
                            {listingDetails.description}
                          </div>
                        </div>
                      )}

                      {/* Property Details Grid */}
                      <div className='grid grid-cols-2 gap-3 md:gap-4'>
                        <div>
                          <div className='text-xs text-muted-foreground'>
                            {t('review.propertyType')}
                          </div>
                          <div className='flex items-center gap-2 mt-1'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-muted'>
                              {getPropertyIcon(listingDetails.productType)}
                            </div>
                            <span className='text-sm font-medium'>
                              {tPosts.has(
                                `propertyTypes.${listingDetails.productType.toLowerCase()}`,
                              )
                                ? tPosts(
                                    `propertyTypes.${listingDetails.productType.toLowerCase()}`,
                                  )
                                : listingDetails.productType}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className='text-xs text-muted-foreground'>
                            {t('review.price')}
                          </div>
                          <div className='text-sm font-semibold text-foreground mt-1'>
                            {formatPrice(
                              listingDetails.price,
                              listingDetails.priceUnit,
                            )}
                          </div>
                        </div>
                        {listingDetails.area && (
                          <div>
                            <div className='text-xs text-muted-foreground'>
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
                              <div className='text-xs text-muted-foreground'>
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
                              <div className='text-xs text-muted-foreground'>
                                {t('review.bathrooms')}
                              </div>
                              <div className='text-sm font-medium mt-1'>
                                {listingDetails.bathrooms}
                              </div>
                            </div>
                          )}
                        {listingDetails.direction && (
                          <div>
                            <div className='text-xs text-muted-foreground'>
                              {t('review.direction')}
                            </div>
                            <div className='text-sm font-medium mt-1'>
                              {tPosts.has(
                                `directions.${listingDetails.direction.toLowerCase()}`,
                              )
                                ? tPosts(
                                    `directions.${listingDetails.direction.toLowerCase()}`,
                                  )
                                : listingDetails.direction}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Address */}
                      {listingDetails.address && (
                        <div>
                          <div className='text-xs text-muted-foreground'>
                            {t('review.location')}
                          </div>
                          <div className='text-sm text-foreground/80 mt-1'>
                            {listingDetails.address.fullAddress}
                          </div>
                        </div>
                      )}

                      {/* Listing Status */}
                      <div className='flex items-center gap-2 pt-2 border-t'>
                        <span className='text-xs text-muted-foreground'>
                          {t('review.listingStatus')}
                        </span>
                        <Badge
                          className={cn(
                            'text-xs',
                            listingDetails.verified
                              ? 'bg-success/10 text-success-foreground dark:bg-success/20 border-success/30'
                              : 'bg-warning/10 text-warning-foreground dark:bg-warning/20 border-warning/30',
                          )}
                        >
                          {listingDetails.verified
                            ? t('review.verified')
                            : t('review.pendingVerification')}
                        </Badge>
                        {listingDetails.expired && (
                          <Badge className='text-xs bg-muted text-muted-foreground border-border/70'>
                            {t('review.expired')}
                          </Badge>
                        )}
                        {listingDetails.moderationStatus === 'SUSPENDED' && (
                          <Badge className='text-xs bg-destructive/10 text-destructive border-destructive/30'>
                            {t('review.hidden')}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className='rounded-lg border border-border/70 p-4 text-center text-sm text-muted-foreground'>
                      {t('review.couldNotLoad')}
                    </div>
                  )}
                </div>

                {/* Admin Notes (if resolved) */}
                {report.adminNotes && report.status !== 'PENDING' && (
                  <div>
                    <h3 className='text-base md:text-lg font-semibold text-foreground mb-2'>
                      {t('review.adminNotesLabel')}
                    </h3>
                    <div className='rounded-lg border border-border/70 bg-muted/50 p-3 md:p-4'>
                      <p className='text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap'>
                        {report.adminNotes}
                      </p>
                    </div>
                    {report.resolvedAt && (
                      <p className='text-xs text-muted-foreground mt-2'>
                        {t('review.resolvedOn')}{' '}
                        {formatDateTimeParts(report.resolvedAt).date}{' '}
                        {t('review.at')}{' '}
                        {formatDateTimeParts(report.resolvedAt).time}
                        {report.resolvedByName &&
                          ` ${t('review.by')} ${report.resolvedByName}`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Fixed action footer */}
          {report && (listingDetails || report.status === 'PENDING') && (
            <div className='shrink-0 border-t border-border/60 bg-card/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/80'>
              {report.status === 'PENDING' && (
                <div className='mb-3'>
                  <label
                    htmlFor='action-reason'
                    className='text-sm font-medium text-foreground/80 block mb-2'
                  >
                    {t('review.adminNotesLabel')}{' '}
                    <span className='text-destructive'>*</span>
                  </label>
                  <textarea
                    id='action-reason'
                    value={actionReason}
                    onChange={(e) => setActionReason(e.target.value)}
                    placeholder={t('review.adminNotesPlaceholder')}
                    className='w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring'
                    rows={2}
                  />
                </div>
              )}
              <div className='flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end'>
                {/* Temporary hide / unhide — opposite toggle, kept apart on the left */}
                {listingDetails &&
                  (listingDetails.moderationStatus === 'SUSPENDED' ? (
                    <Button
                      onClick={handleUnhideListing}
                      disabled={visibilityLoading}
                      variant='outline'
                      className='text-sm sm:mr-auto'
                    >
                      {visibilityLoading ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <Eye className='mr-2 h-4 w-4' />
                      )}
                      {t('review.unhide')}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleHideListing}
                      disabled={visibilityLoading}
                      variant='outline'
                      className='border-warning/40 text-warning-foreground hover:border-warning/60 hover:bg-warning/15 hover:text-warning-foreground text-sm sm:mr-auto'
                    >
                      {visibilityLoading ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <EyeOff className='mr-2 h-4 w-4' />
                      )}
                      {t('review.hide')}
                    </Button>
                  ))}
                {report.status === 'PENDING' && (
                  <>
                    {onRequestRevision && (
                      <Button
                        onClick={handleRequestRevision}
                        disabled={actionLoading}
                        variant='outline'
                        className='border-warning/40 text-warning-foreground hover:border-warning/60 hover:bg-warning/15 hover:text-warning-foreground text-sm'
                      >
                        {actionLoading ? (
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <Edit className='mr-2 h-4 w-4' />
                        )}
                        {t('review.requestRevision')}
                      </Button>
                    )}
                    <Button
                      onClick={handleRemoveListing}
                      disabled={actionLoading}
                      className='bg-destructive text-destructive-foreground hover:bg-destructive/90 text-sm'
                    >
                      {actionLoading ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <Ban className='mr-2 h-4 w-4' />
                      )}
                      {t('review.removeListing')}
                    </Button>
                    <Button
                      onClick={handleDismiss}
                      disabled={actionLoading}
                      className='bg-success text-success-foreground hover:bg-success/90 text-sm'
                    >
                      {actionLoading ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <CheckCircle className='mr-2 h-4 w-4' />
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
