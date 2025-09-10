import React, { useState, useMemo } from 'react'
import PropertyCard from '@/components/molecules/propertyCard'
import {
  PropertyCard as PropertyCardType,
  PropertyFilters,
} from '@/api/types/property.type'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import { Skeleton } from '@/components/atoms/skeleton'
import FilterDrawer from '@/components/molecules/filterDrawer'
import SearchInput from '@/components/molecules/searchInput'
import {
  PropertyTypeDropdown,
  PriceRangeDropdown,
  BedroomBathroomDropdown,
  AmenitiesDropdown,
} from '@/components/molecules/filterDropdown'
import { Heart, Filter, X, RotateCcw } from 'lucide-react'

interface PropertyListProps {
  properties: PropertyCardType[]
  loading?: boolean
  onPropertyClick?: (property: PropertyCardType) => void
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  loading = false,
  onPropertyClick,
}) => {
  const t = useTranslations()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState<PropertyFilters>({})
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const handleFavorite = (property: PropertyCardType, isFavorite: boolean) => {
    const newFavorites = new Set(favorites)
    if (isFavorite) {
      newFavorites.add(property.id)
    } else {
      newFavorites.delete(property.id)
    }
    setFavorites(newFavorites)
  }

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handlePropertyTypeChange = (propertyType: string) => {
    const newFilters = {
      ...filters,
      propertyType: propertyType === 'any' ? undefined : propertyType,
    }
    setFilters(newFilters)
  }

  const handlePriceRangeChange = (
    minPrice: number | undefined,
    maxPrice: number | undefined,
  ) => {
    const newFilters = {
      ...filters,
      minPrice,
      maxPrice,
    }
    setFilters(newFilters)
  }

  const handleBedroomsChange = (bedrooms: number | undefined) => {
    const newFilters = {
      ...filters,
      bedrooms,
    }
    setFilters(newFilters)
  }

  const handleBathroomsChange = (bathrooms: number | undefined) => {
    const newFilters = {
      ...filters,
      bathrooms,
    }
    setFilters(newFilters)
  }

  const handleAmenitiesChange = (amenities: string[]) => {
    const newFilters = {
      ...filters,
      amenities: amenities.length > 0 ? amenities : undefined,
    }
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch =
          property.title.toLowerCase().includes(searchLower) ||
          property.description.toLowerCase().includes(searchLower) ||
          property.address.toLowerCase().includes(searchLower) ||
          property.city.toLowerCase().includes(searchLower) ||
          property.property_type.toLowerCase().includes(searchLower)

        if (!matchesSearch) {
          return false
        }
      }

      // Property type filter
      if (
        filters.propertyType &&
        property.property_type !== filters.propertyType
      ) {
        return false
      }

      // Price range filter
      if (filters.minPrice && property.price < filters.minPrice) {
        return false
      }
      if (filters.maxPrice && property.price > filters.maxPrice) {
        return false
      }

      // Bedrooms filter
      if (
        filters.bedrooms !== undefined &&
        property.bedrooms < filters.bedrooms
      ) {
        return false
      }

      // Bathrooms filter
      if (
        filters.bathrooms !== undefined &&
        property.bathrooms < filters.bathrooms
      ) {
        return false
      }

      // Amenities filter
      if (filters.amenities && filters.amenities.length > 0) {
        const propertyAmenities = property.amenities || []
        const hasAllAmenities = filters.amenities.every((amenity) =>
          propertyAmenities.some((propAmenity) =>
            propAmenity.toLowerCase().includes(amenity.toLowerCase()),
          ),
        )
        if (!hasAllAmenities) {
          return false
        }
      }

      return true
    })
  }, [properties, filters, searchQuery])

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined && (Array.isArray(value) ? value.length > 0 : true),
  )

  const hasActiveSearch = searchQuery.length > 0

  if (loading) {
    return (
      <div className='w-full'>
        <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6'>
          <Skeleton className='h-5 w-32 sm:h-6 sm:w-48' />
          <Skeleton className='h-8 w-20 sm:w-24' />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className='w-full space-y-2 sm:space-y-3'>
              <Skeleton className='aspect-[4/3] rounded-lg w-full' />
              <div className='p-3 sm:p-4 space-y-2 sm:space-y-3'>
                <Skeleton className='h-3 w-3/4 sm:h-4' />
                <Skeleton className='h-2.5 w-1/2 sm:h-3' />
                <Skeleton className='h-4 w-1/3 sm:h-6' />
                <div className='flex gap-1.5 sm:gap-2'>
                  <Skeleton className='h-4 w-16 sm:h-6 sm:w-20' />
                  <Skeleton className='h-4 w-16 sm:h-6 sm:w-20' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderPropertyList = () => {
    if (filteredProperties.length === 0) {
      return (
        <div className='w-full md:h-[30rem]'>
          <FilterDrawer
            isOpen={showMobileFilters}
            onClose={() => setShowMobileFilters(false)}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
          />

          {/* No results with filter reset option */}
          <div className='text-center py-8 sm:py-12 lg:py-16'>
            <div className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 bg-muted rounded-full flex items-center justify-center'>
              <Heart className='w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-muted-foreground' />
            </div>
            <Typography
              variant='large'
              className='text-muted-foreground mb-2 text-base sm:text-lg'
            >
              {t('homePage.property.noProperties')}
            </Typography>
            <Typography
              variant='muted'
              className='max-w-md mx-auto text-sm sm:text-base mb-6'
            >
              {t('homePage.property.noPropertiesDescription')}
            </Typography>
            {(hasActiveFilters || hasActiveSearch) && (
              <div className='md:hidden flex flex-col sm:flex-row gap-3 justify-center items-center'>
                <Button
                  variant='outline'
                  onClick={handleClearFilters}
                  className='flex items-center gap-2'
                >
                  <RotateCcw className='h-4 w-4' />
                  {t('homePage.buttons.clearAll')}
                </Button>
              </div>
            )}
          </div>
        </div>
      )
    }

    return (
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={onPropertyClick}
            onFavorite={handleFavorite}
          />
        ))}
      </div>
    )
  }

  return (
    <div className='w-full'>
      {/* Header with search and filters */}
      <div className='flex flex-col gap-4 mb-6'>
        {/* Filter Controls */}
        <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4'>
          <Typography
            variant='h2'
            className='text-lg sm:text-xl lg:text-2xl font-bold'
          >
            {t('homePage.property.listings')} ({filteredProperties.length})
          </Typography>
          <div>
            {/* Search Input */}
            <div className='md:hidden w-full'>
              <SearchInput
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t('homePage.buttons.searchPlaceholder')}
                className='w-full'
              />
            </div>
            <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
              {favorites.size > 0 && (
                <div className='flex items-center gap-2'>
                  <Heart className='w-3 h-3 sm:w-4 sm:h-4 text-destructive fill-current' />
                  <Typography
                    variant='small'
                    className='text-muted-foreground text-xs sm:text-sm'
                  >
                    {favorites.size} {t('homePage.property.favorites')}
                  </Typography>
                </div>
              )}
            </div>
          </div>

          <Button
            variant='outline'
            size='sm'
            onClick={() => setShowMobileFilters(true)}
            className='flex items-center gap-2 sm:hidden'
          >
            <Filter className='w-3 h-3 sm:w-4 sm:h-4' />
            {t('homePage.buttons.filter')}
          </Button>
        </div>
      </div>

      {/* Desktop Filter Dropdowns */}
      <div className='hidden md:block rounded-lg bg-accent p-8 mb-6 max-w-3xl mx-auto'>
        <div className='hidden sm:flex flex-wrap justify-center items-center gap-3 w-full'>
          <div className='hidden md:block'>
            <SearchInput
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('homePage.buttons.searchPlaceholder')}
            />
          </div>
          <div className='w-full flex items-center justify-center gap-3'>
            <PropertyTypeDropdown
              value={filters.propertyType || 'any'}
              onChange={handlePropertyTypeChange}
            />

            <PriceRangeDropdown
              minPrice={filters.minPrice}
              maxPrice={filters.maxPrice}
              onChange={handlePriceRangeChange}
            />

            <BedroomBathroomDropdown
              bedrooms={filters.bedrooms}
              bathrooms={filters.bathrooms}
              onBedroomsChange={handleBedroomsChange}
              onBathroomsChange={handleBathroomsChange}
            />

            <AmenitiesDropdown
              selectedAmenities={filters.amenities || []}
              onChange={handleAmenitiesChange}
            />
          </div>

          {(hasActiveFilters || hasActiveSearch) && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleClearFilters}
              className='flex items-center gap-2 text-muted-foreground hover:text-foreground'
            >
              <X className='h-4 w-4' />
              {t('homePage.buttons.clearAll')}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <FilterDrawer
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {renderPropertyList()}
    </div>
  )
}

export default PropertyList
