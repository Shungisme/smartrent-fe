'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import {
  Loader2,
  AlertTriangle,
  Ban,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { ReportedAuthorService } from '@/api/services/reported-author.service'
import { ReportedAuthor } from '@/api/types/reported-author.type'
import { ListingReport } from '@/api/types/listing-report.type'
import { formatDateTimeParts } from '@/utils/format'

interface AuthorReportsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  author: ReportedAuthor | null
  /** Fires when the admin clicks block / unblock; parent opens the confirm flow. */
  onToggleBlock: (author: ReportedAuthor) => void
}

/** Threshold above which an author is eligible to be blocked (mirrors backend). */
const BLOCK_ELIGIBLE_THRESHOLD = 3

const fullName = (a: ReportedAuthor) =>
  `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() || a.userId

export const AuthorReportsDialog: React.FC<AuthorReportsDialogProps> = ({
  open,
  onOpenChange,
  author,
  onToggleBlock,
}) => {
  const t = useTranslations('authors')
  const [reports, setReports] = useState<ListingReport[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && author) {
      setReports([])
      fetchReports(author.userId)
    }
  }, [open, author])

  const fetchReports = async (userId: string) => {
    try {
      setLoading(true)
      const res = await ReportedAuthorService.getApprovedReports(userId)
      if (res.success && res.data) {
        setReports(res.data)
      } else {
        toast.error(res.message || t('reportsDialog.loadError'))
      }
    } catch (e) {
      console.error('Error loading author reports:', e)
      toast.error(t('reportsDialog.loadError'))
    } finally {
      setLoading(false)
    }
  }

  if (!author) return null

  const eligible = author.resolvedReports > BLOCK_ELIGIBLE_THRESHOLD

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-hidden p-0 gap-0'>
        <DialogHeader className='shrink-0 border-b border-border/60 px-6 py-4'>
          <DialogTitle className='text-lg font-semibold'>
            {t('reportsDialog.title', { name: fullName(author) })}
          </DialogTitle>
          <DialogDescription>
            {t('reportsDialog.subtitle', { count: author.resolvedReports })}
          </DialogDescription>
        </DialogHeader>

        <div className='min-h-0 flex-1 overflow-y-auto px-6 py-5'>
          {/* Block-eligibility notice */}
          {eligible && !author.postingBlocked && (
            <div className='mb-4 flex items-start gap-2 rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm text-warning-foreground'>
              <AlertTriangle className='mt-0.5 h-4 w-4 shrink-0' />
              <span>
                {t('reportsDialog.eligibleNotice', {
                  count: author.resolvedReports,
                  threshold: BLOCK_ELIGIBLE_THRESHOLD,
                })}
              </span>
            </div>
          )}
          {author.postingBlocked && (
            <div className='mb-4 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive'>
              <Ban className='mt-0.5 h-4 w-4 shrink-0' />
              <span>
                {t('reportsDialog.blockedNotice')}
                {author.postingBlockedReason
                  ? ` — ${author.postingBlockedReason}`
                  : ''}
              </span>
            </div>
          )}

          {loading ? (
            <div className='flex items-center justify-center py-10'>
              <Loader2 className='h-6 w-6 animate-spin text-primary' />
            </div>
          ) : reports.length === 0 ? (
            <div className='rounded-xl border border-border/70 p-6 text-center text-sm text-muted-foreground'>
              {t('reportsDialog.empty')}
            </div>
          ) : (
            <ul className='space-y-3'>
              {reports.map((report) => (
                <li
                  key={report.reportId}
                  className='rounded-xl border border-border/70 bg-muted/40 p-4'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className='text-sm font-medium text-foreground'>
                          #{report.reportId}
                        </span>
                        <Badge variant='success' className='gap-1 text-xs'>
                          <CheckCircle className='h-3 w-3' />
                          {t('reportsDialog.approved')}
                        </Badge>
                      </div>
                      <p className='mt-1 text-xs text-muted-foreground'>
                        {t('reportsDialog.listingPrefix')}
                        {report.listingId}
                      </p>
                    </div>
                    {report.resolvedAt && (
                      <span className='shrink-0 text-xs text-muted-foreground'>
                        {formatDateTimeParts(report.resolvedAt).date}
                      </span>
                    )}
                  </div>

                  {report.reportReasons && report.reportReasons.length > 0 && (
                    <div className='mt-2 flex flex-wrap gap-1.5'>
                      {report.reportReasons.map((reason) => (
                        <Badge
                          key={reason.reasonId}
                          variant='outline'
                          className='text-xs'
                        >
                          {reason.reasonText}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {report.otherFeedback && (
                    <p className='mt-2 whitespace-pre-wrap text-sm text-foreground/80'>
                      {report.otherFeedback}
                    </p>
                  )}

                  {report.adminNotes && (
                    <div className='mt-2 rounded-lg border border-border/60 bg-background p-2'>
                      <span className='text-xs font-medium text-muted-foreground'>
                        {t('reportsDialog.adminNotes')}:{' '}
                      </span>
                      <span className='text-sm text-foreground/80'>
                        {report.adminNotes}
                      </span>
                      {report.resolvedByName && (
                        <span className='ml-1 text-xs text-muted-foreground'>
                          ({report.resolvedByName})
                        </span>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with block / unblock action */}
        <div className='shrink-0 border-t border-border/60 px-6 py-4'>
          <div className='flex justify-end'>
            {author.postingBlocked ? (
              <Button variant='outline' onClick={() => onToggleBlock(author)}>
                <ShieldCheck className='h-4 w-4' />
                {t('table.actions.unblock')}
              </Button>
            ) : (
              <Button
                variant='destructive'
                disabled={!eligible}
                title={
                  !eligible ? t('table.actions.blockDisabledHint') : undefined
                }
                onClick={() => onToggleBlock(author)}
              >
                <Ban className='h-4 w-4' />
                {t('table.actions.block')}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
