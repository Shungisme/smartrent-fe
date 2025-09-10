import React from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import { Checkbox } from '@/components/atoms/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/atoms/dropdown-menu'
import { ChevronDown, Settings } from 'lucide-react'

interface AmenitiesDropdownProps {
  selectedAmenities: string[]
  onChange: (amenities: string[]) => void
  className?: string
}

const AmenitiesDropdown: React.FC<AmenitiesDropdownProps> = ({
  selectedAmenities = [],
  onChange,
  className = '',
}) => {
  const t = useTranslations('homePage.filters.amenities')
  const tFilters = useTranslations('homePage.filters')

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

  const getDisplayText = () => {
    if (selectedAmenities.length === 0) return tFilters('anyAmenities')
    if (selectedAmenities.length === 1) return tFilters('oneAmenity')
    return `${selectedAmenities.length} ${tFilters('amenitiesCount')}`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className={`flex items-center gap-2 h-9 px-3 ${className}`}
        >
          <Settings className='h-4 w-4' />
          <Typography variant='small' className='text-sm'>
            {getDisplayText()}
          </Typography>
          <ChevronDown className='h-3 w-3 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-80'>
        <DropdownMenuLabel className='text-xs font-medium text-muted-foreground'>
          {t('title')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className='p-3 max-h-64 overflow-y-auto'>
          <div className='grid grid-cols-1 gap-2'>
            {amenities.map((amenity) => (
              <div key={amenity.key} className='flex items-center space-x-2'>
                <Checkbox
                  id={amenity.key}
                  checked={selectedAmenities.includes(amenity.key)}
                  onCheckedChange={(checked) =>
                    handleAmenityChange(amenity.key, checked as boolean)
                  }
                />
                <label
                  htmlFor={amenity.key}
                  className='text-sm font-normal cursor-pointer flex-1'
                >
                  {amenity.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AmenitiesDropdown
