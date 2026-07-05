'use client'

import React, { useEffect, useMemo } from 'react'
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
import { formatCurrency } from '@/utils/format'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export type EditMembershipFormData = {
  packageName: string
  salePrice: number
  discountPercentage: number
  isActive: boolean
}

type EditMembershipInternalFormData = {
  packageName: string
  discountPercentage: number
  isActive: boolean
}

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

  const editMembershipSchema = useMemo(
    () =>
      z.object({
        packageName: z
          .string()
          .trim()
          .min(1, t('validation.packageNameRequired'))
          .max(120, t('validation.packageNameMaxLength')),
        discountPercentage: z
          .number({ error: t('validation.discountPercentageRequired') })
          .min(0, t('validation.discountPercentageRange'))
          .max(100, t('validation.discountPercentageRange')),
        isActive: z.boolean(),
      }),
    [t],
  )

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<EditMembershipInternalFormData>({
    resolver: zodResolver(editMembershipSchema),
    defaultValues: {
      packageName: '',
      discountPercentage: 0,
      isActive: true,
    },
  })

  useEffect(() => {
    if (pkg) {
      reset({
        packageName: pkg.packageName,
        discountPercentage: pkg.discountPercentage,
        isActive: pkg.isActive,
      })
    }
  }, [pkg, reset])

  const watchedDiscount = watch('discountPercentage')

  const computedSalePrice = useMemo(() => {
    if (!pkg) return 0
    const discount = Number.isFinite(watchedDiscount) ? watchedDiscount : 0
    return Math.round(pkg.originalPrice * (1 - discount / 100))
  }, [pkg, watchedDiscount])

  const handleFormSubmit = (data: EditMembershipInternalFormData) => {
    onSubmit({
      packageName: data.packageName,
      discountPercentage: data.discountPercentage,
      isActive: data.isActive,
      salePrice: computedSalePrice,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[min(92vw,32rem)]'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className='space-y-4'>
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

          <div className='space-y-2'>
            <Label htmlFor='edit-pkg-original-price'>
              {t('fields.originalPrice')}
            </Label>
            <Input
              id='edit-pkg-original-price'
              value={pkg ? formatCurrency(pkg.originalPrice) : ''}
              disabled
              readOnly
            />
            <p className='text-xs text-muted-foreground'>
              {t('originalPriceHint')}
            </p>
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
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
                {...register('discountPercentage', {
                  setValueAs: (v) =>
                    v === '' || v === null || v === undefined
                      ? undefined
                      : Number(v),
                })}
              />
              {errors.discountPercentage && (
                <p className='text-xs text-destructive'>
                  {errors.discountPercentage.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='edit-pkg-sale-price'>
                {t('fields.salePrice')}
              </Label>
              <Input
                id='edit-pkg-sale-price'
                value={formatCurrency(computedSalePrice)}
                disabled
                readOnly
              />
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
