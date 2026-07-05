import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'
import { deleteAdmin } from '@/api/services/admin.service'
import { AdminProfile } from '@/api/types/admin.type'

interface AdminDeleteDialogProps {
  admin: AdminProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (adminId: string) => void
}

export const AdminDeleteDialog: React.FC<AdminDeleteDialogProps> = ({
  admin,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.admins')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!admin) return
    setLoading(true)
    setError(null)
    try {
      const resp = await deleteAdmin(admin.adminId)
      if (resp.success) {
        onSuccess(admin.adminId)
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
            <span className='font-semibold'>{admin?.email}</span>
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
              {t('delete.cancel')}
            </Button>
            <Button
              disabled={loading}
              onClick={handleDelete}
              className='flex-1 bg-red-600 hover:bg-red-700'
            >
              {loading ? t('delete.deleting') : t('delete.delete')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
