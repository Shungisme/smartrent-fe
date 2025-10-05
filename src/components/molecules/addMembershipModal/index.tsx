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
import { Plus, Minus } from 'lucide-react'

export type MembershipFormData = {
  name: string
  price: string
  discount: string
  features: string[]
  isActive: boolean
}

interface AddMembershipModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: MembershipFormData) => void
}

export default function AddMembershipModal({
  open,
  onOpenChange,
  onSubmit,
}: AddMembershipModalProps) {
  const [formData, setFormData] = useState<MembershipFormData>({
    name: '',
    price: '',
    discount: '',
    features: [''],
    isActive: true,
  })

  const handleAddFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ''],
    })
  }

  const handleRemoveFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    })
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData({ ...formData, features: newFeatures })
  }

  const handleSubmit = () => {
    onSubmit(formData)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      discount: '',
      features: [''],
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
          <DialogTitle>Add Membership Package</DialogTitle>
        </DialogHeader>
        <div className='overflow-y-auto flex-1 px-1'>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='package-name'>Package Name</Label>
                <Input
                  id='package-name'
                  placeholder='e.g., Premium, VIP'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='package-price'>Price (đ/month)</Label>
                <Input
                  id='package-price'
                  type='number'
                  placeholder='e.g., 99000'
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='package-discount'>Discount (%)</Label>
              <Input
                id='package-discount'
                type='number'
                placeholder='e.g., 10'
                value={formData.discount}
                onChange={(e) =>
                  setFormData({ ...formData, discount: e.target.value })
                }
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label>Features</Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={handleAddFeature}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Add Feature
                </Button>
              </div>
              <div className='space-y-2'>
                {formData.features.map((feature, index) => (
                  <div key={index} className='flex gap-2'>
                    <Input
                      placeholder='e.g., Post 10 listings/month'
                      value={feature}
                      onChange={(e) =>
                        handleFeatureChange(index, e.target.value)
                      }
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => handleRemoveFeature(index)}
                      >
                        <Minus className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='package-active'
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className='h-4 w-4 rounded border-gray-300'
              />
              <Label htmlFor='package-active'>Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className='bg-blue-600 hover:bg-blue-700'
            onClick={handleSubmit}
          >
            Create Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
