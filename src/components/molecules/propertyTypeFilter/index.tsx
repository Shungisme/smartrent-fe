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

interface PropertyTypeFilterProps {
  value?: string
  onChange: (value: string) => void
  className?: string
}

const PropertyTypeFilter: React.FC<PropertyTypeFilterProps> = ({
  value = 'any',
  onChange,
  className = '',
}) => {
  const t = useTranslations('homePage.filters.propertyType')

  const propertyTypes = [
    { value: 'any', label: t('all') },
    { value: 'apartment', label: t('apartment') },
    { value: 'studio', label: t('studio') },
    { value: 'villa', label: t('villa') },
    { value: 'house', label: t('house') },
    { value: 'condo', label: t('condo') },
    { value: 'townhouse', label: t('townhouse') },
    { value: 'penthouse', label: t('penthouse') },
  ]

  return (
    <div className={`space-y-2 ${className}`}>
      <Typography variant='h6' className='text-sm font-medium'>
        {t('title')}
      </Typography>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={t('all')} />
        </SelectTrigger>
        <SelectContent>
          {propertyTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default PropertyTypeFilter
