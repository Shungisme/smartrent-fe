import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'
import { Home, Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface PropertyDetailsFormProps {
  className?: string
}

const PropertyDetailsForm: React.FC<PropertyDetailsFormProps> = ({
  className,
}) => {
  const t = useTranslations('createPost.sections.propertyDetails')

  return (
    <div className={className}>
      {/* Property Details Card - Mobile First */}
      <Card className='mb-4 sm:mb-6'>
        <CardHeader className='pb-4 sm:pb-6'>
          <CardTitle className='flex items-center gap-2 text-base sm:text-lg'>
            <Home className='w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground' />
            {t('title')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4 sm:space-y-6'>
          {/* Property Type - Mobile First */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>{t('propertyType')}</label>
            <Select>
              <SelectTrigger className='h-10 sm:h-12'>
                <SelectValue placeholder='Chọn loại bất động sản' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='apartment'>
                  {t('propertyTypes.apartment')}
                </SelectItem>
                <SelectItem value='house'>
                  {t('propertyTypes.house')}
                </SelectItem>
                <SelectItem value='villa'>
                  {t('propertyTypes.villa')}
                </SelectItem>
                <SelectItem value='studio'>
                  {t('propertyTypes.studio')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Area and Price Row - Mobile First */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>{t('area')}</label>
              <input
                type='number'
                className='w-full h-10 sm:h-12 px-4 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring text-sm sm:text-base'
                placeholder='Nhập diện tích'
                defaultValue='85'
              />
            </div>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>{t('price')}</label>
              <input
                type='number'
                className='w-full h-10 sm:h-12 px-4 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring text-sm sm:text-base'
                placeholder='Nhập giá'
                defaultValue='15000000'
              />
            </div>
          </div>

          {/* Interior Condition - Mobile First */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>
              {t('interiorCondition')}
            </label>
            <Select>
              <SelectTrigger className='h-10 sm:h-12'>
                <SelectValue placeholder='Chọn tình trạng nội thất' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='furnished'>
                  {t('interiorConditions.furnished')}
                </SelectItem>
                <SelectItem value='semi-furnished'>
                  {t('interiorConditions.semiFurnished')}
                </SelectItem>
                <SelectItem value='unfurnished'>
                  {t('interiorConditions.unfurnished')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rooms Section - Mobile First */}
          <div className='space-y-3 sm:space-y-4'>
            <h3 className='text-sm font-medium'>{t('rooms')}</h3>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {/* Bedrooms - Mobile First */}
              <div className='space-y-2'>
                <label className='text-sm font-medium'>{t('bedrooms')}</label>
                <div className='flex items-center border border-input rounded-md bg-background'>
                  <button className='p-2 hover:bg-muted'>
                    <Minus className='w-3 h-3 sm:w-4 sm:h-4' />
                  </button>
                  <input
                    type='number'
                    className='flex-1 h-8 sm:h-10 text-center border-0 focus:ring-0 bg-transparent text-sm sm:text-base'
                    defaultValue='2'
                    min='0'
                  />
                  <button className='p-2 hover:bg-muted'>
                    <Plus className='w-3 h-3 sm:w-4 sm:h-4' />
                  </button>
                </div>
              </div>

              {/* Bathrooms - Mobile First */}
              <div className='space-y-2'>
                <label className='text-sm font-medium'>{t('bathrooms')}</label>
                <div className='flex items-center border border-input rounded-md bg-background'>
                  <button className='p-2 hover:bg-muted'>
                    <Minus className='w-3 h-3 sm:w-4 sm:h-4' />
                  </button>
                  <input
                    type='number'
                    className='flex-1 h-8 sm:h-10 text-center border-0 focus:ring-0 bg-transparent text-sm sm:text-base'
                    defaultValue='2'
                    min='0'
                  />
                  <button className='p-2 hover:bg-muted'>
                    <Plus className='w-3 h-3 sm:w-4 sm:h-4' />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Floors - Mobile First */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>{t('floors')}</label>
            <div className='flex items-center border border-input rounded-md bg-background w-full sm:w-32'>
              <button className='p-2 hover:bg-muted'>
                <Minus className='w-3 h-3 sm:w-4 sm:h-4' />
              </button>
              <input
                type='number'
                className='flex-1 h-8 sm:h-10 text-center border-0 focus:ring-0 bg-transparent text-sm sm:text-base'
                defaultValue='1'
                min='0'
              />
              <button className='p-2 hover:bg-muted'>
                <Plus className='w-3 h-3 sm:w-4 sm:h-4' />
              </button>
            </div>
          </div>

          {/* Move-in Date - Mobile First */}
          <div className='space-y-2'>
            <label className='text-sm font-medium'>{t('moveInDate')}</label>
            <div className='relative'>
              <input
                type='text'
                className='w-full h-10 sm:h-12 px-4 pr-10 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring text-sm sm:text-base'
                placeholder='dd/mm/yyyy'
                defaultValue='02/01/2024'
              />
              <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
                <svg
                  className='w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                  />
                </svg>
              </div>
            </div>
            <p className='text-xs text-muted-foreground'>{t('dateFormat')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export { PropertyDetailsForm }
export type { PropertyDetailsFormProps }
