import React from 'react'
import { Check, X, Sparkles } from 'lucide-react'
import { Badge } from '@/components/atoms/badge'
import { useLocale, useTranslations } from 'next-intl'
import { VIPTier } from '@/api/types/vip-tier.type'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/utils/format'
import { tierStyles, fallbackStyle } from '@/utils/premium.utils'

interface ListingTypePricingListProps {
  tiers: VIPTier[]
  loading: boolean
}

export const ListingTypePricingList: React.FC<ListingTypePricingListProps> = ({
  tiers,
  loading,
}) => {
  const t = useTranslations('premium')
  const locale = useLocale()

  if (loading) {
    return (
      <div className='flex justify-center py-12'>
        <div className='text-center'>
          <div className='mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary'></div>
          <p className='mt-4 text-sm text-muted-foreground'>
            {t('listingTypes.loading')}
          </p>
        </div>
      </div>
    )
  }

  if (tiers.length === 0) {
    return (
      <div className='flex justify-center py-12'>
        <p className='text-sm text-muted-foreground'>
          {t('listingTypes.empty')}
        </p>
      </div>
    )
  }

  const sortedTiers = [...tiers].sort(
    (a, b) => (a.displayOrder ?? a.tierLevel) - (b.displayOrder ?? b.tierLevel),
  )

  return (
    <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4'>
      {sortedTiers.map((tier) => {
        const style = tierStyles[tier.tierCode] || fallbackStyle
        const name = locale === 'vi' ? tier.tierName : tier.tierNameEn
        const longerPricing = [
          { days: 10, price: tier.price10Days },
          { days: 15, price: tier.price15Days },
          { days: 30, price: tier.price30Days },
        ]
        const capabilities = [
          { key: 'autoApprove', enabled: tier.autoApprove },
          { key: 'noAds', enabled: tier.noAds },
          { key: 'priorityDisplay', enabled: tier.priorityDisplay },
          { key: 'hasShadowListing', enabled: tier.hasShadowListing },
        ] as const

        return (
          <div
            key={tier.tierId}
            className={cn(
              'relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm ring-1 transition-all hover:-translate-y-0.5 hover:shadow-lg',
              style.ring,
            )}
          >
            <div className={cn('h-1 w-full', style.accent)} />

            <div className='flex flex-col gap-5 p-6'>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex flex-col gap-1'>
                  <span
                    className={cn(
                      'text-[11px] font-bold uppercase tracking-wider',
                      style.title,
                    )}
                  >
                    {name ||
                      t(`listingTypes.tiers.${tier.tierCode.toLowerCase()}`)}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {t('listingTypes.level', { level: tier.tierLevel })}
                  </span>
                </div>
                {tier.hasBadge && tier.badgeName ? (
                  <Badge
                    className={cn(
                      'text-[10px] font-bold uppercase tracking-wide',
                      style.badge,
                    )}
                  >
                    {tier.badgeName}
                  </Badge>
                ) : (
                  <Badge
                    variant='outline'
                    className={cn(
                      'text-[10px]',
                      tier.isActive
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-gray-50 text-gray-600',
                    )}
                  >
                    {tier.isActive
                      ? t('listingTypes.active')
                      : t('listingTypes.inactive')}
                  </Badge>
                )}
              </div>

              <div className='flex flex-col gap-1'>
                <div className='flex items-baseline gap-1.5'>
                  <span
                    className={cn(
                      'text-3xl font-bold tracking-tight',
                      style.price,
                    )}
                  >
                    {formatCurrency(tier.pricePerDay)}
                  </span>
                  <span className='text-sm text-muted-foreground'>
                    /{t('listingTypes.perDay')}
                  </span>
                </div>
                {tier.description && (
                  <p className='text-xs leading-relaxed text-muted-foreground'>
                    {tier.description}
                  </p>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <div className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
                  {t('listingTypes.dayPricing')}
                </div>
                <dl className='flex flex-col gap-1.5 text-sm'>
                  {longerPricing.map((p) => (
                    <div
                      key={p.days}
                      className='flex items-baseline justify-between gap-2'
                    >
                      <dt className='text-muted-foreground'>
                        {p.days} {t('listingTypes.days')}
                      </dt>
                      <dd className='font-medium tabular-nums text-foreground'>
                        {formatCurrency(p.price)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className='flex flex-col gap-2'>
                <div className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
                  {t('listingTypes.mediaLimits')}
                </div>
                <dl className='flex flex-col gap-1.5 text-sm'>
                  <div className='flex items-baseline justify-between gap-2'>
                    <dt className='text-muted-foreground'>
                      {t('listingTypes.maxImages')}
                    </dt>
                    <dd className='font-medium tabular-nums text-foreground'>
                      {tier.maxImages}
                    </dd>
                  </div>
                  <div className='flex items-baseline justify-between gap-2'>
                    <dt className='text-muted-foreground'>
                      {t('listingTypes.maxVideos')}
                    </dt>
                    <dd className='font-medium tabular-nums text-foreground'>
                      {tier.maxVideos}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className='flex flex-col gap-2'>
                <div className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
                  {t('listingTypes.capabilities')}
                </div>
                <ul className='flex flex-col gap-2 text-sm'>
                  {capabilities.map((cap) => (
                    <li key={cap.key} className='flex items-start gap-2'>
                      {cap.enabled ? (
                        <Check className='mt-0.5 h-4 w-4 shrink-0 text-emerald-600' />
                      ) : (
                        <X className='mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40' />
                      )}
                      <span
                        className={cn(
                          cap.enabled
                            ? 'text-foreground'
                            : 'text-muted-foreground/60 line-through',
                        )}
                      >
                        {t(`listingTypes.caps.${cap.key}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {tier.features && tier.features.length > 0 && (
                <div className='flex flex-col gap-2 border-t border-border pt-4'>
                  <div className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
                    {t('listingTypes.features')}
                  </div>
                  <ul className='flex flex-col gap-2 text-sm'>
                    {tier.features.map((feature, index) => (
                      <li
                        key={index}
                        className='flex items-start gap-2 text-foreground'
                      >
                        <Sparkles className='mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500' />
                        <span className='leading-relaxed'>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
