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
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createUser } from '@/api/services/user.service'
import { UserProfile } from '@/api/types/user.type'
import { VALIDATION_PATTERNS } from '@/api/types/auth.type'

interface UserCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (user: UserProfile) => void
}

const userCreateSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .regex(VALIDATION_PATTERNS.EMAIL, 'Invalid email address'),
  phoneCode: z.string().trim().min(1, 'Phone code is required'),
  phoneNumber: z.string().trim().min(1, 'Phone number is required'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
})

type UserCreateFormData = z.infer<typeof userCreateSchema>

export const UserCreateDialog: React.FC<UserCreateDialogProps> = ({
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
    reset,
    formState: { errors },
  } = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneCode: '',
      phoneNumber: '',
      password: '',
    },
  })

  const onSubmit = async (data: UserCreateFormData) => {
    setLoading(true)
    setServerError(null)
    try {
      const resp = await createUser(data)
      if (resp.success && resp.data) {
        onSuccess(resp.data)
        onOpenChange(false)
        reset()
      } else {
        setServerError(resp.message || 'Failed to create user')
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setServerError(error.message || 'Error creating user')
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
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-2'>
          <div className='space-y-2'>
            <Label htmlFor='firstName'>{t('create.firstName')} *</Label>
            <Input id='firstName' {...register('firstName')} />
            {errors.firstName && (
              <p className='text-xs text-destructive'>
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='lastName'>{t('create.lastName')} *</Label>
            <Input id='lastName' {...register('lastName')} />
            {errors.lastName && (
              <p className='text-xs text-destructive'>
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>{t('create.email')} *</Label>
            <Input id='email' type='email' {...register('email')} />
            {errors.email && (
              <p className='text-xs text-destructive'>{errors.email.message}</p>
            )}
          </div>

          <div className='grid grid-cols-3 gap-2'>
            <div className='space-y-2'>
              <Label htmlFor='phoneCode'>{t('create.phoneCode')} *</Label>
              <Input id='phoneCode' {...register('phoneCode')} />
              {errors.phoneCode && (
                <p className='text-xs text-destructive'>
                  {errors.phoneCode.message}
                </p>
              )}
            </div>
            <div className='col-span-2 space-y-2'>
              <Label htmlFor='phoneNumber'>{t('create.phoneNumber')} *</Label>
              <Input id='phoneNumber' {...register('phoneNumber')} />
              {errors.phoneNumber && (
                <p className='text-xs text-destructive'>
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>{t('create.password')} *</Label>
            <Input id='password' type='password' {...register('password')} />
            {errors.password && (
              <p className='text-xs text-destructive'>
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className='text-red-600 text-sm'>{serverError}</div>
          )}

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('create.cancel') || 'Cancel'}
            </Button>
            <Button type='submit' disabled={loading}>
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
