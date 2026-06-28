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
import { createAdmin } from '@/api/services/admin.service'
import { getRoles } from '@/api/services/role.service'
import { Role } from '@/api/types/role.type'
import { AdminProfile } from '@/api/types/admin.type'
import { VALIDATION_PATTERNS } from '@/api/types/auth.type'

interface AdminCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (admin: AdminProfile) => void
}

const adminCreateSchema = z.object({
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
  roles: z.array(z.string()).min(1, 'At least one role must be selected'),
})

type AdminCreateFormData = z.infer<typeof adminCreateSchema>

export const AdminCreateDialog: React.FC<AdminCreateDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.admins')
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<Role[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AdminCreateFormData>({
    resolver: zodResolver(adminCreateSchema),
    defaultValues: {
      phoneCode: '+84',
      phoneNumber: '',
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      roles: [],
    },
  })

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await getRoles()
        if (response.success) {
          setRoles(response.data?.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch roles:', error)
      } finally {
        setRolesLoading(false)
      }
    }
    fetchRoles()
  }, [])

  const onSubmit = async (data: AdminCreateFormData) => {
    setLoading(true)
    try {
      const response = await createAdmin(data)
      if (response.success && response.data) {
        alert(
          `Admin created successfully!\nTemporary Password: ${response.data.password}\n\nPlease save this password securely.`,
        )
        const newAdmin: AdminProfile = {
          adminId: response.data.adminId,
          phoneCode: response.data.phoneCode,
          phoneNumber: response.data.phoneNumber,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          roles: response.data.roles,
          idDocument: null,
          taxNumber: null,
        }
        onSuccess(newAdmin)
        onOpenChange(false)
        reset()
      } else {
        alert(`Error: ${response.message}`)
      }
    } catch (error: unknown) {
      const err = error as { message?: string }
      alert(`Failed to create admin: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[20vw] max-w-md max-h-[80vh] overflow-y-auto'>
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

          <div className='space-y-2'>
            <Label>
              {t('create.roles')} * ({t('create.selectRoles')})
            </Label>
            {rolesLoading ? (
              <p className='text-sm text-muted-foreground'>Loading roles...</p>
            ) : (
              <Controller
                name='roles'
                control={control}
                render={({ field }) => (
                  <div className='space-y-2 mt-2'>
                    {roles.map((role) => (
                      <label
                        key={role.roleId}
                        className='flex items-center gap-2'
                      >
                        <input
                          type='checkbox'
                          checked={field.value.includes(role.roleId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, role.roleId])
                            } else {
                              field.onChange(
                                field.value.filter((r) => r !== role.roleId),
                              )
                            }
                          }}
                          className='rounded border-border text-primary focus:ring-primary'
                        />
                        <span className='text-sm'>{role.roleName}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            )}
            {errors.roles && (
              <p className='text-xs text-destructive'>{errors.roles.message}</p>
            )}
          </div>

          <div className='flex gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className='flex-1'
            >
              {t('create.cancel')}
            </Button>
            <Button type='submit' disabled={loading} className='flex-1'>
              {loading ? t('create.creating') : t('create.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
