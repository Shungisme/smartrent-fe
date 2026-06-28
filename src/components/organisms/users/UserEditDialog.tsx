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
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { updateUser } from '@/api/services/user.service'
import { UserProfile } from '@/api/types/user.type'
import { VALIDATION_PATTERNS } from '@/api/types/auth.type'

interface UserEditDialogProps {
  user: UserProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (user: UserProfile) => void
}

const userEditSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .regex(VALIDATION_PATTERNS.EMAIL, 'Invalid email address'),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  contactPhoneNumber: z.string().optional(),
  isVerified: z.boolean(),
})

type UserEditFormData = z.infer<typeof userEditSchema>

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.users')
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      contactPhoneNumber: '',
      isVerified: false,
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        contactPhoneNumber: user.contactPhoneNumber || '',
        isVerified:
          (user as UserProfile & { isVerified?: boolean }).isVerified ?? false,
      })
    }
  }, [user, reset])

  const onSubmit = async (data: UserEditFormData) => {
    if (!user) return

    setLoading(true)
    setServerError(null)
    try {
      const resp = await updateUser(user.userId, data)
      if (resp.success && resp.data) {
        onSuccess(resp.data)
        onOpenChange(false)
      } else {
        setServerError(resp.message || 'Failed to update user')
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setServerError(error.message || 'Error updating user')
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
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <div className='space-y-2'>
            <Label htmlFor='editEmail'>{t('edit.email') || 'Email'} *</Label>
            <Input id='editEmail' type='email' {...register('email')} />
            {errors.email && (
              <p className='text-xs text-destructive'>{errors.email.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='editFirstName'>
              {t('edit.firstName') || 'First Name'} *
            </Label>
            <Input id='editFirstName' {...register('firstName')} />
            {errors.firstName && (
              <p className='text-xs text-destructive'>
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='editLastName'>
              {t('edit.lastName') || 'Last Name'} *
            </Label>
            <Input id='editLastName' {...register('lastName')} />
            {errors.lastName && (
              <p className='text-xs text-destructive'>
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='editContactPhone'>
              {t('edit.contactPhone') || 'Contact Phone'}
            </Label>
            <Input id='editContactPhone' {...register('contactPhoneNumber')} />
          </div>

          <Controller
            name='isVerified'
            control={control}
            render={({ field }) => (
              <label className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={field.value}
                  onChange={field.onChange}
                  className='rounded border-border text-primary focus:ring-primary'
                />
                <span className='text-sm'>
                  {t('edit.verified') || 'Verified'}
                </span>
              </label>
            )}
          />

          {serverError && (
            <div className='text-destructive text-sm'>{serverError}</div>
          )}

          <div className='flex justify-end gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('edit.cancel') || 'Cancel'}
            </Button>
            <Button type='submit' disabled={loading}>
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
