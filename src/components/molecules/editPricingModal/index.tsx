import React, { useState, useEffect } from 'react'
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

export type PricingFormData = {
  listingType: string
  pricing1Day: string
  pricing10Days: string
  pricing15Days: string
  pricing30Days: string
  baseClickPrice: string
  minClickPrice: string
  maxClickPrice: string
}

interface EditPricingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: PricingFormData) => void
  initialData?: PricingFormData
}

export default function EditPricingModal({
  open,
  onOpenChange,
  onSubmit,
  initialData,
}: EditPricingModalProps) {
  const [formData, setFormData] = useState<PricingFormData>({
    listingType: '',
    pricing1Day: '',
    pricing10Days: '',
    pricing15Days: '',
    pricing30Days: '',
    baseClickPrice: '',
    minClickPrice: '',
    maxClickPrice: '',
  })

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleSubmit = () => {
    onSubmit(formData)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>
            Edit Listing Type Pricing - {formData.listingType}
          </DialogTitle>
        </DialogHeader>
        <div className='overflow-y-auto flex-1 px-1'>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label className='text-base font-semibold'>
                Day-based Pricing
              </Label>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='price-1day'>1 Day (đ)</Label>
                  <Input
                    id='price-1day'
                    type='number'
                    value={formData.pricing1Day}
                    onChange={(e) =>
                      setFormData({ ...formData, pricing1Day: e.target.value })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='price-10days'>10 Days (đ)</Label>
                  <Input
                    id='price-10days'
                    type='number'
                    value={formData.pricing10Days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing10Days: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='price-15days'>15 Days (đ)</Label>
                  <Input
                    id='price-15days'
                    type='number'
                    value={formData.pricing15Days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing15Days: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='price-30days'>30 Days (đ)</Label>
                  <Input
                    id='price-30days'
                    type='number'
                    value={formData.pricing30Days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricing30Days: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label className='text-base font-semibold'>
                Click-based Pricing
              </Label>
              <div className='grid grid-cols-3 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='base-click-price'>Base Price (đ/click)</Label>
                  <Input
                    id='base-click-price'
                    type='number'
                    value={formData.baseClickPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        baseClickPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='min-clicks'>Min Clicks</Label>
                  <Input
                    id='min-clicks'
                    type='number'
                    value={formData.minClickPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minClickPrice: e.target.value,
                      })
                    }
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='max-clicks'>Max Clicks</Label>
                  <Input
                    id='max-clicks'
                    type='number'
                    value={formData.maxClickPrice}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxClickPrice: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className='bg-purple-600 hover:bg-purple-700'
            onClick={handleSubmit}
          >
            Update Pricing
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
