import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'
import { deleteUser } from '@/api/services/user.service'
import { UserProfile } from '@/api/types/user.type'

interface UserDeleteDialogProps {
  user: UserProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (userId: string) => void
}

export const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.users')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const resp = await deleteUser(user.userId)
      if (resp.success) {
        onSuccess(user.userId)
        onOpenChange(false)
      } else {
        setError(resp.message || t('delete.deleteFailed'))
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || t('delete.deleteError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>{t('delete.title')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-2'>
          <p>
            {t('delete.confirm')}
            <br />
            <span className='font-semibold'>{user?.email}</span>
          </p>
          {error && <div className='text-destructive text-sm'>{error}</div>}
          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className='flex-1'
            >
              {t('delete.cancel')}
            </Button>
            <Button
              variant='destructive'
              disabled={loading}
              onClick={handleDelete}
              className='flex-1'
            >
              {loading ? t('delete.deleting') : t('delete.delete')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
