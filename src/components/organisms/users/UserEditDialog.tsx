import React, { useState, useEffect, useMemo } from 'react'
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
import { useForm } from 'react-hook-form'
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

type UserEditFormData = {
  firstName: string
  lastName: string
  email: string
  contactPhoneNumber?: string
}

export const UserEditDialog: React.FC<UserEditDialogProps> = ({
  user,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.users')
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const userEditSchema = useMemo(
    () =>
      z.object({
        firstName: z
          .string()
          .trim()
          .min(1, t('edit.validation.firstNameRequired')),
        lastName: z
          .string()
          .trim()
          .min(1, t('edit.validation.lastNameRequired')),
        email: z
          .string()
          .trim()
          .min(1, t('edit.validation.emailRequired'))
          .regex(VALIDATION_PATTERNS.EMAIL, t('edit.validation.emailInvalid')),
        contactPhoneNumber: z.string().optional(),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserEditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      contactPhoneNumber: '',
    },
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        contactPhoneNumber: user.contactPhoneNumber || '',
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
        setServerError(resp.message || t('edit.updateFailed'))
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setServerError(error.message || t('edit.updateError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[40vw] max-w-md max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('edit.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <div className='space-y-2'>
            <Label htmlFor='editFirstName'>{t('edit.firstName')} *</Label>
            <Input id='editFirstName' {...register('firstName')} />
            {errors.firstName && (
              <p className='text-xs text-destructive'>
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='editLastName'>{t('edit.lastName')} *</Label>
            <Input id='editLastName' {...register('lastName')} />
            {errors.lastName && (
              <p className='text-xs text-destructive'>
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='editEmail'>{t('edit.email')} *</Label>
            <Input id='editEmail' type='email' {...register('email')} />
            {errors.email && (
              <p className='text-xs text-destructive'>{errors.email.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='editContactPhone'>{t('edit.contactPhone')}</Label>
            <Input id='editContactPhone' {...register('contactPhoneNumber')} />
          </div>

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
              {t('edit.cancel')}
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? t('edit.saving') : t('edit.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
