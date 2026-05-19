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
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary'></div>
          <p className='mt-4 text-sm text-muted-foreground'>
            Loading VIP tiers...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      {listingTypes.map((listingType) => (
        <Card key={listingType.tier} className='gap-5 p-6'>
          <div className='flex items-start justify-between'>
            <Badge className={cn('text-sm font-medium', listingType.color)}>
              {listingType.name || t(`listingTypes.tiers.${listingType.tier}`)}
            </Badge>
            <label className='relative inline-flex cursor-pointer items-center'>
              <input
                type='checkbox'
                className='peer sr-only'
                checked={listingType.isActive}
                readOnly
              />
              <div className="peer h-6 w-11 rounded-full bg-muted after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-border after:bg-card after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-primary-foreground peer-focus:ring-4 peer-focus:ring-ring"></div>
            </label>
          </div>

          {/* Day Pricing */}
          <div className='flex flex-col gap-2'>
            <h4 className='mb-2 text-sm font-semibold text-foreground'>
              {t('listingTypes.dayPricing')}
            </h4>
            <div className='grid grid-cols-2 gap-3'>
              {listingType.dayPricing.map((pricing) => (
                <div
                  key={pricing.days}
                  className='rounded-lg border border-border p-3'
                >
                  <div className='text-xs text-muted-foreground'>
                    {pricing.days} {t('listingTypes.days')}
                  </div>
                  <div className='font-semibold text-foreground'>
                    {pricing.price}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Click Pricing */}
          <div className='flex flex-col gap-2'>
            <h4 className='mb-2 text-sm font-semibold text-foreground'>
              {t('listingTypes.clickPricing')}
            </h4>
            <div className='rounded-lg border border-border p-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>
                  {t('listingTypes.basePrice')}
                </span>
                <span className='font-semibold text-foreground'>
                  {listingType.clickPricing.basePrice}/
                  {t('listingTypes.perClick')}
                </span>
              </div>
              <div className='mt-2 flex items-center justify-between'>
                <span className='text-sm text-muted-foreground'>
                  {t('listingTypes.minClicks')} - {t('listingTypes.maxClicks')}
                </span>
                <span className='text-sm text-foreground'>
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
            <Pencil className='mr-2 h-4 w-4' />
            {t('listingTypes.editPricing')}
          </Button>
        </Card>
      ))}
    </div>
  )
}
