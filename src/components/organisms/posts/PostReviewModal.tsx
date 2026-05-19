import React, { useState } from 'react'
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
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ImageOff,
} from 'lucide-react'

const MAX_VISIBLE_THUMBS = 8
import { cn } from '@/lib/utils'
import { UIPostData } from '@/types/posts.type'
import { getAmenityIcon, getStatusColor } from '@/utils/post.utils' // Need to ensure these helpers are exported correctly or pass translations
import { PostAiAnalysis } from '@/components/organisms/posts/PostAiAnalysis'

// Note: Helper functions like getPropertyTypeLabel depend on translation 't', so we should probably handle that.
// I'll accept 't' as a prop or useTranslations hook inside the component.

interface PostReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPost: UIPostData | null
  onApprove: (notes: string) => void
  onReject: (reason: string) => void
  onRequestRevision: (reason: string) => void
  actionLoading: boolean
}

export const PostReviewModal: React.FC<PostReviewModalProps> = ({
  open,
  onOpenChange,
  selectedPost,
  onApprove,
  onReject,
  onRequestRevision,
  actionLoading,
}) => {
  const t = useTranslations('posts')
  const [rejectionReason, setRejectionReason] = useState('')
  const [verificationNotes, setVerificationNotes] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Reset state when modal opens/closes or post changes
  React.useEffect(() => {
    if (selectedPost) {
      setRejectionReason(selectedPost.rejectionReason || '')
      setVerificationNotes(selectedPost.verificationNotes || '')
    } else {
      setRejectionReason('')
      setVerificationNotes('')
    }
  }, [selectedPost, open])

  // Helper functions wrapper to use 't'
  const _getPropertyTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      HOUSE: 'house',
      APARTMENT: 'apartment',
      OFFICE: 'office',
      LAND: 'land',
      ROOM: 'room',
      OTHER: 'other',
    }
    const key = typeMap[type]
    return key ? t(`propertyTypes.${key}`) : type
  }

  const _getDirectionLabel = (direction: string) => {
    const directionMap: Record<string, string> = {
      EAST: 'east',
      WEST: 'west',
      SOUTH: 'south',
      NORTH: 'north',
      NORTHEAST: 'northeast',
      NORTHWEST: 'northwest',
      SOUTHEAST: 'southeast',
      SOUTHWEST: 'southwest',
    }
    const key = directionMap[direction]
    return key ? t(`directions.${key}`) : direction
  }

  const _getFurnishingLabel = (furnishing: string) => {
    const furnishingMap: Record<string, string> = {
      FULLY_FURNISHED: 'fully_furnished',
      SEMI_FURNISHED: 'semi_furnished',
      UNFURNISHED: 'unfurnished',
    }
    const key = furnishingMap[furnishing]
    return key ? t(`furnishing.${key}`) : furnishing
  }

  const _getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t('statuses.pending'),
      approved: t('statuses.approved'),
      rejected: t('statuses.rejected'),
      expired: t('statuses.expired'),
    }
    return labels[status] || status
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const goToNextImage = () => {
    if (selectedPost) {
      setCurrentImageIndex((prev) =>
        prev === selectedPost.images.length - 1 ? 0 : prev + 1,
      )
    }
  }

  const goToPreviousImage = () => {
    if (selectedPost) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedPost.images.length - 1 : prev - 1,
      )
    }
  }

  // Keyboard navigation for the lightbox
  React.useEffect(() => {
    if (!lightboxOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goToNextImage()
      if (e.key === 'ArrowLeft') goToPreviousImage()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lightboxOpen, selectedPost])

  if (!selectedPost) return null

  const images = selectedPost.images ?? []
  const visibleImages = images.slice(0, MAX_VISIBLE_THUMBS)
  const hiddenCount = images.length - visibleImages.length

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-x-hidden overflow-y-auto w-[calc(100%-2rem)] mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl md:text-2xl font-semibold'>
              {t('review.title')}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4 md:space-y-6'>
            {/* Images Gallery */}
            {images.length === 0 ? (
              <div className='flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground'>
                <ImageOff className='h-6 w-6' />
                <span className='text-sm'>{t('review.noImages')}</span>
              </div>
            ) : (
              <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
                {visibleImages.map((img, idx) => {
                  const isLastVisible = idx === visibleImages.length - 1
                  const showMoreOverlay = isLastVisible && hiddenCount > 0
                  return (
                    <button
                      type='button'
                      key={idx}
                      onClick={() => openLightbox(idx)}
                      className='group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-lg border border-border bg-muted outline-none transition-shadow focus-visible:ring-4 focus-visible:ring-ring'
                    >
                      <Image
                        src={img}
                        alt={`${selectedPost.title} ${idx + 1}`}
                        width={320}
                        height={240}
                        className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
                      />
                      {showMoreOverlay ? (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-semibold text-white'>
                          +{hiddenCount}
                        </div>
                      ) : (
                        <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/35'>
                          <ZoomIn className='h-5 w-5 text-white opacity-0 transition-opacity group-hover:opacity-100' />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Post Info */}
            <div className='space-y-3 md:space-y-4'>
              <div>
                <h3 className='text-lg md:text-xl font-semibold text-foreground'>
                  {selectedPost.title}
                </h3>
                <p className='text-xs md:text-sm text-muted-foreground'>
                  {selectedPost.postCode}
                </p>
              </div>

              {/* Description */}
              {selectedPost.description && (
                <div>
                  <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                    {t('review.description')}
                  </div>
                  <div className='mt-1 text-sm text-muted-foreground whitespace-pre-wrap'>
                    {selectedPost.description}
                  </div>
                </div>
              )}

              <div className='grid grid-cols-2 gap-3 md:gap-4'>
                <div>
                  <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                    {t('review.propertyType')}
                  </div>
                  <div className='text-sm md:text-base text-foreground'>
                    {_getPropertyTypeLabel(selectedPost.propertyInfo.type)}
                  </div>
                </div>
                <div>
                  <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                    {t('review.area')}
                  </div>
                  <div className='text-sm md:text-base text-foreground'>
                    {selectedPost.propertyInfo.area}m²
                  </div>
                </div>
                {selectedPost.bedrooms !== null &&
                  selectedPost.bedrooms !== undefined && (
                    <div>
                      <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                        {t('review.bedrooms')}
                      </div>
                      <div className='text-sm md:text-base text-foreground'>
                        {selectedPost.bedrooms}
                      </div>
                    </div>
                  )}
                {selectedPost.bathrooms !== null &&
                  selectedPost.bathrooms !== undefined && (
                    <div>
                      <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                        {t('review.bathrooms')}
                      </div>
                      <div className='text-sm md:text-base text-foreground'>
                        {selectedPost.bathrooms}
                      </div>
                    </div>
                  )}
                {selectedPost.direction && (
                  <div>
                    <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                      {t('review.direction')}
                    </div>
                    <div className='text-sm md:text-base text-foreground'>
                      {_getDirectionLabel(selectedPost.direction)}
                    </div>
                  </div>
                )}
                {selectedPost.furnishing && (
                  <div>
                    <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                      {t('review.furnishing')}
                    </div>
                    <div className='text-sm md:text-base text-foreground'>
                      {_getFurnishingLabel(selectedPost.furnishing)}
                    </div>
                  </div>
                )}
                <div>
                  <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                    {t('review.location')}
                  </div>
                  <div className='text-sm md:text-base text-foreground'>
                    {selectedPost.propertyInfo.district}
                  </div>
                </div>
                <div>
                  <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                    {t('review.price')}
                  </div>
                  <div className='text-sm md:text-base text-foreground'>
                    {selectedPost.price}
                  </div>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                  {t('review.fullAddress')}
                </div>
                <div className='mt-1 text-sm text-muted-foreground'>
                  {selectedPost.propertyInfo.fullAddress}
                </div>
              </div>

              {/* Amenities */}
              {selectedPost.amenities && selectedPost.amenities.length > 0 && (
                <div>
                  <div className='text-xs md:text-sm font-medium text-muted-foreground mb-2'>
                    {t('review.amenities')}
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {selectedPost.amenities.map((amenity) => (
                      <Badge
                        key={amenity.amenityId}
                        variant='secondary'
                        className='font-normal'
                      >
                        {amenity.icon && (
                          <span className='mr-1'>
                            {getAmenityIcon(amenity.icon)}
                          </span>
                        )}
                        {amenity.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                  {t('review.postedBy')}
                </div>
                <div className='mt-2 flex items-center gap-2'>
                  <Avatar className='h-8 w-8 md:h-10 md:w-10'>
                    <Image
                      src={
                        selectedPost.poster.avatar ||
                        '/images/default-image.jpg'
                      }
                      alt={selectedPost.poster.name}
                      width={40}
                      height={40}
                      className='h-full w-full object-cover'
                    />
                  </Avatar>
                  <div>
                    <div className='text-sm md:text-base font-medium text-foreground'>
                      {selectedPost.poster.name}
                    </div>
                    <div className='text-xs md:text-sm text-muted-foreground'>
                      {selectedPost.poster.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div>
                <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                  {t('review.currentStatus')}
                </div>
                <Badge
                  variant='outline'
                  className={cn('mt-1', getStatusColor(selectedPost.status))}
                >
                  {_getStatusLabel(selectedPost.status)}
                </Badge>
              </div>

              {/* AI-assisted analysis (advisory only) */}
              {selectedPost.status === 'pending' && (
                <PostAiAnalysis post={selectedPost} open={open} />
              )}

              {/* Rejection Reason / Verification Notes */}
              {selectedPost.status === 'pending' && (
                <>
                  <div>
                    <label
                      htmlFor='verification-notes'
                      className='text-xs md:text-sm font-medium text-muted-foreground'
                    >
                      {t('review.verificationNotes')}
                    </label>
                    <textarea
                      id='verification-notes'
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      placeholder={t('review.verificationNotesPlaceholder')}
                      className='mt-2 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs md:text-sm outline-none transition-[border-color,box-shadow] focus-visible:border-primary/60 focus-visible:ring-4 focus-visible:ring-ring'
                      rows={2}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='rejection-reason'
                      className='text-xs md:text-sm font-medium text-muted-foreground'
                    >
                      {t('review.rejectionReasonRequired')}
                    </label>
                    <textarea
                      id='rejection-reason'
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder={t('review.rejectionReasonPlaceholder')}
                      className='mt-2 w-full rounded-lg border border-input bg-card px-3 py-2 text-xs md:text-sm outline-none transition-[border-color,box-shadow] focus-visible:border-primary/60 focus-visible:ring-4 focus-visible:ring-ring'
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* Display existing notes if already reviewed */}
              {selectedPost.status !== 'pending' && (
                <>
                  {selectedPost.verificationNotes && (
                    <div>
                      <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                        {t('review.verificationNotes')}
                      </div>
                      <div className='mt-1 text-sm text-muted-foreground'>
                        {selectedPost.verificationNotes}
                      </div>
                    </div>
                  )}
                  {selectedPost.rejectionReason && (
                    <div>
                      <div className='text-xs md:text-sm font-medium text-muted-foreground'>
                        {t('review.rejectionReason')}
                      </div>
                      <div className='mt-1 text-sm text-destructive'>
                        {selectedPost.rejectionReason}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action Buttons */}
            {selectedPost.status === 'pending' && (
              <div className='flex flex-col gap-2 md:gap-3'>
                <div className='flex flex-col sm:flex-row gap-2'>
                  <Button
                    onClick={() => onApprove(verificationNotes)}
                    disabled={actionLoading}
                    className='flex-1 bg-success text-white hover:bg-success/90 text-sm'
                  >
                    {actionLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <CheckCircle className='mr-2 h-4 w-4' />
                    )}
                    {t('review.approveButton')}
                  </Button>
                  <Button
                    onClick={() => onReject(rejectionReason)}
                    disabled={actionLoading}
                    variant='outline'
                    className='flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 text-sm'
                  >
                    {actionLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <XCircle className='mr-2 h-4 w-4' />
                    )}
                    {t('review.rejectButton')}
                  </Button>
                </div>
                <Button
                  onClick={() => onRequestRevision(rejectionReason)}
                  disabled={actionLoading}
                  variant='outline'
                  className='w-full border-warning/50 text-warning hover:bg-warning/10 text-sm'
                >
                  {actionLoading ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : null}
                  {t('review.requestRevisionButton')}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {lightboxOpen && selectedPost && (
        <div
          className='fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center'
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className='absolute top-4 right-4 text-white/80 hover:text-white z-10'
          >
            <XCircle className='h-8 w-8' />
          </button>

          {selectedPost.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToPreviousImage()
              }}
              className='absolute left-4 text-white/80 hover:text-white z-10'
            >
              <ChevronLeft className='h-12 w-12' />
            </button>
          )}

          <div
            className='relative flex h-full w-full max-w-7xl items-center justify-center px-4 pt-16 pb-36'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPost.images[currentImageIndex]}
              alt={`${selectedPost.title} ${currentImageIndex + 1}`}
              width={1920}
              height={1080}
              className='max-h-full max-w-full object-contain'
            />
          </div>

          {selectedPost.images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                goToNextImage()
              }}
              className='absolute right-4 text-white/80 hover:text-white z-10'
            >
              <ChevronRight className='h-12 w-12' />
            </button>
          )}

          <div
            className='absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 px-4 pb-4'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='rounded-full bg-black/55 px-4 py-1.5 text-sm text-white'>
              {currentImageIndex + 1} / {selectedPost.images.length}
            </div>

            {selectedPost.images.length > 1 && (
              <div className='flex max-w-full gap-2 overflow-x-auto pb-1'>
                {selectedPost.images.map((img, idx) => (
                  <button
                    type='button'
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(idx)
                    }}
                    className={cn(
                      'relative h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 transition-opacity',
                      idx === currentImageIndex
                        ? 'border-white opacity-100'
                        : 'border-transparent opacity-50 hover:opacity-90',
                    )}
                  >
                    <Image
                      src={img}
                      alt={`thumbnail ${idx + 1}`}
                      width={80}
                      height={56}
                      className='h-full w-full object-cover'
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
