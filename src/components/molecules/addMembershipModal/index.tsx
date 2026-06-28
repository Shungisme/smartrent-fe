import React from 'react'
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
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

export type MembershipFormData = {
  name: string
  price: string
  discount: string
  features: string[]
  isActive: boolean
}

const membershipSchema = z.object({
  name: z.string().trim().min(1, 'Package name is required'),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine(
      (v) => !isNaN(Number(v)) && Number(v) >= 0,
      'Price must be a valid non-negative number',
    ),
  discount: z
    .string()
    .optional()
    .refine(
      (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 100),
      'Discount must be between 0 and 100',
    ),
  features: z
    .array(
      z.object({ value: z.string().trim().min(1, 'Feature cannot be empty') }),
    )
    .min(1, 'At least one feature is required'),
  isActive: z.boolean(),
})

type MembershipInternalFormData = z.infer<typeof membershipSchema>

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
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MembershipInternalFormData>({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      name: '',
      price: '',
      discount: '',
      features: [{ value: '' }],
      isActive: true,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  })

  const handleFormSubmit = (data: MembershipInternalFormData) => {
    onSubmit({
      name: data.name,
      price: data.price,
      discount: data.discount || '',
      features: data.features.map((f) => f.value),
      isActive: data.isActive,
    })
    reset()
    onOpenChange(false)
  }

  const handleCancel = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl max-h-[85vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle>Add Membership Package</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className='overflow-y-auto flex-1 px-1'
        >
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='package-name'>Package Name *</Label>
                <Input
                  id='package-name'
                  placeholder='e.g., Premium, VIP'
                  {...register('name')}
                />
                {errors.name && (
                  <p className='text-xs text-destructive'>
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='package-price'>Price (đ/month) *</Label>
                <Input
                  id='package-price'
                  type='number'
                  placeholder='e.g., 99000'
                  {...register('price')}
                />
                {errors.price && (
                  <p className='text-xs text-destructive'>
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='package-discount'>Discount (%)</Label>
              <Input
                id='package-discount'
                type='number'
                placeholder='e.g., 10'
                {...register('discount')}
              />
              {errors.discount && (
                <p className='text-xs text-destructive'>
                  {errors.discount.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label>Features *</Label>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => append({ value: '' })}
                >
                  <Plus className='h-4 w-4 mr-1' />
                  Add Feature
                </Button>
              </div>
              <div className='space-y-2'>
                {fields.map((field, index) => (
                  <div key={field.id} className='flex gap-2'>
                    <div className='flex-1'>
                      <Input
                        placeholder='e.g., Post 10 listings/month'
                        {...register(`features.${index}.value`)}
                      />
                      {errors.features?.[index]?.value && (
                        <p className='text-xs text-destructive mt-1'>
                          {errors.features[index]?.value?.message}
                        </p>
                      )}
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={() => remove(index)}
                      >
                        <Minus className='h-4 w-4' />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.features?.root && (
                <p className='text-xs text-destructive'>
                  {errors.features.root.message}
                </p>
              )}
            </div>

            <Controller
              name='isActive'
              control={control}
              render={({ field }) => (
                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='package-active'
                    checked={field.value}
                    onChange={field.onChange}
                    className='h-4 w-4 rounded border-border text-primary focus:ring-primary'
                  />
                  <Label htmlFor='package-active'>Active</Label>
                </div>
              )}
            />
          </div>

          <DialogFooter className='mt-4'>
            <Button type='button' variant='outline' onClick={handleCancel}>
              Cancel
            </Button>
            <Button type='submit'>Create Package</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
