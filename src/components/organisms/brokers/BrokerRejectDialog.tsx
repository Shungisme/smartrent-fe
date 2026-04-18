'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Textarea } from '@/components/atoms/textarea'
import { Loader2 } from 'lucide-react'

interface BrokerRejectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason: string
  onReasonChange: (value: string) => void
  onSubmit: () => void
  error?: string | null
  loading?: boolean
  maxLength?: number
}

export const BrokerRejectDialog: React.FC<BrokerRejectDialogProps> = ({
  open,
  onOpenChange,
  reason,
  onReasonChange,
  onSubmit,
  error,
  loading = false,
  maxLength = 500,
}) => {
  const t = useTranslations('moderation.brokerPending')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('modal.title')}</DialogTitle>
        </DialogHeader>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-gray-700'>
            {t('modal.reasonLabel')}
          </label>
          <Textarea
            value={reason}
            onChange={(event) => onReasonChange(event.target.value)}
            placeholder={t('modal.reasonPlaceholder')}
            maxLength={maxLength}
            className='min-h-32'
            aria-invalid={!!error}
          />
          <div className='flex items-center justify-between text-xs'>
            <span className={error ? 'text-red-600' : 'text-gray-500'}>
              {error ?? ' '}
            </span>
            <span className='text-gray-400'>
              {reason.length}/{maxLength}
            </span>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t('modal.cancel')}
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading && <Loader2 className='h-4 w-4 animate-spin' />}
            {t('modal.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
