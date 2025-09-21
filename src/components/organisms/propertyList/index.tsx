import React, { useState } from 'react'
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
import {
  PropertyTypeDropdown,
  PriceRangeDropdown,
  BedroomBathroomDropdown,
  AmenitiesDropdown,
} from '@/components/molecules/filterDropdown'
import { Heart, Filter, X, RotateCcw } from 'lucide-react'
import { List } from '@/contexts/list'
import { useListContext } from '@/contexts/list/useListContext'
import { propertyFetcher } from '@/api/services/property.service'

interface PropertyListProps {
  onPropertyClick?: (property: PropertyCardType) => void
  initialData?: PropertyCardType[]
  initialFilters?: any
}

const PropertyListContent: React.FC<PropertyListProps> = ({
  onPropertyClick,
}) => {
  const t = useTranslations()
  const { filters, handleUpdateFilter, handleResetFilter, itemsData } =
    useListContext<PropertyCardType>()
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
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

  const handleSearchChange = (query: string) => {
    handleUpdateFilter({ search: query })
  }

  const handlePropertyTypeChange = (propertyType: string) => {
    handleUpdateFilter({
      propertyType: propertyType === 'any' ? undefined : propertyType,
    })
  }

  const handlePriceRangeChange = (
    minPrice: number | undefined,
    maxPrice: number | undefined,
  ) => {
    handleUpdateFilter({ minPrice, maxPrice })
  }

  const handleBedroomsChange = (bedrooms: number | undefined) => {
    handleUpdateFilter({ bedrooms })
  }

  const handleBathroomsChange = (bathrooms: number | undefined) => {
    handleUpdateFilter({ bathrooms })
  }

  const handleAmenitiesChange = (amenities: string[]) => {
    handleUpdateFilter({
      amenities: amenities.length > 0 ? amenities : undefined,
    })
  }

  const handleClearFilters = () => {
    handleResetFilter()
  }

  const handleFiltersChange = (newFilters: PropertyFilters) => {
    // Convert PropertyFilters to ListFilters format
    const listFilters: Partial<typeof filters> = {}

    if (newFilters.propertyType)
      listFilters.propertyType = newFilters.propertyType
    if (newFilters.minPrice !== undefined)
      listFilters.minPrice = newFilters.minPrice
    if (newFilters.maxPrice !== undefined)
      listFilters.maxPrice = newFilters.maxPrice
    if (newFilters.bedrooms !== undefined)
      listFilters.bedrooms = newFilters.bedrooms
    if (newFilters.bathrooms !== undefined)
      listFilters.bathrooms = newFilters.bathrooms
    if (newFilters.amenities) listFilters.amenities = newFilters.amenities
    if (newFilters.city) listFilters.city = newFilters.city

    handleUpdateFilter(listFilters)
  }

  const hasActiveFilters = Object.values(filters).some(
    (value) =>
      value !== undefined &&
      value !== '' &&
      (Array.isArray(value) ? value.length > 0 : true) &&
      !['search', 'perPage', 'page'].includes(
        typeof value === 'string' ? value : '',
      ),
  )

  const hasActiveSearch = filters.search && filters.search.length > 0

  const PropertyItem = (property: PropertyCardType) => (
    <PropertyCard
      key={property.id}
      property={property}
      onClick={onPropertyClick}
      onFavorite={handleFavorite}
    />
  )

  const PropertySkeleton = (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className='w-full space-y-2 md:space-y-3'>
          <Skeleton className='aspect-[4/3] rounded-lg w-full' />
          <div className='p-3 md:p-4 space-y-2 md:space-y-3'>
            <Skeleton className='h-3 w-3/4 md:h-4' />
            <Skeleton className='h-2.5 w-1/2 md:h-3' />
            <Skeleton className='h-4 w-1/3 md:h-6' />
            <div className='flex gap-1.5 md:gap-2'>
              <Skeleton className='h-4 w-16 md:h-6 md:w-20' />
              <Skeleton className='h-4 w-16 md:h-6 md:w-20' />
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const PropertyNotFound = (
    <div className='w-full md:h-[30rem]'>
      <FilterDrawer
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={{
          propertyType: filters.propertyType,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          bedrooms: filters.bedrooms,
          bathrooms: filters.bathrooms,
          amenities: filters.amenities,
          city: filters.city,
        }}
        onFiltersChange={handleFiltersChange}
        searchQuery={filters.search || ''}
        onSearchChange={handleSearchChange}
      />

      {/* No results with filter reset option */}
      <div className='text-center py-8 md:py-12 lg:py-16'>
        <div className='w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 mx-auto mb-4 md:mb-6 bg-muted rounded-full flex items-center justify-center'>
          <Heart className='w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-muted-foreground' />
        </div>
        <Typography
          variant='large'
          className='text-muted-foreground mb-2 text-base md:text-lg'
        >
          {t('homePage.property.noProperties')}
        </Typography>
        <Typography
          variant='muted'
          className='max-w-md mx-auto text-sm md:text-base mb-6'
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

  return (
    <div className='w-full'>
      {/* Header with search and filters */}
      <div className='flex flex-col gap-4 mb-6'>
        {/* Filter Controls */}
        <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-4'>
          <Typography
            variant='h2'
            className='text-lg md:text-xl lg:text-2xl font-bold'
          >
            {t('homePage.property.listings')} ({itemsData.length})
          </Typography>
          <div>
            {/* Search Input */}
            <div className='md:hidden w-full'>
              <List.Search
                placeholder={t('homePage.buttons.searchPlaceholder')}
                className='w-full'
                onSearch={handleSearchChange}
              />
            </div>
            <div className='flex flex-col md:flex-row md:items-center gap-2 md:gap-4'>
              {favorites.size > 0 && (
                <div className='flex items-center gap-2'>
                  <Heart className='w-3 h-3 md:w-4 md:h-4 text-destructive fill-current' />
                  <Typography
                    variant='small'
                    className='text-muted-foreground text-xs md:text-sm'
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
            className='flex items-center gap-2 md:hidden'
          >
            <Filter className='w-3 h-3 md:w-4 md:h-4' />
            {t('homePage.buttons.filter')}
          </Button>
        </div>
      </div>

      {/* Desktop Filter Dropdowns */}
      <div className='hidden md:block rounded-lg bg-accent p-8 mb-6 max-w-3xl mx-auto'>
        <div className='hidden md:flex flex-wrap justify-center items-center gap-3 w-full'>
          <div className='hidden md:block'>
            <List.Search
              placeholder={t('homePage.buttons.searchPlaceholder')}
              onSearch={handleSearchChange}
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
        filters={{
          propertyType: filters.propertyType,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          bedrooms: filters.bedrooms,
          bathrooms: filters.bathrooms,
          amenities: filters.amenities,
          city: filters.city,
        }}
        onFiltersChange={handleFiltersChange}
        searchQuery={filters.search || ''}
        onSearchChange={handleSearchChange}
      />

      {/* Property List Content */}
      <List.Content
        Item={PropertyItem}
        skeleton={PropertySkeleton}
        notFound={PropertyNotFound}
      />

      {/* Pagination */}
      <div className='mt-8'>
        <List.Pagination
          showPerPageSelector={true}
          showPageInfo={true}
          showPageNumbers={true}
          maxVisiblePages={5}
        />
      </div>
    </div>
  )
}

const PropertyList: React.FC<PropertyListProps> = ({
  initialData,
  initialFilters,
  ...props
}) => {
  return (
    <List.Provider
      fetcher={propertyFetcher}
      initialData={initialData}
      initialFilters={initialFilters}
    >
      <PropertyListContent {...props} />
    </List.Provider>
  )
}

export default PropertyList
