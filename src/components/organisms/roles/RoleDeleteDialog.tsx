import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { useTranslations } from 'next-intl'
import { deleteRole } from '@/api/services/role.service'
import { Role } from '@/api/types/role.type'

interface RoleDeleteDialogProps {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export const RoleDeleteDialog: React.FC<RoleDeleteDialogProps> = ({
  role,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.roles')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleOpenChange = (open: boolean) => {
    if (!open) setError(null)
    onOpenChange(open)
  }

  const handleDelete = async () => {
    if (!role) return
    setLoading(true)
    setError(null)
    try {
      const resp = await deleteRole(role.roleId)
      if (resp.success) {
        onOpenChange(false)
        onSuccess()
      } else {
        setError(resp.message || t('delete.deleteFailed'))
      }
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e.message || t('delete.deleteError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-sm'>
        <DialogHeader>
          <DialogTitle>{t('delete.title')}</DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <p>
            {t('delete.confirm')}
            <br />
            <span className='font-semibold'>{role?.roleName}</span>
          </p>

          {error && <p className='text-sm text-destructive'>{error}</p>}

          <div className='flex gap-3 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
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
