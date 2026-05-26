'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'

interface DeleteMembershipDialogProps {
  open: boolean
  packageName?: string
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export const DeleteMembershipDialog: React.FC<DeleteMembershipDialogProps> = ({
  open,
  packageName,
  loading = false,
  onOpenChange,
  onConfirm,
}) => {
  const t = useTranslations('premium.membership.delete')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[min(92vw,28rem)]'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <p className='text-sm text-muted-foreground'>
          {packageName
            ? t('descriptionNamed', { name: packageName })
            : t('description')}
        </p>

        <DialogFooter>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t('cancel')}
          </Button>
          <Button variant='destructive' onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {loading ? t('deleting') : t('confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteMembershipDialog
