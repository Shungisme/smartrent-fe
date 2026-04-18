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
import { Loader2 } from 'lucide-react'

interface BrokerRemoveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  loading?: boolean
}

export const BrokerRemoveDialog: React.FC<BrokerRemoveDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  loading = false,
}) => {
  const t = useTranslations('moderation.brokerPending')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('confirmRemove.title')}</DialogTitle>
        </DialogHeader>

        <p className='text-sm text-gray-600'>
          {t('confirmRemove.description')}
        </p>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t('confirmRemove.cancel')}
          </Button>
          <Button variant='destructive' onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className='h-4 w-4 animate-spin' />}
            {t('confirmRemove.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
