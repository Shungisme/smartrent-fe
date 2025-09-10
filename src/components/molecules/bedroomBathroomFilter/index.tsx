import React from 'react'
import { useTranslations } from 'next-intl'
import { Typography } from '@/components/atoms/typography'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'

interface BedroomBathroomFilterProps {
  bedrooms?: number
  bathrooms?: number
  onBedroomsChange: (bedrooms: number | undefined) => void
  onBathroomsChange: (bathrooms: number | undefined) => void
  className?: string
}

const BedroomBathroomFilter: React.FC<BedroomBathroomFilterProps> = ({
  bedrooms,
  bathrooms,
  onBedroomsChange,
  onBathroomsChange,
  className = '',
}) => {
  const t = useTranslations('homePage.filters')

  const bedroomOptions = [
    { value: 'any', label: t('bedrooms.any') },
    { value: '0', label: t('bedrooms.studio') },
    { value: '1', label: t('bedrooms.one') },
    { value: '2', label: t('bedrooms.two') },
    { value: '3', label: t('bedrooms.three') },
    { value: '4', label: t('bedrooms.four') },
    { value: '5', label: t('bedrooms.five') },
  ]

  const bathroomOptions = [
    { value: 'any', label: t('bathrooms.any') },
    { value: '1', label: t('bathrooms.one') },
    { value: '2', label: t('bathrooms.two') },
    { value: '3', label: t('bathrooms.three') },
    { value: '4', label: t('bathrooms.four') },
    { value: '5', label: t('bathrooms.five') },
  ]

  const handleBedroomsChange = (value: string) => {
    onBedroomsChange(value === 'any' ? undefined : parseInt(value))
  }

  const handleBathroomsChange = (value: string) => {
    onBathroomsChange(value === 'any' ? undefined : parseInt(value))
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className='space-y-2'>
        <Typography variant='h6' className='text-sm font-medium'>
          {t('bedrooms.title')}
        </Typography>
        <Select
          value={bedrooms?.toString() || 'any'}
          onValueChange={handleBedroomsChange}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={t('bedrooms.any')} />
          </SelectTrigger>
          <SelectContent>
            {bedroomOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Typography variant='h6' className='text-sm font-medium'>
          {t('bathrooms.title')}
        </Typography>
        <Select
          value={bathrooms?.toString() || 'any'}
          onValueChange={handleBathroomsChange}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder={t('bathrooms.any')} />
          </SelectTrigger>
          <SelectContent>
            {bathroomOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default BedroomBathroomFilter
