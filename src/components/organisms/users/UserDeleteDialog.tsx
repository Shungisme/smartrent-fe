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
        setError(resp.message || 'Failed to delete user')
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Error deleting user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>{t('delete.title') || 'Delete User'}</DialogTitle>
        </DialogHeader>
        <div className='space-y-2'>
          <p>
            {t('delete.confirm') ||
              'Are you sure you want to delete this user?'}
            <br />
            <span className='font-semibold'>{user?.email}</span>
          </p>
          {error && <div className='text-red-600 text-sm'>{error}</div>}
          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className='flex-1'
            >
              {t('delete.cancel') || 'Cancel'}
            </Button>
            <Button
              disabled={loading}
              onClick={handleDelete}
              className='flex-1 bg-red-600 hover:bg-red-700'
            >
              {loading
                ? t('delete.deleting') || 'Deleting...'
                : t('delete.delete') || 'Delete'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
