import React, { useEffect } from 'react'
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
import { updateRole } from '@/api/services/role.service'
import { Role } from '@/api/types/role.type'

interface RoleEditDialogProps {
  role: Role | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const roleEditSchema = z.object({
  roleName: z.string().trim().min(1, 'Role name is required'),
})

type RoleEditFormData = z.infer<typeof roleEditSchema>

export const RoleEditDialog: React.FC<RoleEditDialogProps> = ({
  role,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const t = useTranslations('admin.roles')
  const [serverError, setServerError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoleEditFormData>({
    resolver: zodResolver(roleEditSchema),
    defaultValues: { roleName: '' },
  })

  useEffect(() => {
    if (role) {
      reset({ roleName: role.roleName })
      setServerError(null)
    }
  }, [role, reset])

  const handleOpenChange = (open: boolean) => {
    if (!open) setServerError(null)
    onOpenChange(open)
  }

  const onSubmit = async (data: RoleEditFormData) => {
    if (!role) return
    setServerError(null)
    try {
      const resp = await updateRole(role.roleId, { roleName: data.roleName })
      if (resp.success && resp.data) {
        onOpenChange(false)
        onSuccess()
      } else {
        setServerError(resp.message || 'Failed to update role')
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setServerError(error.message || 'Error updating role')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('edit.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='editRoleId'>{t('create.roleId')}</Label>
            <Input id='editRoleId' value={role?.roleId ?? ''} disabled />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='editRoleName'>{t('create.roleName')} *</Label>
            <Input
              id='editRoleName'
              placeholder={t('create.roleName')}
              {...register('roleName')}
            />
            {errors.roleName && (
              <p className='text-xs text-destructive'>
                {errors.roleName.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className='text-sm text-destructive'>{serverError}</p>
          )}

          <div className='flex gap-3'>
            <Button
              type='button'
              variant='outline'
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
              className='flex-1'
            >
              {t('edit.cancel')}
            </Button>
            <Button type='submit' disabled={isSubmitting} className='flex-1'>
              {isSubmitting ? t('edit.saving') : t('edit.save')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
