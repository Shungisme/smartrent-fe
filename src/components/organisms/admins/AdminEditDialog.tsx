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
import { updateAdmin } from '@/api/services/admin.service'
import { getRoles } from '@/api/services/role.service'
import { Role } from '@/api/types/role.type'
import { AdminProfile } from '@/api/types/admin.type'
import { VALIDATION_PATTERNS } from '@/api/types/auth.type'

interface AdminEditDialogProps {
  admin: AdminProfile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (admin: AdminProfile) => void
}

const adminEditSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .regex(VALIDATION_PATTERNS.EMAIL, 'Invalid email address'),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  phoneCode: z.string().trim().min(1, 'Phone code is required'),
  phoneNumber: z.string().trim().min(1, 'Phone number is required'),
  roles: z.array(z.string()),
})

type AdminEditFormData = z.infer<typeof adminEditSchema>

export const AdminEditDialog: React.FC<AdminEditDialogProps> = ({
  admin,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.admins')
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AdminEditFormData>({
    resolver: zodResolver(adminEditSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phoneCode: '',
      phoneNumber: '',
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

  useEffect(() => {
    if (admin) {
      reset({
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        phoneCode: admin.phoneCode,
        phoneNumber: admin.phoneNumber,
        roles: admin.roles,
      })
    }
  }, [admin, reset])

  const onSubmit = async (data: AdminEditFormData) => {
    if (!admin) return

    setLoading(true)
    setServerError(null)
    try {
      const resp = await updateAdmin(admin.adminId, data)
      if (resp.success && resp.data) {
        onSuccess(resp.data)
        onOpenChange(false)
      } else {
        setServerError(resp.message || 'Failed to update admin')
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setServerError(error.message || 'Error updating admin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[20vw] max-w-md max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('edit.title') || 'Edit Admin'}</DialogTitle>
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

          <div className='grid grid-cols-3 gap-2'>
            <div className='space-y-2'>
              <Label htmlFor='editPhoneCode'>
                {t('edit.phoneCode') || 'Code'} *
              </Label>
              <Input id='editPhoneCode' {...register('phoneCode')} />
              {errors.phoneCode && (
                <p className='text-xs text-destructive'>
                  {errors.phoneCode.message}
                </p>
              )}
            </div>
            <div className='col-span-2 space-y-2'>
              <Label htmlFor='editPhoneNumber'>
                {t('edit.phoneNumber') || 'Phone Number'} *
              </Label>
              <Input id='editPhoneNumber' {...register('phoneNumber')} />
              {errors.phoneNumber && (
                <p className='text-xs text-destructive'>
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label>{t('edit.roles') || 'Roles'}</Label>
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
                          checked={field.value?.includes(role.roleId) || false}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([
                                ...(field.value || []),
                                role.roleId,
                              ])
                            } else {
                              field.onChange(
                                (field.value || []).filter(
                                  (r) => r !== role.roleId,
                                ),
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
