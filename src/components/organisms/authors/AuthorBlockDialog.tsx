'use client'

import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ReportedAuthor } from '@/api/types/reported-author.type'

interface AuthorBlockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  author: ReportedAuthor | null
  loading: boolean
  /** Submit: blocked=true blocks with reason, blocked=false unblocks. */
  onConfirm: (blocked: boolean, reason: string) => void | Promise<void>
}

const fullName = (a: ReportedAuthor) =>
  `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() || a.userId

/**
 * Confirmation dialog for blocking (with reason) or unblocking an author from
 * posting listings. Block mode shows a required-ish reason textarea.
 */
export const AuthorBlockDialog: React.FC<AuthorBlockDialogProps> = ({
  open,
  onOpenChange,
  author,
  loading,
  onConfirm,
}) => {
  const t = useTranslations('authors')
  const tCommon = useTranslations('common')
  const [reason, setReason] = useState('')

  // Blocking when the author is not currently blocked.
  const isBlocking = !author?.postingBlocked

  useEffect(() => {
    if (open) setReason('')
  }, [open, author])

  if (!author) return null

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!loading) onOpenChange(next)
      }}
    >
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>
            {isBlocking
              ? t('blockDialog.blockTitle')
              : t('blockDialog.unblockTitle')}
          </DialogTitle>
          <DialogDescription>
            {isBlocking
              ? t('blockDialog.blockDescription', { name: fullName(author) })
              : t('blockDialog.unblockDescription', { name: fullName(author) })}
          </DialogDescription>
        </DialogHeader>

        {isBlocking && (
          <div className='space-y-2'>
            <label
              htmlFor='block-reason'
              className='block text-sm font-medium text-foreground/80'
            >
              {t('blockDialog.reasonLabel')}
            </label>
            <textarea
              id='block-reason'
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t('blockDialog.reasonPlaceholder')}
              rows={3}
              className='w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-ring'
            />
          </div>
        )}

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className='flex-1 sm:flex-none'
          >
            {tCommon('cancel')}
          </Button>
          <Button
            type='button'
            onClick={() => onConfirm(isBlocking, reason)}
            disabled={loading}
            className={cn(
              'flex-1 sm:flex-none',
              isBlocking &&
                'bg-destructive text-destructive-foreground hover:bg-destructive/90',
            )}
          >
            {loading && <Loader2 className='h-4 w-4 animate-spin' />}
            {isBlocking ? t('table.actions.block') : t('table.actions.unblock')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
