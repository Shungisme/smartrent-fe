import React from 'react'
import { useTranslations } from 'next-intl'
import { Typography } from '@/components/atoms/typography'
import SelectDropdown from '@/components/atoms/select-dropdown'

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
      <SelectDropdown
        value={value}
        onValueChange={onChange}
        placeholder={t('all')}
        options={propertyTypes}
        size='sm'
        variant='default'
      />
    </div>
  )
}

export default PropertyTypeFilter
