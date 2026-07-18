'use client'

import React, { useEffect, useState } from 'react'
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
import { Textarea } from '@/components/atoms/textarea'
import {
  Check,
  X,
  UserX,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ZoomIn,
  FileText,
} from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/atoms/avatar'
import { AdminBrokerUserResponse } from '@/api/types/broker.type'
import { formatDate } from '@/utils/format'

const BROKER_REGISTRY_URL =
  'https://www.nangluchdxd.gov.vn/Canhan?page=2&pagesize=20'

type ActionKind = 'approve' | 'reject' | 'remove'

interface BrokerReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  broker: AdminBrokerUserResponse | null
  actionState: Record<string, ActionKind | undefined>
  onApprove: (user: AdminBrokerUserResponse) => void
  onRejectWithReason: (user: AdminBrokerUserResponse, reason: string) => void
  onRemove: (user: AdminBrokerUserResponse) => void
}

const statusVariant = (
  status: string,
): 'warning' | 'success' | 'secondary' | 'destructive' => {
  switch (status) {
    case 'PENDING':
      return 'warning'
    case 'APPROVED':
      return 'success'
    case 'REJECTED':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export const BrokerReviewDialog: React.FC<BrokerReviewDialogProps> = ({
  open,
  onOpenChange,
  broker,
  actionState,
  onApprove,
  onRejectWithReason,
  onRemove,
}) => {
  const t = useTranslations('moderation.brokerPending')

  const [rejectMode, setRejectMode] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectError, setRejectError] = useState<string | null>(null)
  const [removeMode, setRemoveMode] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    if (open && broker) {
      setRejectMode(false)
      setRejectReason('')
      setRejectError(null)
      setRemoveMode(false)
      setLightboxIndex(null)
    }
  }, [open, broker?.userId])

  const handleClose = (next: boolean) => {
    if (!next) {
      setRejectMode(false)
      setRejectReason('')
      setRejectError(null)
      setRemoveMode(false)
      setLightboxIndex(null)
    }
    onOpenChange(next)
  }

  if (!broker) return null

  const action = actionState[broker.userId]
  const isBusy = !!action
  const isPending = broker.brokerVerificationStatus === 'PENDING'
  const isApproved = broker.brokerVerificationStatus === 'APPROVED'

  const documents = [
    {
      key: 'cccdFront',
      label: t('documents.cccdFront'),
      url: broker.cccdFrontUrl,
    },
    {
      key: 'cccdBack',
      label: t('documents.cccdBack'),
      url: broker.cccdBackUrl,
    },
    {
      key: 'certificate',
      label: t('documents.certificate'),
      url: broker.certUrl,
    },
  ]

  const validDocs = documents.filter(
    (d): d is typeof d & { url: string } => !!d.url,
  )

  const handleRejectConfirm = () => {
    const trimmed = rejectReason.trim()
    if (!trimmed) {
      setRejectError(t('modal.reasonRequired'))
      return
    }
    onRejectWithReason(broker, trimmed)
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex((prev) =>
      prev === null ? 0 : prev === 0 ? validDocs.length - 1 : prev - 1,
    )
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setLightboxIndex((prev) =>
      prev === null ? 0 : prev === validDocs.length - 1 ? 0 : prev + 1,
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className='flex w-[80vw] max-w-[1200px] mx-auto max-h-[90vh] flex-col overflow-hidden p-0 gap-0'
          onPointerDownOutside={(event) => {
            if (lightboxIndex !== null) {
              event.preventDefault()
            }
          }}
        >
          <>
            {/* Fixed header */}
            <DialogHeader className='shrink-0 border-b border-border/60 px-6 py-4'>
              <DialogTitle className='text-base font-semibold'>
                {t('review.title')}
              </DialogTitle>
            </DialogHeader>

            {/* Scrollable content */}
            <div className='min-h-0 flex-1 overflow-y-auto px-6 py-5'>
              <div className='space-y-6'>
                {/* User info */}
                <div className='rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                      <Avatar className='h-12 w-12 shrink-0'>
                        <AvatarImage src={broker.avatarUrl ?? undefined} />
                        <AvatarFallback className='bg-primary/10 text-primary text-sm font-semibold'>
                          {broker.firstName[0]}
                          {broker.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className='text-lg font-semibold text-foreground'>
                          {broker.firstName} {broker.lastName}
                        </div>
                        <div className='text-xs text-muted-foreground mt-0.5'>
                          {broker.userId}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={statusVariant(broker.brokerVerificationStatus)}
                    >
                      {t(`statuses.${broker.brokerVerificationStatus}`)}
                    </Badge>
                  </div>

                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1'>
                    <div>
                      <div className='text-xs text-muted-foreground mb-0.5'>
                        {t('table.headers.email')}
                      </div>
                      <div className='text-sm font-medium text-foreground break-all'>
                        {broker.email}
                      </div>
                    </div>
                    <div>
                      <div className='text-xs text-muted-foreground mb-0.5'>
                        {t('table.headers.phone')}
                      </div>
                      <div className='text-sm font-medium text-foreground'>
                        {broker.phoneCode} {broker.phoneNumber}
                      </div>
                    </div>
                    <div>
                      <div className='text-xs text-muted-foreground mb-0.5'>
                        {t('table.headers.registeredAt')}
                      </div>
                      <div className='text-sm font-medium text-foreground'>
                        {formatDate(broker.brokerRegisteredAt)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documents */}
                <div>
                  <h3 className='text-sm font-semibold text-foreground mb-3'>
                    {t('review.documents')}
                  </h3>
                  <div className='grid gap-3 sm:grid-cols-3'>
                    {documents.map((doc) => {
                      const validIdx = validDocs.findIndex(
                        (d) => d.key === doc.key,
                      )
                      return doc.url ? (
                        <button
                          key={doc.key}
                          type='button'
                          onClick={() =>
                            validIdx !== -1 && setLightboxIndex(validIdx)
                          }
                          className='group relative aspect-[4/3] rounded-xl overflow-hidden border border-border/70 bg-muted hover:border-primary/50 transition-colors cursor-zoom-in'
                        >
                          <Image
                            src={doc.url}
                            alt={doc.label}
                            fill
                            className='object-cover transition-transform duration-200 group-hover:scale-105'
                          />
                          <div className='absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center'>
                            <ZoomIn className='h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity' />
                          </div>
                          <div className='absolute bottom-0 inset-x-0 bg-black/40 px-2 py-1 backdrop-blur-sm'>
                            <span className='text-[11px] font-medium text-white/90'>
                              {doc.label}
                            </span>
                          </div>
                        </button>
                      ) : (
                        <div
                          key={doc.key}
                          className='aspect-[4/3] rounded-xl border border-dashed border-border/70 bg-muted/50 flex flex-col items-center justify-center gap-1.5 p-3'
                        >
                          <FileText className='h-6 w-6 text-muted-foreground/40' />
                          <span className='text-xs font-medium text-foreground/70 text-center'>
                            {doc.label}
                          </span>
                          <span className='text-[11px] text-muted-foreground'>
                            {t('documents.notSubmitted')}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Registry link */}
                <a
                  href={BROKER_REGISTRY_URL}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline'
                >
                  <ExternalLink className='h-3.5 w-3.5' />
                  {t('table.verifyLink')}
                </a>

                {/* Reject reason input */}
                {rejectMode && (
                  <div className='space-y-2 rounded-xl border border-border/70 bg-muted/20 p-4'>
                    <label className='text-sm font-medium text-foreground block'>
                      {t('modal.reasonLabel')}{' '}
                      <span className='text-destructive'>*</span>
                    </label>
                    <Textarea
                      value={rejectReason}
                      onChange={(e) => {
                        setRejectReason(e.target.value)
                        if (rejectError) setRejectError(null)
                      }}
                      placeholder={t('modal.reasonPlaceholder')}
                      maxLength={500}
                      className='min-h-24 resize-none'
                      aria-invalid={!!rejectError}
                    />
                    <div className='flex items-center justify-between text-xs'>
                      <span
                        className={
                          rejectError ? 'text-destructive' : 'text-transparent'
                        }
                      >
                        {rejectError ?? '.'}
                      </span>
                      <span className='text-muted-foreground/80'>
                        {rejectReason.length}/500
                      </span>
                    </div>
                  </div>
                )}

                {/* Remove confirmation */}
                {removeMode && (
                  <div className='rounded-xl border border-destructive/30 bg-destructive/5 p-4'>
                    <p className='text-sm font-medium text-foreground'>
                      {t('confirmRemove.title')}
                    </p>
                    <p className='text-sm text-muted-foreground mt-1'>
                      {t('confirmRemove.description')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed footer — only for actionable statuses */}
            {(isPending || isApproved) && (
              <div className='shrink-0 border-t border-border/60 bg-card/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-card/80'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'>
                  {isPending && !rejectMode && (
                    <>
                      <Button
                        onClick={() => setRejectMode(true)}
                        disabled={isBusy}
                        variant='outline'
                        className='border-destructive/40 text-destructive hover:bg-destructive/10'
                      >
                        <X className='mr-2 h-4 w-4' />
                        {t('actions.reject')}
                      </Button>
                      <Button
                        onClick={() => onApprove(broker)}
                        disabled={isBusy}
                        className='bg-success text-success-foreground hover:bg-success/90'
                      >
                        {action === 'approve' ? (
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <Check className='mr-2 h-4 w-4' />
                        )}
                        {t('actions.approve')}
                      </Button>
                    </>
                  )}

                  {rejectMode && (
                    <>
                      <Button
                        onClick={() => {
                          setRejectMode(false)
                          setRejectReason('')
                          setRejectError(null)
                        }}
                        disabled={isBusy}
                        variant='outline'
                      >
                        {t('modal.cancel')}
                      </Button>
                      <Button
                        onClick={handleRejectConfirm}
                        disabled={isBusy}
                        variant='outline'
                        className='border-destructive/40 text-destructive hover:bg-destructive/10'
                      >
                        {action === 'reject' ? (
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <X className='mr-2 h-4 w-4' />
                        )}
                        {t('modal.submit')}
                      </Button>
                    </>
                  )}

                  {isApproved && !removeMode && (
                    <Button
                      onClick={() => setRemoveMode(true)}
                      disabled={isBusy}
                      variant='outline'
                      className='border-destructive/40 text-destructive hover:bg-destructive/10'
                    >
                      <UserX className='mr-2 h-4 w-4' />
                      {t('actions.removeBroker')}
                    </Button>
                  )}

                  {removeMode && (
                    <>
                      <Button
                        onClick={() => setRemoveMode(false)}
                        disabled={isBusy}
                        variant='outline'
                      >
                        {t('confirmRemove.cancel')}
                      </Button>
                      <Button
                        onClick={() => onRemove(broker)}
                        disabled={isBusy}
                        variant='outline'
                        className='border-destructive/40 text-destructive hover:bg-destructive/10'
                      >
                        {action === 'remove' ? (
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <UserX className='mr-2 h-4 w-4' />
                        )}
                        {t('confirmRemove.confirm')}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {lightboxIndex !== null && validDocs.length > 0 && (
        <div
          className='fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center'
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className='absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors'
          >
            <X className='h-6 w-6 text-white' />
          </button>

          {validDocs.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className='absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors group'
              >
                <ChevronLeft className='h-8 w-8 text-white/50 group-hover:text-white transition-colors' />
              </button>
              <button
                onClick={handleNextImage}
                className='absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors group'
              >
                <ChevronRight className='h-8 w-8 text-white/50 group-hover:text-white transition-colors' />
              </button>
            </>
          )}

          <div
            className='relative flex flex-col items-center justify-center gap-4 max-w-[90vw] max-h-[90vh]'
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={validDocs[lightboxIndex].url}
              alt={validDocs[lightboxIndex].label}
              width={1200}
              height={800}
              className='max-w-full max-h-[80vh] object-contain rounded-lg'
              quality={100}
            />
            <div className='text-center'>
              <div className='text-white font-medium text-sm'>
                {validDocs[lightboxIndex].label}
              </div>
              {validDocs.length > 1 && (
                <div className='text-white/50 text-xs mt-0.5'>
                  {lightboxIndex + 1} / {validDocs.length}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
