import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { InitialsAvatar } from '@/components/molecules/initialsAvatar'
import {
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ImageOff,
  MapPin,
  Home,
  Ruler,
  BedDouble,
  Bath,
  Compass,
  Sofa,
  FileText,
  Sparkles,
  RotateCcw,
  Eye,
  EyeOff,
  Users,
  Droplet,
  Zap,
  Wifi,
  Receipt,
  Mail,
  type LucideIcon,
} from 'lucide-react'

const MAX_VISIBLE_THUMBS = 8
import { cn } from '@/lib/utils'
import { UIPostData } from '@/types/posts.type'
import { getAmenityIcon, getStatusColor } from '@/utils/post.utils' // Need to ensure these helpers are exported correctly or pass translations
import { PostAiAnalysis } from '@/components/organisms/posts/PostAiAnalysis'
import { VipTypeBadge } from '@/components/organisms/posts/PostTable'
import {
  MediaThumbnail,
  MediaPlayer,
} from '@/components/molecules/mediaPreview'

// Note: Helper functions like getPropertyTypeLabel depend on translation 't', so we should probably handle that.
// I'll accept 't' as a prop or useTranslations hook inside the component.

interface PostReviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedPost: UIPostData | null
  loading?: boolean
  onApprove: (notes: string) => void
  onReject: (reason: string) => void
  onRequestRevision: (reason: string) => void
  onHide: () => void
  onUnhide: () => void
  actionLoading: boolean
  visibilityLoading: boolean
}

/** Consistent section heading with a leading accent icon. */
const SectionLabel: React.FC<{
  icon: LucideIcon
  children: React.ReactNode
}> = ({ icon: Icon, children }) => (
  <div className='mb-2 flex items-center gap-2 text-sm font-semibold text-foreground'>
    <Icon className='h-4 w-4 text-primary' />
    {children}
  </div>
)

/** A single property stat tile (icon + label + value). */
const Fact: React.FC<{
  icon: LucideIcon
  label: string
  value: React.ReactNode
}> = ({ icon: Icon, label, value }) => (
  <div className='flex items-center gap-3 rounded-lg border border-border/70 bg-muted/30 p-3'>
    <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary'>
      <Icon className='h-4 w-4' />
    </div>
    <div className='min-w-0'>
      <div className='text-xs text-muted-foreground'>{label}</div>
      <div className='truncate text-sm font-medium text-foreground'>
        {value}
      </div>
    </div>
  </div>
)

export const PostReviewModal: React.FC<PostReviewModalProps> = ({
  open,
  onOpenChange,
  selectedPost,
  loading = false,
  onApprove,
  onReject,
  onRequestRevision,
  onHide,
  onUnhide,
  actionLoading,
  visibilityLoading,
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

  // Utility price fields come back as either a PriceType enum name or a
  // free-form amount string — mirrors smartrent-fe's normalizeUtilityValue so
  // the admin sees the same "Thỏa thuận / Do chủ nhà quy định / Theo nhà cung
  // cấp" labels users do, instead of the raw enum constant.
  const _getUtilityPriceLabel = (value?: string | null) => {
    if (!value) return null
    const trimmed = value.trim()
    if (!trimmed) return null
    const enumLabels: Record<string, string> = {
      NEGOTIABLE: t('review.utilityPrice.negotiable'),
      SET_BY_OWNER: t('review.utilityPrice.owner'),
      PROVIDER_RATE: t('review.utilityPrice.provider'),
    }
    if (enumLabels[trimmed]) return enumLabels[trimmed]
    if (/^[\d.,\s]+$/.test(trimmed)) {
      const numeric = Number(trimmed.replace(/[\s.,]/g, ''))
      if (Number.isFinite(numeric)) {
        return new Intl.NumberFormat('vi-VN').format(numeric)
      }
    }
    return trimmed
  }

  const _getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: t('statuses.pending'),
      resubmitted: t('statuses.resubmitted'),
      approved: t('statuses.approved'),
      rejected: t('statuses.rejected'),
      revision_required: t('statuses.revision_required'),
      suspended: t('statuses.suspended'),
      hidden: t('statuses.hidden'),
      removed: t('statuses.removed'),
      expired: t('statuses.expired'),
      pending_payment: t('statuses.pending_payment'),
    }
    return labels[status] || status
  }

  // Reject/Request-revision only send `rejectionReason` to the backend as the
  // single reasonText the owner sees — the "Ghi chú xác minh" box above it is a
  // separate piece of state that's otherwise only wired to Approve. An admin
  // who types context into that first box (it's the first field on the form)
  // and leaves the second one blank/brief would have that note silently
  // dropped on reject. Fold it in so nothing typed anywhere is lost.
  const buildRejectionReason = () => {
    const notes = verificationNotes.trim()
    const reason = rejectionReason.trim()
    if (!notes) return reason
    return reason ? `${reason}\n\n${notes}` : notes
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

  if (!selectedPost) {
    if (!open) return null
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='flex w-[80vw] max-w-[1200px] mx-auto max-h-[90vh] flex-col overflow-hidden p-0 gap-0 max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:w-screen max-sm:max-w-none max-sm:max-h-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:border-0'>
          <>
            <DialogHeader className='shrink-0 border-b border-border/60 px-6 py-4'>
              <DialogTitle className='text-base font-semibold'>
                {t('review.title')}
              </DialogTitle>
            </DialogHeader>
            <div className='flex min-h-0 flex-1 items-center justify-center py-24'>
              {loading ? (
                <div className='flex flex-col items-center gap-3 text-muted-foreground'>
                  <Loader2 className='h-8 w-8 animate-spin text-primary' />
                  <span className='text-sm'>{t('review.loading')}</span>
                </div>
              ) : (
                <span className='text-sm text-muted-foreground'>
                  {t('review.noData')}
                </span>
              )}
            </div>
          </>
        </DialogContent>
      </Dialog>
    )
  }

  const images = selectedPost.images ?? []
  const visibleImages = images.slice(0, MAX_VISIBLE_THUMBS)
  const hiddenCount = images.length - visibleImages.length
  const isPending =
    selectedPost.status === 'pending' || selectedPost.status === 'resubmitted'
  const isApproved = selectedPost.status === 'approved'
  const isHidden = selectedPost.status === 'hidden'
  // Hidden posts get the same AI analysis sidebar as pending ones (read-only —
  // no moderation form), so admins reviewing a hidden post can still see/run it.
  const showAiSidebar = isPending || isHidden

  const waterPriceLabel = _getUtilityPriceLabel(selectedPost.waterPrice)
  const electricityPriceLabel = _getUtilityPriceLabel(
    selectedPost.electricityPrice,
  )
  const internetPriceLabel = _getUtilityPriceLabel(selectedPost.internetPrice)
  const serviceFeeLabel = _getUtilityPriceLabel(selectedPost.serviceFee)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className='flex w-[80vw] max-w-[1200px] mx-auto max-h-[90vh] flex-col overflow-hidden p-0 gap-0 max-sm:inset-0 max-sm:top-0 max-sm:left-0 max-sm:h-dvh max-sm:w-screen max-sm:max-w-none max-sm:max-h-none max-sm:translate-x-0 max-sm:translate-y-0 max-sm:rounded-none max-sm:border-0'
          onPointerDownOutside={(e) => {
            if (lightboxOpen) e.preventDefault()
          }}
          onInteractOutside={(e) => {
            if (lightboxOpen) e.preventDefault()
          }}
          onEscapeKeyDown={(e) => {
            if (lightboxOpen) e.preventDefault()
          }}
        >
          <DialogHeader className='shrink-0 border-b border-border/60 px-6 py-4'>
            <DialogTitle className='text-base font-semibold'>
              {t('review.title')}
            </DialogTitle>
          </DialogHeader>

          <div
            className={cn(
              'flex min-h-0 flex-1 flex-col overflow-y-auto',
              showAiSidebar && 'lg:flex-row lg:overflow-hidden',
            )}
          >
            {/* Left column — listing details */}
            <div
              className={cn(
                'space-y-5 px-6 py-5',
                showAiSidebar &&
                  'lg:flex-1 lg:overflow-y-auto lg:border-r lg:border-border/60',
              )}
            >
              {/* Hero: title, code, listing type, status & price */}
              <div className='rounded-xl border border-border/70 bg-gradient-to-br from-primary/5 via-card to-card p-5 shadow-sm md:p-6'>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4'>
                  <div className='min-w-0 space-y-2'>
                    <div className='flex flex-wrap items-center gap-1.5'>
                      <Badge variant='secondary' className='font-normal px-0'>
                        {t(`listingTypes.${selectedPost.listingType}`)}
                      </Badge>
                      <span className='font-mono text-xs text-muted-foreground'>
                        {selectedPost.postCode}
                      </span>
                    </div>
                    <h3 className='text-lg font-semibold leading-snug text-foreground md:text-xl'>
                      {selectedPost.title}
                    </h3>
                  </div>
                  <div className='flex flex-wrap items-center gap-1.5 sm:shrink-0'>
                    {(selectedPost.vipType === 'GOLD' ||
                      selectedPost.vipType === 'DIAMOND') && (
                      <VipTypeBadge vipType={selectedPost.vipType} />
                    )}
                    <Badge
                      variant='outline'
                      className={cn(getStatusColor(selectedPost.status))}
                    >
                      {_getStatusLabel(selectedPost.status)}
                    </Badge>
                  </div>
                </div>
                <div className='mt-5 flex items-baseline gap-2 border-t border-border/60 pt-4'>
                  <span className='text-2xl font-semibold tracking-tight text-foreground tabular-nums md:text-3xl'>
                    {selectedPost.price}
                  </span>
                </div>
              </div>

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
                        <MediaThumbnail
                          src={img}
                          alt={`${selectedPost.title} ${idx + 1}`}
                          className='transition-transform duration-300 group-hover:scale-105'
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

              {/* Property details */}
              <div>
                <SectionLabel icon={Home}>
                  {t('review.propertyDetails')}
                </SectionLabel>
                <div className='grid grid-cols-2 gap-2.5 sm:grid-cols-3'>
                  <Fact
                    icon={Home}
                    label={t('review.propertyType')}
                    value={_getPropertyTypeLabel(
                      selectedPost.propertyInfo.type,
                    )}
                  />
                  <Fact
                    icon={Ruler}
                    label={t('review.area')}
                    value={`${selectedPost.propertyInfo.area}m²`}
                  />
                  {selectedPost.bedrooms !== null &&
                    selectedPost.bedrooms !== undefined && (
                      <Fact
                        icon={BedDouble}
                        label={t('review.bedrooms')}
                        value={selectedPost.bedrooms}
                      />
                    )}
                  {selectedPost.bathrooms !== null &&
                    selectedPost.bathrooms !== undefined && (
                      <Fact
                        icon={Bath}
                        label={t('review.bathrooms')}
                        value={selectedPost.bathrooms}
                      />
                    )}
                  {selectedPost.direction && (
                    <Fact
                      icon={Compass}
                      label={t('review.direction')}
                      value={_getDirectionLabel(selectedPost.direction)}
                    />
                  )}
                  {selectedPost.furnishing && (
                    <Fact
                      icon={Sofa}
                      label={t('review.furnishing')}
                      value={_getFurnishingLabel(selectedPost.furnishing)}
                    />
                  )}
                  {selectedPost.roomCapacity !== null &&
                    selectedPost.roomCapacity !== undefined && (
                      <Fact
                        icon={Users}
                        label={t('review.roomCapacity')}
                        value={selectedPost.roomCapacity}
                      />
                    )}
                  {waterPriceLabel && (
                    <Fact
                      icon={Droplet}
                      label={t('review.waterPrice')}
                      value={waterPriceLabel}
                    />
                  )}
                  {electricityPriceLabel && (
                    <Fact
                      icon={Zap}
                      label={t('review.electricityPrice')}
                      value={electricityPriceLabel}
                    />
                  )}
                  {internetPriceLabel && (
                    <Fact
                      icon={Wifi}
                      label={t('review.internetPrice')}
                      value={internetPriceLabel}
                    />
                  )}
                  {serviceFeeLabel && (
                    <Fact
                      icon={Receipt}
                      label={t('review.serviceFee')}
                      value={serviceFeeLabel}
                    />
                  )}
                </div>
              </div>

              {/* Location */}
              <div>
                <SectionLabel icon={MapPin}>
                  {t('review.location')}
                </SectionLabel>
                <div className='space-y-2'>
                  {selectedPost.propertyInfo.fullNewAddress && (
                    <div className='rounded-lg border border-border/70 bg-muted/30 p-4'>
                      <div className='text-xs text-muted-foreground'>
                        {t('review.newAddress')}
                      </div>
                      <div className='mt-1 text-sm text-foreground'>
                        {selectedPost.propertyInfo.fullNewAddress}
                      </div>
                    </div>
                  )}
                  <div className='rounded-lg border border-border/70 bg-muted/30 p-4'>
                    <div className='text-xs text-muted-foreground'>
                      {selectedPost.propertyInfo.district}
                    </div>
                    <div className='mt-1 text-sm text-foreground'>
                      {selectedPost.propertyInfo.fullAddress}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedPost.description && (
                <div>
                  <SectionLabel icon={FileText}>
                    {t('review.description')}
                  </SectionLabel>
                  <div className='max-h-60 overflow-y-auto whitespace-pre-wrap rounded-lg border border-border/70 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground'>
                    {selectedPost.description}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {selectedPost.amenities && selectedPost.amenities.length > 0 && (
                <div>
                  <SectionLabel icon={Sparkles}>
                    {t('review.amenities')}
                  </SectionLabel>
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

              {/* Poster */}
              <div className='flex items-center gap-3 rounded-lg border border-border/70 bg-muted/30 p-4'>
                <InitialsAvatar
                  name={selectedPost.poster.name}
                  src={selectedPost.poster.avatar}
                  size='lg'
                />
                <div className='min-w-0'>
                  <div className='text-xs text-muted-foreground'>
                    {t('review.postedBy')}
                  </div>
                  <div className='truncate text-sm font-medium text-foreground md:text-base'>
                    {selectedPost.poster.name}
                  </div>
                  <div className='text-xs text-muted-foreground md:text-sm'>
                    {selectedPost.poster.phone}
                  </div>
                  {selectedPost.poster.email && (
                    <div className='mt-0.5 flex items-center gap-1 text-xs text-muted-foreground md:text-sm'>
                      <Mail className='h-3 w-3 shrink-0' />
                      <span className='truncate'>
                        {selectedPost.poster.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Display existing notes if already reviewed (single-column view) */}
              {!isPending && (
                <>
                  {selectedPost.verificationNotes && (
                    <div>
                      <SectionLabel icon={FileText}>
                        {t('review.verificationNotes')}
                      </SectionLabel>
                      <div className='rounded-lg border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground'>
                        {selectedPost.verificationNotes}
                      </div>
                    </div>
                  )}
                  {selectedPost.rejectionReason && (
                    <div>
                      <SectionLabel icon={XCircle}>
                        {t('review.rejectionReason')}
                      </SectionLabel>
                      <div className='rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive'>
                        {selectedPost.rejectionReason}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Right column — AI analysis (pending + hidden) + moderation form (pending only) */}
            {showAiSidebar && (
              <div className='space-y-5 px-6 py-5 lg:w-[440px] lg:shrink-0 lg:overflow-y-auto'>
                {/* AI-assisted analysis (advisory only) */}
                <PostAiAnalysis post={selectedPost} open={open} />

                {/* Rejection Reason / Verification Notes — only while a moderation decision is pending */}
                {isPending && (
                  <div className='space-y-4 rounded-lg border border-border/70 bg-muted/30 p-4'>
                    <div>
                      <label
                        htmlFor='verification-notes'
                        className='text-sm font-medium text-foreground'
                      >
                        {t('review.verificationNotes')}
                      </label>
                      <textarea
                        id='verification-notes'
                        value={verificationNotes}
                        onChange={(e) => setVerificationNotes(e.target.value)}
                        placeholder={t('review.verificationNotesPlaceholder')}
                        className='mt-2 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:border-primary/60 focus-visible:ring-4 focus-visible:ring-ring'
                        rows={2}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor='rejection-reason'
                        className='text-sm font-medium text-foreground'
                      >
                        {t('review.rejectionReasonRequired')}
                      </label>
                      <textarea
                        id='rejection-reason'
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder={t('review.rejectionReasonPlaceholder')}
                        className='mt-2 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] focus-visible:border-primary/60 focus-visible:ring-4 focus-visible:ring-ring'
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {(isPending || isApproved || isHidden) && (
            <div className='shrink-0 border-t border-border/60 bg-card/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/80'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'>
                {isHidden && (
                  <Button
                    onClick={onUnhide}
                    disabled={visibilityLoading}
                    variant='outline'
                    className='sm:mr-auto'
                  >
                    {visibilityLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Eye className='mr-2 h-4 w-4' />
                    )}
                    {t('review.unhide')}
                  </Button>
                )}
                {isApproved && (
                  <Button
                    onClick={onHide}
                    disabled={visibilityLoading}
                    variant='outline'
                    className='border-warning/40 text-warning-foreground hover:border-warning/60 hover:bg-warning/15 hover:text-warning-foreground sm:mr-auto'
                  >
                    {visibilityLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <EyeOff className='mr-2 h-4 w-4' />
                    )}
                    {t('review.hide')}
                  </Button>
                )}
                {isPending && (
                  <>
                    <Button
                      variant='outline'
                      onClick={() => onRequestRevision(buildRejectionReason())}
                      disabled={actionLoading}
                      className='border-warning/40 text-warning-foreground hover:border-warning/60 hover:bg-warning/15 hover:text-warning-foreground'
                    >
                      {actionLoading ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <RotateCcw className='mr-2 h-4 w-4' />
                      )}
                      {t('review.requestRevisionButton')}
                    </Button>
                    <Button
                      variant='outline'
                      onClick={() => onReject(buildRejectionReason())}
                      disabled={actionLoading}
                      className='border-destructive/30 text-destructive hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive'
                    >
                      {actionLoading ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <XCircle className='mr-2 h-4 w-4' />
                      )}
                      {t('review.rejectButton')}
                    </Button>
                    <Button
                      onClick={() => onApprove(verificationNotes)}
                      disabled={actionLoading}
                    >
                      {actionLoading ? (
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      ) : (
                        <CheckCircle className='mr-2 h-4 w-4' />
                      )}
                      {t('review.approveButton')}
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Lightbox — rendered as a sibling (not inside DialogContent,
          which has a CSS transform) so `fixed` positions against the real
          viewport instead of being clipped to the dialog box. Radix's modal
          Dialog sets `pointer-events: none` on <body> while open and only
          re-enables it for nodes inside its own layer, so this sibling
          needs `pointer-events-auto` explicitly or nothing in it is
          clickable. The dialog-close-on-escape/outside-click it would
          otherwise trigger is suppressed via onPointerDownOutside/
          onInteractOutside/onEscapeKeyDown above. */}
      {lightboxOpen && (
        <div
          className='fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 pointer-events-auto'
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
            <MediaPlayer
              src={selectedPost.images[currentImageIndex]}
              alt={`${selectedPost.title} ${currentImageIndex + 1}`}
              className='object-contain'
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
                    <MediaThumbnail src={img} alt={`thumbnail ${idx + 1}`} />
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
