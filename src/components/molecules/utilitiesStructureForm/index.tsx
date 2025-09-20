import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'

import {
  DollarSign,
  Compass,
  Ruler,
  Calendar,
  Droplets,
  Zap,
  Wifi,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import SelectDropdown from '@/components/atoms/select-dropdown'
import {
  utilityOptions,
  directionOptions,
} from '@/components/atoms/select-dropdown/options'
import { useCreatePost } from '@/contexts/createPost'

interface UtilitiesStructureFormProps {
  className?: string
}

const UtilitiesStructureForm: React.FC<UtilitiesStructureFormProps> = ({
  className,
}) => {
  const t = useTranslations('createPost.sections.utilitiesStructure')
  const { propertyInfo, updatePropertyInfo } = useCreatePost()

  return (
    <div className={className}>
      {/* Move-in Date Card */}
      <Card className='mb-4'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            <Calendar className='w-5 h-5 text-blue-500' />
            {t('moveInDate')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='relative'>
            <input
              type='text'
              className='w-full h-12 px-4 pr-10 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-ring'
              placeholder='dd/mm/yyyy'
              defaultValue='02 / 01 / 2024'
            />
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
              <Calendar className='w-4 h-4 text-muted-foreground' />
            </div>
          </div>
          <p className='text-xs text-muted-foreground mt-1'>
            {t('dateFormat')}
          </p>
        </CardContent>
      </Card>

      {/* Main Layout: Dropdowns on Left, Dimensions on Right */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        {/* Left Column - All Dropdowns */}
        <div className='space-y-4'>
          {/* Monthly Utilities Card */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <DollarSign className='w-5 h-5 text-green-500' />
                {t('monthlyUtilities')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Water Price */}
              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-medium'>
                  <Droplets className='w-4 h-4 text-blue-500' />
                  {t('waterPrice')}
                </label>
                <SelectDropdown
                  value={propertyInfo.waterPrice}
                  onValueChange={(value) =>
                    updatePropertyInfo({ waterPrice: value as any })
                  }
                  options={utilityOptions}
                  label={t('waterPrice')}
                  icon={<Droplets className='w-4 h-4' />}
                  iconPosition='left'
                  size='md'
                  variant='default'
                  className='w-full'
                />
              </div>

              {/* Electricity Price */}
              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-medium'>
                  <Zap className='w-4 h-4 text-yellow-500' />
                  {t('electricityPrice')}
                </label>
                <SelectDropdown
                  value={propertyInfo.electricityPrice}
                  onValueChange={(value) =>
                    updatePropertyInfo({ electricityPrice: value as any })
                  }
                  options={utilityOptions}
                  label={t('electricityPrice')}
                  icon={<Zap className='w-4 h-4' />}
                  iconPosition='left'
                  size='md'
                  variant='default'
                  className='w-full'
                />
              </div>

              {/* Internet Price */}
              <div className='space-y-2'>
                <label className='flex items-center gap-2 text-sm font-medium'>
                  <Wifi className='w-4 h-4 text-purple-500' />
                  {t('internetPrice')}
                </label>
                <SelectDropdown
                  value={propertyInfo.internetPrice}
                  onValueChange={(value) =>
                    updatePropertyInfo({ internetPrice: value as any })
                  }
                  options={utilityOptions}
                  label={t('internetPrice')}
                  icon={<Wifi className='w-4 h-4' />}
                  iconPosition='left'
                  size='md'
                  variant='default'
                  className='w-full'
                />
              </div>
            </CardContent>
          </Card>

          {/* Structure Direction Card */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Compass className='w-5 h-5 text-orange-500' />
                {t('structureDirection')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* House Direction */}
              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  {t('houseDirection')}
                </label>
                <SelectDropdown
                  value={propertyInfo.houseDirection}
                  onValueChange={(value) =>
                    updatePropertyInfo({ houseDirection: value as any })
                  }
                  options={directionOptions}
                  label={t('houseDirection')}
                  icon={<Compass className='w-4 h-4' />}
                  iconPosition='left'
                  size='md'
                  variant='default'
                  className='w-full'
                />
              </div>

              {/* Balcony Direction */}
              <div className='space-y-2'>
                <label className='text-sm font-medium'>
                  {t('balconyDirection')}
                </label>
                <SelectDropdown
                  value={propertyInfo.balconyDirection}
                  onValueChange={(value) =>
                    updatePropertyInfo({ balconyDirection: value as any })
                  }
                  options={directionOptions}
                  label={t('balconyDirection')}
                  icon={<Compass className='w-4 h-4' />}
                  iconPosition='left'
                  size='md'
                  variant='default'
                  className='w-full'
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Property Dimensions */}
        <div>
          {/* Property Dimensions Card */}
          <Card>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <Ruler className='w-5 h-5 text-indigo-500' />
                {t('propertyDimensions')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {/* Alley Width */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  {t('alleyWidth')}
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={propertyInfo.alleyWidth}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      updatePropertyInfo({ alleyWidth: value })
                    }}
                    placeholder='0'
                    className='w-full h-12 px-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base'
                  />
                  <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'>
                    m
                  </span>
                </div>
              </div>

              {/* Frontage Width */}
              <div className='space-y-2'>
                <label className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
                  {t('frontageWidth')}
                </label>
                <div className='relative'>
                  <input
                    type='text'
                    value={propertyInfo.frontageWidth}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0
                      updatePropertyInfo({ frontageWidth: value })
                    }}
                    placeholder='0'
                    className='w-full h-12 px-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-base'
                  />
                  <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400'>
                    m
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export { UtilitiesStructureForm }
export type { UtilitiesStructureFormProps }
