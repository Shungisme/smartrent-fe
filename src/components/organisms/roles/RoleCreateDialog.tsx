import React from 'react'
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
import { createRole } from '@/api/services/role.service'

interface RoleCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const roleCreateSchema = z.object({
  roleId: z.string().trim().min(1, 'Role ID is required'),
  roleName: z.string().trim().min(1, 'Role name is required'),
})

type RoleCreateFormData = z.infer<typeof roleCreateSchema>

export const RoleCreateDialog: React.FC<RoleCreateDialogProps> = ({
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
  } = useForm<RoleCreateFormData>({
    resolver: zodResolver(roleCreateSchema),
    defaultValues: { roleId: '', roleName: '' },
  })

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
      setServerError(null)
    }
    onOpenChange(open)
  }

  const onSubmit = async (data: RoleCreateFormData) => {
    setServerError(null)
    try {
      const resp = await createRole(data)
      if (resp.success && resp.data) {
        reset()
        onOpenChange(false)
        onSuccess()
      } else {
        setServerError(resp.message || 'Failed to create role')
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setServerError(error.message || 'Error creating role')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('create.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='roleId'>{t('create.roleId')} *</Label>
            <Input
              id='roleId'
              placeholder={t('create.roleId')}
              {...register('roleId')}
            />
            {errors.roleId && (
              <p className='text-xs text-destructive'>
                {errors.roleId.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='roleName'>{t('create.roleName')} *</Label>
            <Input
              id='roleName'
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
              {t('create.cancel')}
            </Button>
            <Button type='submit' disabled={isSubmitting} className='flex-1'>
              {isSubmitting ? t('create.creating') : t('create.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
