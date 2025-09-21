import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Card } from '@/components/atoms/card'
import { Separator } from '@/components/atoms/separator'
import PropertyTypeFilter from '@/components/molecules/propertyTypeFilter'
import PriceRangeFilter from '@/components/molecules/priceRangeFilter'
import AmenitiesFilter from '@/components/molecules/amenitiesFilter'
import BedroomBathroomFilter from '@/components/molecules/bedroomBathroomFilter'
import { PropertyFilters } from '@/api/types/property.type'

interface PropertyFilterProps {
  filters: PropertyFilters
  onFiltersChange: (filters: PropertyFilters) => void
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onClose?: () => void
  isOpen?: boolean
  className?: string
}

const PropertyFilter: React.FC<PropertyFilterProps> = ({
  filters,
  onFiltersChange,
  searchQuery = '',
  onSearchChange,
  isOpen = true,
  className = '',
  onClose,
}) => {
  const tButtons = useTranslations('homePage.buttons')

  const [localFilters, setLocalFilters] = useState<PropertyFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handlePropertyTypeChange = (propertyType: string) => {
    const newFilters = {
      ...localFilters,
      propertyType: propertyType === 'any' ? undefined : propertyType,
    }
    setLocalFilters(newFilters)
  }

  const handlePriceRangeChange = (
    minPrice: number | undefined,
    maxPrice: number | undefined,
  ) => {
    const newFilters = {
      ...localFilters,
      minPrice,
      maxPrice,
    }
    setLocalFilters(newFilters)
  }

  const handleAmenitiesChange = (amenities: string[]) => {
    const newFilters = {
      ...localFilters,
      amenities: amenities.length > 0 ? amenities : undefined,
    }
    setLocalFilters(newFilters)
  }

  const handleBedroomsChange = (bedrooms: number | undefined) => {
    const newFilters = {
      ...localFilters,
      bedrooms,
    }
    setLocalFilters(newFilters)
  }

  const handleBathroomsChange = (bathrooms: number | undefined) => {
    const newFilters = {
      ...localFilters,
      bathrooms,
    }
    setLocalFilters(newFilters)
  }

  const handleApplyFilters = () => {
    onFiltersChange(localFilters)
    onClose?.()
  }

  const handleClearFilters = () => {
    const clearedFilters: PropertyFilters = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
    if (onSearchChange) {
      onSearchChange('')
    }
    onClose?.()
  }

  const hasActiveFilters = Object.values(localFilters).some(
    (value) =>
      value !== undefined && (Array.isArray(value) ? value.length > 0 : true),
  )

  if (!isOpen) return null

  return (
    <Card className={`p-4 ${className}`}>
      <div className='space-y-6'>
        <Separator className='hidden md:block' />

        {/* Filter Sections */}
        <div className='space-y-6'>
          {/* Property Type */}
          <PropertyTypeFilter
            value={localFilters.propertyType || 'any'}
            onChange={handlePropertyTypeChange}
          />

          <Separator />

          {/* Price Range */}
          <PriceRangeFilter
            minPrice={localFilters.minPrice}
            maxPrice={localFilters.maxPrice}
            onChange={handlePriceRangeChange}
          />

          <Separator />

          {/* Bedrooms & Bathrooms */}
          <BedroomBathroomFilter
            bedrooms={localFilters.bedrooms}
            bathrooms={localFilters.bathrooms}
            onBedroomsChange={handleBedroomsChange}
            onBathroomsChange={handleBathroomsChange}
          />

          <Separator />

          {/* Amenities */}
          <AmenitiesFilter
            selectedAmenities={localFilters.amenities || []}
            onChange={handleAmenitiesChange}
          />
        </div>

        {/* Action Buttons */}
        <div className='flex flex-col sm:flex-row gap-3 pt-4'>
          <Button
            variant='outline'
            onClick={handleClearFilters}
            className='flex-1 sm:flex-none'
            disabled={!hasActiveFilters && !searchQuery}
          >
            {tButtons('clearFilters')}
          </Button>
          <Button onClick={handleApplyFilters} className='flex-1 sm:flex-none'>
            {tButtons('applyFilters')}
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default PropertyFilter
