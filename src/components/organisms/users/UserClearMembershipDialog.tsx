import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'
import { clearUserMembership } from '@/api/services/membership.service'
import { UserProfile } from '@/api/types/user.type'

interface UserClearMembershipDialogProps {
  user: UserProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export const UserClearMembershipDialog: React.FC<
  UserClearMembershipDialogProps
> = ({ user, open, onOpenChange, onSuccess }) => {
  const t = useTranslations('admin.users')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const resp = await clearUserMembership(user.userId)
      if (resp.success) {
        onSuccess()
        onOpenChange(false)
      } else {
        setError(resp.message || t('clearMembership.error'))
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || t('clearMembership.error'))
    } finally {
      setLoading(false)
    }
  }

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim() || user.email
    : ''

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>{t('clearMembership.title')}</DialogTitle>
          <DialogDescription>{t('clearMembership.subtitle')}</DialogDescription>
        </DialogHeader>
        <div className='space-y-3'>
          <p className='text-sm text-muted-foreground'>
            {t('clearMembership.confirm')}{' '}
            <span className='font-semibold text-foreground'>{displayName}</span>
            {'?'}
          </p>
          <p className='text-xs text-muted-foreground'>
            {t('clearMembership.warning')}
          </p>
          {error && <p className='text-sm text-destructive'>{error}</p>}
          <div className='flex gap-3 pt-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className='flex-1'
            >
              {t('clearMembership.cancel')}
            </Button>
            <Button
              disabled={loading}
              onClick={handleConfirm}
              variant='destructive'
              className='flex-1'
            >
              {loading
                ? t('clearMembership.clearing')
                : t('clearMembership.confirm_button')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
