import React, { useState } from 'react'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import { Label } from '@/components/atoms/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/atoms/dialog'

export type PromoFormData = {
  code: string
  type: 'percentage' | 'fixed_amount'
  target: 'all' | 'new_users' | 'premium' | 'basic'
  discount: string
  usageLimit: string
  validUntil: string
  isActive: boolean
}

interface CreatePromoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: PromoFormData) => void
}

export default function CreatePromoModal({
  open,
  onOpenChange,
  onSubmit,
}: CreatePromoModalProps) {
  const [formData, setFormData] = useState<PromoFormData>({
    code: '',
    type: 'percentage',
    target: 'all',
    discount: '',
    usageLimit: '',
    validUntil: '',
    isActive: true,
  })

  const handleSubmit = () => {
    onSubmit(formData)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      target: 'all',
      discount: '',
      usageLimit: '',
      validUntil: '',
      isActive: true,
    })
  }

  const handleCancel = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Create Promotional Code</DialogTitle>
        </DialogHeader>
        <div className='overflow-y-auto flex-1 px-1'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='promo-code'>Promo Code</Label>
              <Input
                id='promo-code'
                placeholder='e.g., SUMMER2024'
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='promo-type'>Type</Label>
                <select
                  id='promo-type'
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as 'percentage' | 'fixed_amount',
                    })
                  }
                >
                  <option value='percentage'>Percentage</option>
                  <option value='fixed_amount'>Fixed Amount</option>
                </select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='promo-target'>Target</Label>
                <select
                  id='promo-target'
                  className='w-full rounded-md border border-gray-300 px-3 py-2'
                  value={formData.target}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target: e.target.value as
                        | 'all'
                        | 'new_users'
                        | 'premium'
                        | 'basic',
                    })
                  }
                >
                  <option value='all'>All Users</option>
                  <option value='new_users'>New Users</option>
                  <option value='premium'>Premium</option>
                  <option value='basic'>Basic</option>
                </select>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='promo-discount'>
                  Discount {formData.type === 'percentage' ? '(%)' : '(đ)'}
                </Label>
                <Input
                  id='promo-discount'
                  type='number'
                  placeholder={formData.type === 'percentage' ? '10' : '50000'}
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='promo-limit'>Usage Limit</Label>
                <Input
                  id='promo-limit'
                  type='number'
                  placeholder='e.g., 100'
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='promo-valid'>Valid Until</Label>
              <Input
                id='promo-valid'
                type='date'
                value={formData.validUntil}
                onChange={(e) =>
                  setFormData({ ...formData, validUntil: e.target.value })
                }
              />
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='promo-active'
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className='h-4 w-4 rounded border-gray-300'
              />
              <Label htmlFor='promo-active'>Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className='bg-green-600 hover:bg-green-700'
            onClick={handleSubmit}
          >
            Create Promo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
