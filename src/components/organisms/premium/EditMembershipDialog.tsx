'use client'

import React, { useEffect, useState } from 'react'
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

export type EditMembershipFormData = {
  packageName: string
  salePrice: number
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
  const [form, setForm] = useState<EditMembershipFormData>({
    packageName: '',
    salePrice: 0,
    discountPercentage: 0,
    isActive: true,
  })

  useEffect(() => {
    if (pkg) {
      setForm({
        packageName: pkg.packageName,
        salePrice: pkg.salePrice,
        discountPercentage: pkg.discountPercentage,
        isActive: pkg.isActive,
      })
    }
  }, [pkg])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-[min(92vw,32rem)]'>
        <DialogHeader>
          <DialogTitle>{t('title')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='edit-pkg-name'>{t('fields.packageName')}</Label>
            <Input
              id='edit-pkg-name'
              value={form.packageName}
              onChange={(e) =>
                setForm((f) => ({ ...f, packageName: e.target.value }))
              }
              placeholder={t('placeholders.packageName')}
              required
              maxLength={120}
            />
          </div>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor='edit-pkg-price'>{t('fields.salePrice')}</Label>
              <Input
                id='edit-pkg-price'
                type='number'
                min={0}
                step={1000}
                value={form.salePrice}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    salePrice: Number(e.target.value) || 0,
                  }))
                }
                required
              />
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
                value={form.discountPercentage}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    discountPercentage: Number(e.target.value) || 0,
                  }))
                }
                required
              />
            </div>
          </div>

          <label className='flex items-center gap-2 pt-1'>
            <input
              type='checkbox'
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
              className='h-4 w-4 rounded border-border text-primary focus:ring-primary'
            />
            <span className='text-sm text-foreground'>
              {t('fields.isActive')}
            </span>
          </label>

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
