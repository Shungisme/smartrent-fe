import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { useTranslations } from 'next-intl'
import { updateUser } from '@/api/services/user.service'
import { UserProfile, UserUpdateRequest } from '@/api/types/user.type'

interface UserEditDialogProps {
  user: UserProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (user: UserProfile) => void
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.users')
  const [form, setForm] = useState<Partial<UserUpdateRequest>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setForm({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        idDocument: user.idDocument,
        taxNumber: user.taxNumber,
        contactPhoneNumber: user.contactPhoneNumber,
        isVerified:
          (user as UserProfile & { isVerified?: boolean }).isVerified ?? false,
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)
    try {
      const resp = await updateUser(user.userId, form)
      if (resp.success && resp.data) {
        onSuccess(resp.data)
        onOpenChange(false)
      } else {
        setError(resp.message || 'Failed to update user')
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Error updating user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[40vw] max-w-md max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('edit.title') || 'Edit User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-2'>
          <div className='space-y-2'>
            <Label htmlFor='editEmail'>{t('edit.email') || 'Email'} *</Label>
            <Input
              id='editEmail'
              type='email'
              placeholder='Email'
              value={form.email || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='editFirstName'>
              {t('edit.firstName') || 'First Name'} *
            </Label>
            <Input
              id='editFirstName'
              placeholder='First Name'
              value={form.firstName || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='editLastName'>
              {t('edit.lastName') || 'Last Name'} *
            </Label>
            <Input
              id='editLastName'
              placeholder='Last Name'
              value={form.lastName || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
              required
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='editIdDocument'>
              {t('edit.idDocument') || 'ID Document'}
            </Label>
            <Input
              id='editIdDocument'
              placeholder='ID Document'
              value={form.idDocument || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, idDocument: e.target.value }))
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='editTaxNumber'>
              {t('edit.taxNumber') || 'Tax Number'}
            </Label>
            <Input
              id='editTaxNumber'
              placeholder='Tax Number'
              value={form.taxNumber || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, taxNumber: e.target.value }))
              }
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='editContactPhone'>
              {t('edit.contactPhone') || 'Contact Phone'}
            </Label>
            <Input
              id='editContactPhone'
              placeholder='Contact Phone'
              value={form.contactPhoneNumber || ''}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  contactPhoneNumber: e.target.value,
                }))
              }
            />
          </div>
          <label className='flex items-center gap-2'>
            <input
              type='checkbox'
              checked={!!form.isVerified}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  isVerified: e.target.checked,
                }))
              }
              className='rounded border-gray-300'
            />
            <span className='text-sm'>{t('edit.verified') || 'Verified'}</span>
          </label>
          {error && <div className='text-red-600 text-sm'>{error}</div>}
          <div className='flex justify-end gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('edit.cancel') || 'Cancel'}
            </Button>
            <Button
              type='submit'
              disabled={loading}
              className='bg-blue-600 hover:bg-blue-700'
            >
              {loading
                ? t('edit.saving') || 'Saving...'
                : t('edit.save') || 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
