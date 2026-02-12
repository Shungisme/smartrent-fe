import React, { useState } from 'react'
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
import { createUser } from '@/api/services/user.service'
import { CreateUserRequest, UserProfile } from '@/api/types/user.type'

interface UserCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (user: UserProfile) => void
}

export const UserCreateDialog: React.FC<UserCreateDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.users')
  const [form, setForm] = useState<
    Partial<CreateUserRequest & { password: string }>
  >({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const resp = await createUser(form as CreateUserRequest)
      if (resp.success && resp.data) {
        onSuccess(resp.data)
        onOpenChange(false)
        setForm({})
      } else {
        setError(resp.message || 'Failed to create user')
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setError(error.message || 'Error creating user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[40vw] max-w-md max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('create.title') || 'Create User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-2'>
          <div className='space-y-2'>
            <Label htmlFor='firstName'>{t('create.firstName')} *</Label>
            <Input
              id='firstName'
              value={form.firstName || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, firstName: e.target.value }))
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lastName'>{t('create.lastName')} *</Label>
            <Input
              id='lastName'
              value={form.lastName || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, lastName: e.target.value }))
              }
              required
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>{t('create.email')} *</Label>
            <Input
              id='email'
              type='email'
              value={form.email || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              required
            />
          </div>

          <div className='grid grid-cols-3 gap-2'>
            <div className='space-y-2'>
              <Label htmlFor='phoneCode'>{t('create.phoneCode')} *</Label>
              <Input
                id='phoneCode'
                value={form.phoneCode || ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phoneCode: e.target.value }))
                }
                required
              />
            </div>
            <div className='col-span-2 space-y-2'>
              <Label htmlFor='phoneNumber'>{t('create.phoneNumber')} *</Label>
              <Input
                id='phoneNumber'
                value={form.phoneNumber || ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    phoneNumber: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>{t('create.password')} *</Label>
            <Input
              id='password'
              type='password'
              value={form.password || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              required
              minLength={8}
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='idDocument'>{t('create.idDocument')}</Label>
            <Input
              id='idDocument'
              value={form.idDocument || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, idDocument: e.target.value }))
              }
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='taxNumber'>{t('create.taxNumber')}</Label>
            <Input
              id='taxNumber'
              value={form.taxNumber || ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, taxNumber: e.target.value }))
              }
            />
          </div>

          {error && <div className='text-red-600 text-sm'>{error}</div>}

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('create.cancel') || 'Cancel'}
            </Button>
            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700'
              disabled={loading}
            >
              {loading
                ? t('create.creating') || 'Creating...'
                : t('create.create') || 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
