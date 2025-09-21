import React from 'react'
import { useTranslations } from 'next-intl'
import { Typography } from '@/components/atoms/typography'
import { Checkbox } from '@/components/atoms/checkbox'
import { Label } from '@/components/atoms/label'

interface AmenitiesFilterProps {
  selectedAmenities: string[]
  onChange: (amenities: string[]) => void
  className?: string
}

const AmenitiesFilter: React.FC<AmenitiesFilterProps> = ({
  selectedAmenities = [],
  onChange,
  className = '',
}) => {
  const t = useTranslations('homePage.filters.amenities')

  const amenities = [
    { key: 'airConditioning', label: t('airConditioning') },
    { key: 'wifi', label: t('wifi') },
    { key: 'parking', label: t('parking') },
    { key: 'gym', label: t('gym') },
    { key: 'swimmingPool', label: t('swimmingPool') },
    { key: 'security', label: t('security') },
    { key: 'garden', label: t('garden') },
    { key: 'balcony', label: t('balcony') },
    { key: 'elevator', label: t('elevator') },
    { key: 'furnished', label: t('furnished') },
    { key: 'petFriendly', label: t('petFriendly') },
  ]

  const handleAmenityChange = (amenityKey: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedAmenities, amenityKey])
    } else {
      onChange(selectedAmenities.filter((amenity) => amenity !== amenityKey))
    }
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Typography variant='h6' className='text-sm font-medium'>
        {t('title')}
      </Typography>

      <div className='grid grid-cols-1 gap-3 max-h-48 overflow-y-auto'>
        {amenities.map((amenity) => (
          <div key={amenity.key} className='flex items-center space-x-2'>
            <Checkbox
              id={amenity.key}
              checked={selectedAmenities.includes(amenity.key)}
              onCheckedChange={(checked) =>
                handleAmenityChange(amenity.key, checked as boolean)
              }
            />
            <Label
              htmlFor={amenity.key}
              className='text-sm font-normal cursor-pointer flex-1'
            >
              {amenity.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AmenitiesFilter
