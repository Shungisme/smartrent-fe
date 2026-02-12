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
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UIPostData } from '@/types/posts.type'
import {
  getPropertyIcon,
  getAmenityIcon,
  getStatusColor,
} from '@/utils/post.utils' // Need to ensure these helpers are exported correctly or pass translations

// Note: Helper functions like getPropertyTypeLabel depend on translation 't', so we should probably handle that.
// I'll accept 't' as a prop or useTranslations hook inside the component.

interface PostReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPost: UIPostData | null
  onApprove: (notes: string) => void
  onReject: (reason: string) => void
  actionLoading: boolean
}

export const PostReviewModal: React.FC<PostReviewModalProps> = ({
  open,
  onOpenChange,
  selectedPost,
  onApprove,
  onReject,
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

  if (!selectedPost) return null

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-w-3xl max-h-[90vh] overflow-y-auto w-[calc(100%-2rem)] mx-auto'>
          <DialogHeader>
            <DialogTitle className='text-xl md:text-2xl font-semibold'>
              {t('review.title')}
            </DialogTitle>
          </DialogHeader>

          <div className='space-y-4 md:space-y-6'>
            {/* Images Gallery */}
            <div className='flex gap-2 overflow-x-auto'>
              {selectedPost.images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx)}
                  className='relative h-24 w-32 md:h-32 md:w-48 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer group'
                >
                  <Image
                    src={img}
                    alt={`${selectedPost.title} ${idx + 1}`}
                    width={192}
                    height={128}
                    className='h-full w-full object-cover transition-transform group-hover:scale-110'
                  />
                  <div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center'>
                    <span className='text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium'>
                      Click to view
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Post Info */}
            <div className='space-y-3 md:space-y-4'>
              <div>
                <h3 className='text-lg md:text-xl font-semibold text-gray-900'>
                  {selectedPost.title}
                </h3>
                <p className='text-xs md:text-sm text-gray-500'>
                  {selectedPost.postCode}
                </p>
              </div>

              {/* Description */}
              {selectedPost.description && (
                <div>
                  <div className='text-xs md:text-sm font-medium text-gray-700'>
                    {t('review.description')}
                  </div>
                  <div className='mt-1 text-sm text-gray-600 whitespace-pre-wrap'>
                    {selectedPost.description}
                  </div>
                </div>
              )}

              <div className='grid grid-cols-2 gap-3 md:gap-4'>
                <div>
                  <div className='text-xs md:text-sm font-medium text-gray-700'>
                    {t('review.propertyType')}
                  </div>
                  <div className='text-sm md:text-base text-gray-900'>
                    {_getPropertyTypeLabel(selectedPost.propertyInfo.type)}
                  </div>
                </div>
                <div>
                  <div className='text-xs md:text-sm font-medium text-gray-700'>
                    {t('review.area')}
                  </div>
                  <div className='text-sm md:text-base text-gray-900'>
                    {selectedPost.propertyInfo.area}m²
                  </div>
                </div>
                {selectedPost.bedrooms !== null &&
                  selectedPost.bedrooms !== undefined && (
                    <div>
                      <div className='text-xs md:text-sm font-medium text-gray-700'>
                        {t('review.bedrooms')}
                      </div>
                      <div className='text-sm md:text-base text-gray-900'>
                        {selectedPost.bedrooms}
                      </div>
                    </div>
                  )}
                {selectedPost.bathrooms !== null &&
                  selectedPost.bathrooms !== undefined && (
                    <div>
                      <div className='text-xs md:text-sm font-medium text-gray-700'>
                        {t('review.bathrooms')}
                      </div>
                      <div className='text-sm md:text-base text-gray-900'>
                        {selectedPost.bathrooms}
                      </div>
                    </div>
                  )}
                {selectedPost.direction && (
                  <div>
                    <div className='text-xs md:text-sm font-medium text-gray-700'>
                      {t('review.direction')}
                    </div>
                    <div className='text-sm md:text-base text-gray-900'>
                      {_getDirectionLabel(selectedPost.direction)}
                    </div>
                  </div>
                )}
                {selectedPost.furnishing && (
                  <div>
                    <div className='text-xs md:text-sm font-medium text-gray-700'>
                      {t('review.furnishing')}
                    </div>
                    <div className='text-sm md:text-base text-gray-900'>
                      {_getFurnishingLabel(selectedPost.furnishing)}
                    </div>
                  </div>
                )}
                <div>
                  <div className='text-xs md:text-sm font-medium text-gray-700'>
                    {t('review.location')}
                  </div>
                  <div className='text-sm md:text-base text-gray-900'>
                    {selectedPost.propertyInfo.district}
                  </div>
                </div>
                <div>
                  <div className='text-xs md:text-sm font-medium text-gray-700'>
                    {t('review.price')}
                  </div>
                  <div className='text-sm md:text-base text-gray-900'>
                    {selectedPost.price}
                  </div>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <div className='text-xs md:text-sm font-medium text-gray-700'>
                  {t('review.fullAddress')}
                </div>
                <div className='mt-1 text-sm text-gray-600'>
                  {selectedPost.propertyInfo.fullAddress}
                </div>
              </div>

              {/* Amenities */}
              {selectedPost.amenities && selectedPost.amenities.length > 0 && (
                <div>
                  <div className='text-xs md:text-sm font-medium text-gray-700 mb-2'>
                    {t('review.amenities')}
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    {selectedPost.amenities.map((amenity) => (
                      <Badge
                        key={amenity.amenityId}
                        variant='outline'
                        className='bg-blue-50 text-blue-700 border-blue-200'
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
                <div className='text-xs md:text-sm font-medium text-gray-700'>
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
                    <div className='text-sm md:text-base font-medium text-gray-900'>
                      {selectedPost.poster.name}
                    </div>
                    <div className='text-xs md:text-sm text-gray-500'>
                      {selectedPost.poster.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status */}
              <div>
                <div className='text-xs md:text-sm font-medium text-gray-700'>
                  {t('review.currentStatus')}
                </div>
                <Badge
                  variant='outline'
                  className={cn('mt-1', getStatusColor(selectedPost.status))}
                >
                  {_getStatusLabel(selectedPost.status)}
                </Badge>
              </div>

              {/* Rejection Reason / Verification Notes */}
              {selectedPost.status === 'pending' && (
                <>
                  <div>
                    <label
                      htmlFor='verification-notes'
                      className='text-xs md:text-sm font-medium text-gray-700'
                    >
                      {t('review.verificationNotes')}
                    </label>
                    <textarea
                      id='verification-notes'
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      placeholder={t('review.verificationNotesPlaceholder')}
                      className='mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs md:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
                      rows={2}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor='rejection-reason'
                      className='text-xs md:text-sm font-medium text-gray-700'
                    >
                      {t('review.rejectionReasonRequired')}
                    </label>
                    <textarea
                      id='rejection-reason'
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder={t('review.rejectionReasonPlaceholder')}
                      className='mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-xs md:text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100'
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
                      <div className='text-xs md:text-sm font-medium text-gray-700'>
                        {t('review.verificationNotes')}
                      </div>
                      <div className='mt-1 text-sm text-gray-600'>
                        {selectedPost.verificationNotes}
                      </div>
                    </div>
                  )}
                  {selectedPost.rejectionReason && (
                    <div>
                      <div className='text-xs md:text-sm font-medium text-gray-700'>
                        {t('review.rejectionReason')}
                      </div>
                      <div className='mt-1 text-sm text-red-600'>
                        {selectedPost.rejectionReason}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action Buttons */}
            {selectedPost.status === 'pending' && (
              <div className='flex flex-col sm:flex-row gap-2 md:gap-3'>
                <Button
                  onClick={() => onApprove(verificationNotes)}
                  disabled={actionLoading}
                  className='flex-1 bg-green-600 hover:bg-green-700 text-sm'
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
                  className='flex-1 border-red-300 text-red-600 hover:bg-red-50 text-sm'
                >
                  {actionLoading ? (
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  ) : (
                    <XCircle className='mr-2 h-4 w-4' />
                  )}
                  {t('review.rejectButton')}
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
            className='absolute top-4 right-4 text-white hover:text-gray-300 z-10'
          >
            <XCircle className='h-8 w-8' />
          </button>

          {selectedPost.images.length > 1 && (
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

          <div
            className='relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPost.images[currentImageIndex]}
              alt={`${selectedPost.title} ${currentImageIndex + 1}`}
              width={1920}
              height={1080}
              className='max-w-full max-h-full object-contain'
            />
          </div>

          {selectedPost.images.length > 1 && (
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

          <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded-full'>
            {currentImageIndex + 1} / {selectedPost.images.length}
          </div>
        </div>
      )}
    </>
  )
}
