import React, { useState, useMemo } from 'react'
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
import { Eye, EyeOff, RefreshCw } from 'lucide-react'

interface UserCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (user: UserProfile) => void
}

const DEFAULT_PHONE_CODE = '+84'

const PASSWORD_CHARSET = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digit: '0123456789',
  symbol: '!@#$%^&*',
}

const generatePassword = (length = 12) => {
  const all = Object.values(PASSWORD_CHARSET).join('')
  const randomChar = (charset: string) =>
    charset[Math.floor(Math.random() * charset.length)]

  const required = Object.values(PASSWORD_CHARSET).map(randomChar)
  const rest = Array.from({ length: length - required.length }, () =>
    randomChar(all),
  )

  return [...required, ...rest].sort(() => Math.random() - 0.5).join('')
}

type UserCreateFormData = {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  password: string
}

export const UserCreateDialog: React.FC<UserCreateDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.users')
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const userCreateSchema = useMemo(
    () =>
      z.object({
        firstName: z
          .string()
          .trim()
          .min(1, t('create.validation.firstNameRequired')),
        lastName: z
          .string()
          .trim()
          .min(1, t('create.validation.lastNameRequired')),
        email: z
          .string()
          .trim()
          .min(1, t('create.validation.emailRequired'))
          .regex(
            VALIDATION_PATTERNS.EMAIL,
            t('create.validation.emailInvalid'),
          ),
        phoneNumber: z
          .string()
          .trim()
          .min(1, t('create.validation.phoneNumberRequired')),
        password: z
          .string()
          .min(1, t('create.validation.passwordRequired'))
          .min(8, t('create.validation.passwordMinLength')),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserCreateFormData>({
    resolver: zodResolver(userCreateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
    },
  })

  const handleGeneratePassword = () => {
    setValue('password', generatePassword(), { shouldValidate: true })
    setShowPassword(true)
  }

  const onSubmit = async (data: UserCreateFormData) => {
    setLoading(true)
    setServerError(null)
    try {
      const resp = await createUser({ ...data, phoneCode: DEFAULT_PHONE_CODE })
      if (resp.success && resp.data) {
        onSuccess(resp.data)
        onOpenChange(false)
        reset()
        setShowPassword(false)
      } else {
        setServerError(resp.message || t('create.createFailed'))
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setServerError(error.message || t('create.createError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('create.title')}</DialogTitle>
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

          <div className='space-y-2'>
            <Label htmlFor='phoneNumber'>{t('create.phoneNumber')} *</Label>
            <Input id='phoneNumber' {...register('phoneNumber')} />
            {errors.phoneNumber && (
              <p className='text-xs text-destructive'>
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>{t('create.password')} *</Label>
            <div className='flex items-center gap-2'>
              <div className='relative flex-1'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  className='pr-10'
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((prev) => !prev)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                  aria-label={
                    showPassword
                      ? t('create.hidePassword')
                      : t('create.showPassword')
                  }
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              <Button
                type='button'
                variant='outline'
                size='icon'
                onClick={handleGeneratePassword}
                aria-label={t('create.generatePassword')}
                title={t('create.generatePassword')}
              >
                <RefreshCw className='h-4 w-4' />
              </Button>
            </div>
            {errors.password && (
              <p className='text-xs text-destructive'>
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className='text-destructive text-sm'>{serverError}</div>
          )}

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('create.cancel')}
            </Button>
            <Button type='submit' disabled={loading}>
              {loading ? t('create.creating') : t('create.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
