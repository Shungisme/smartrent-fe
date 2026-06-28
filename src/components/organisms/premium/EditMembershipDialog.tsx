'use client'

import React, { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import { MembershipPackage } from '@/api/types/membership.type'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export type EditMembershipFormData = {
  packageName: string
  salePrice: number
  discountPercentage: number
  isActive: boolean
}

const editMembershipSchema = z.object({
  packageName: z
    .string()
    .trim()
    .min(1, 'Package name is required')
    .max(120, 'Package name must be at most 120 characters'),
  salePrice: z.number().min(0, 'Price must be non-negative'),
  discountPercentage: z
    .number()
    .min(0, 'Must be between 0 and 100')
    .max(100, 'Must be between 0 and 100'),
  isActive: z.boolean(),
})

interface EditMembershipDialogProps {
  open: boolean
  pkg: MembershipPackage | null
  loading?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: EditMembershipFormData) => void
}

export const EditMembershipDialog: React.FC<EditMembershipDialogProps> = ({
  open,
  pkg,
  loading = false,
  onOpenChange,
  onSubmit,
}) => {
  const t = useTranslations('premium.membership.edit')

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditMembershipFormData>({
    resolver: zodResolver(editMembershipSchema),
    defaultValues: {
      packageName: '',
      salePrice: 0,
      discountPercentage: 0,
      isActive: true,
    },
  })

  useEffect(() => {
    if (pkg) {
      reset({
        packageName: pkg.packageName,
        salePrice: pkg.salePrice,
        discountPercentage: pkg.discountPercentage,
        isActive: pkg.isActive,
      })
    }
  }, [pkg, reset])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[min(92vw,32rem)]'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='edit-pkg-name'>{t('fields.packageName')}</Label>
            <Input
              id='edit-pkg-name'
              {...register('packageName')}
              placeholder={t('placeholders.packageName')}
              maxLength={120}
            />
            {errors.packageName && (
              <p className='text-xs text-destructive'>
                {errors.packageName.message}
              </p>
            )}
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='edit-pkg-price'>{t('fields.salePrice')}</Label>
              <Input
                id='edit-pkg-price'
                type='number'
                min={0}
                step={1000}
                {...register('salePrice', { valueAsNumber: true })}
              />
              {errors.salePrice && (
                <p className='text-xs text-destructive'>
                  {errors.salePrice.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='edit-pkg-discount'>
                {t('fields.discountPercentage')}
              </Label>
              <Input
                id='edit-pkg-discount'
                type='number'
                min={0}
                max={100}
                step={0.01}
                {...register('discountPercentage', { valueAsNumber: true })}
              />
              {errors.discountPercentage && (
                <p className='text-xs text-destructive'>
                  {errors.discountPercentage.message}
                </p>
              )}
            </div>
          </div>

          <Controller
            name='isActive'
            control={control}
            render={({ field }) => (
              <label className='flex items-center gap-2 pt-1'>
                <input
                  type='checkbox'
                  checked={field.value}
                  onChange={field.onChange}
                  className='h-4 w-4 rounded border-border text-primary focus:ring-primary'
                />
                <span className='text-sm text-foreground'>
                  {t('fields.isActive')}
                </span>
              </label>
            )}
          />

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('cancel')}
            </Button>
            <Button type='submit' disabled={loading}>
              {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {loading ? t('saving') : t('save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditMembershipDialog
