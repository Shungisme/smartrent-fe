import React, { useState } from 'react'
import PropertyCard from '@/components/molecules/propertyCard'
import { PropertyCard as PropertyCardType } from '@/api/types/property.type'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { Typography } from '@/components/atoms/typography'
import { Skeleton } from '@/components/atoms/skeleton'
import { Heart, Filter } from 'lucide-react'

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

  const handleFavorite = (property: PropertyCardType, isFavorite: boolean) => {
    const newFavorites = new Set(favorites)
    if (isFavorite) {
      newFavorites.add(property.id)
    } else {
      newFavorites.delete(property.id)
    }
    setFavorites(newFavorites)
  }

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

  if (properties.length === 0) {
    return (
      <div className='w-full text-center py-8 sm:py-12 lg:py-16'>
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
          className='max-w-md mx-auto text-sm sm:text-base'
        >
          {t('homePage.property.noPropertiesDescription')}
        </Typography>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center sm:gap-4 mb-4 sm:mb-6'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4'>
          <Typography
            variant='h2'
            className='text-lg sm:text-xl lg:text-2xl font-bold'
          >
            {t('homePage.property.listings')} ({properties.length})
          </Typography>
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

        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start text-xs sm:text-sm'
        >
          <Filter className='w-3 h-3 sm:w-4 sm:h-4' />
          {t('homePage.buttons.filter')}
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'>
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={onPropertyClick}
            onFavorite={handleFavorite}
          />
        ))}
      </div>
    </div>
  )
}

export default PropertyList
