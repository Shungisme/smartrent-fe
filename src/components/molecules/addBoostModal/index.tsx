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

export type BoostFormData = {
  name: string
  price: string
  boostsPerDay: string
  description: string
  isActive: boolean
}

interface AddBoostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BoostFormData) => void
}

export default function AddBoostModal({
  open,
  onOpenChange,
  onSubmit,
}: AddBoostModalProps) {
  const [formData, setFormData] = useState<BoostFormData>({
    name: '',
    price: '',
    boostsPerDay: '',
    description: '',
    isActive: true,
  })

  const handleSubmit = () => {
    onSubmit(formData)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      boostsPerDay: '',
      description: '',
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
          <DialogTitle>Add Boost Package</DialogTitle>
        </DialogHeader>
        <div className='overflow-y-auto flex-1 px-1'>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='boost-name'>Package Name</Label>
                <Input
                  id='boost-name'
                  placeholder='e.g., Starter Boost'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='boost-price'>Price (đ)</Label>
                <Input
                  id='boost-price'
                  type='number'
                  placeholder='e.g., 50000'
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='boost-per-day'>Boosts Per Day</Label>
              <Input
                id='boost-per-day'
                type='number'
                placeholder='e.g., 3'
                value={formData.boostsPerDay}
                onChange={(e) =>
                  setFormData({ ...formData, boostsPerDay: e.target.value })
                }
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='boost-description'>Description</Label>
              <textarea
                id='boost-description'
                className='w-full rounded-md border border-gray-300 px-3 py-2 min-h-[100px]'
                placeholder='Describe the boost package benefits...'
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className='flex items-center space-x-2'>
              <input
                type='checkbox'
                id='boost-active'
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className='h-4 w-4 rounded border-gray-300'
              />
              <Label htmlFor='boost-active'>Active</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className='bg-orange-600 hover:bg-orange-700'
            onClick={handleSubmit}
          >
            Create Boost Package
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
