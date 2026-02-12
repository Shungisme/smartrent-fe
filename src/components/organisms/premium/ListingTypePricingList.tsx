import React from 'react'
import { Pencil } from 'lucide-react'
import { Badge } from '@/components/atoms/badge'
import { Button } from '@/components/atoms/button'
import { Card } from '@/components/atoms/card'
import { useTranslations } from 'next-intl'
import { ListingTypePricing } from '@/types/premium.type'
import { cn } from '@/lib/utils'

interface ListingTypePricingListProps {
  listingTypes: ListingTypePricing[]
  loading: boolean
  onEdit: (tier: ListingTypePricing) => void
}

export const ListingTypePricingList: React.FC<ListingTypePricingListProps> = ({
  listingTypes,
  loading,
  onEdit,
}) => {
  const t = useTranslations('premium')

  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
          <p className='mt-4 text-sm text-gray-600'>Loading VIP tiers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      {listingTypes.map((listingType) => (
        <Card key={listingType.tier} className='p-6'>
          <div className='flex items-start justify-between mb-4'>
            <div>
              <Badge className={cn('text-sm font-medium', listingType.color)}>
                {t(`listingTypes.tiers.${listingType.tier}`)}
              </Badge>
            </div>
            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='checkbox'
                className='sr-only peer'
                checked={listingType.isActive}
                readOnly
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Day Pricing */}
          <div className='mb-4'>
            <h4 className='text-sm font-semibold text-gray-700 mb-3'>
              {t('listingTypes.dayPricing')}
            </h4>
            <div className='grid grid-cols-2 gap-3'>
              {listingType.dayPricing.map((pricing) => (
                <div
                  key={pricing.days}
                  className='rounded-lg border border-gray-200 p-3'
                >
                  <div className='text-xs text-gray-500'>
                    {pricing.days} {t('listingTypes.days')}
                  </div>
                  <div className='font-semibold text-gray-900'>
                    {pricing.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Click Pricing */}
          <div className='mb-4'>
            <h4 className='text-sm font-semibold text-gray-700 mb-3'>
              {t('listingTypes.clickPricing')}
            </h4>
            <div className='rounded-lg border border-gray-200 p-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  {t('listingTypes.basePrice')}
                </span>
                <span className='font-semibold text-gray-900'>
                  {listingType.clickPricing.basePrice}/
                  {t('listingTypes.perClick')}
                </span>
              </div>
              <div className='mt-2 flex items-center justify-between'>
                <span className='text-sm text-gray-600'>
                  {t('listingTypes.minClicks')} - {t('listingTypes.maxClicks')}
                </span>
                <span className='text-sm text-gray-700'>
                  {listingType.clickPricing.minClicks} -{' '}
                  {listingType.clickPricing.maxClicks.toLocaleString()}{' '}
                  {t('listingTypes.clicks')}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant='outline'
            className='w-full'
            onClick={() => onEdit(listingType)}
          >
            <Pencil className='h-4 w-4 mr-2' />
            {t('listingTypes.editPricing')}
          </Button>
        </Card>
      ))}
    </div>
  )
}
