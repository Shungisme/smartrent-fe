'use client'

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { DataTable, type Column } from '@/components/organisms/DataTable'
import { Badge } from '@/components/atoms/badge'
import { cn } from '@/lib/utils'
import { VIPTier } from '@/api/types/vip-tier.type'
import { formatCurrency } from '@/utils/format'
import { TIER_STYLES, FALLBACK_TIER_STYLE } from '@/utils/premium.utils'

interface ListingTypeTableProps {
  tiers: VIPTier[]
  loading: boolean
}

export const ListingTypeTable: React.FC<ListingTypeTableProps> = ({
  tiers,
  loading,
}) => {
  const t = useTranslations('premium')
  const locale = useLocale()

  const data = React.useMemo(
    () =>
      [...tiers].sort(
        (a, b) =>
          (a.displayOrder ?? a.tierLevel) - (b.displayOrder ?? b.tierLevel),
      ),
    [tiers],
  )

  const columns: Column<VIPTier>[] = [
    {
      id: 'tier',
      header: t('listingTypes.columns.tier'),
      accessor: (row) => row.tierName,
      render: (_, tier) => {
        const name = locale === 'vi' ? tier.tierName : tier.tierNameEn
        return (
          <div>
            <div className='font-medium text-foreground'>
              {name || t(`listingTypes.tiers.${tier.tierCode.toLowerCase()}`)}
            </div>
            <div className='text-xs text-muted-foreground'>
              Level {tier.tierLevel}
            </div>
          </div>
        )
      },
    },
    {
      id: 'badge',
      header: t('listingTypes.columns.badge'),
      accessor: (row) => row.badgeName ?? '',
      render: (_, tier) => {
        const style = TIER_STYLES[tier.tierCode] || FALLBACK_TIER_STYLE
        if (tier.hasBadge && tier.badgeName) {
          return (
            <Badge
              variant='outline'
              className={cn(
                'font-semibold uppercase tracking-wide',
                style.badge,
              )}
            >
              {tier.badgeName}
            </Badge>
          )
        }
        return <span className='text-sm text-muted-foreground/50'>—</span>
      },
    },
    {
      id: 'pricePerDay',
      header: t('listingTypes.columns.pricePerDay'),
      accessor: 'pricePerDay',
      sortable: true,
      render: (value) => (
        <div className='font-mono text-sm font-medium tabular-nums'>
          {formatCurrency(value as number)}
        </div>
      ),
    },
    {
      id: 'pricing',
      header: t('listingTypes.dayPricing'),
      accessor: 'price30Days',
      render: (_, tier) => (
        <div className='flex flex-col gap-2 text-xs'>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>10 days</span>
            <span className='font-mono font-medium tabular-nums'>
              {formatCurrency(tier.price10Days)}
            </span>
          </div>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>15 days</span>
            <span className='font-mono font-medium tabular-nums'>
              {formatCurrency(tier.price15Days)}
            </span>
          </div>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>30 days</span>
            <span className='font-mono font-medium tabular-nums'>
              {formatCurrency(tier.price30Days)}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'media',
      header: t('listingTypes.mediaLimits'),
      accessor: (row) => row.maxImages + row.maxVideos,
      render: (_, tier) => (
        <div className='flex flex-col gap-2 text-xs'>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>
              {t('listingTypes.maxImages')}
            </span>
            <span className='font-mono font-medium tabular-nums'>
              {tier.maxImages}
            </span>
          </div>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>
              {t('listingTypes.maxVideos')}
            </span>
            <span className='font-mono font-medium tabular-nums'>
              {tier.maxVideos}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'capabilities',
      header: t('listingTypes.capabilities'),
      accessor: () => '',
      render: (_, tier) => {
        const caps = [
          { key: 'autoApprove', enabled: tier.autoApprove },
          { key: 'noAds', enabled: tier.noAds },
          { key: 'priorityDisplay', enabled: tier.priorityDisplay },
          { key: 'hasShadowListing', enabled: tier.hasShadowListing },
        ] as const
        return (
          <div className='flex flex-col gap-1.5 text-xs'>
            {caps.map((cap) => (
              <span
                key={cap.key}
                className={cn(
                  cap.enabled
                    ? 'text-foreground'
                    : 'text-muted-foreground/50 line-through',
                )}
              >
                {t(`listingTypes.caps.${cap.key}`)}
              </span>
            ))}
          </div>
        )
      },
    },
    {
      id: 'extraFeatures',
      header: t('listingTypes.features'),
      accessor: (row) => row.features?.length ?? 0,
      render: (_, tier) => {
        if (!tier.features || tier.features.length === 0) {
          return <span className='text-sm text-muted-foreground/50'>—</span>
        }
        return (
          <div className='max-h-32 overflow-y-auto text-xs'>
            <div className='flex flex-wrap gap-1'>
              {tier.features.map((feature, i) => (
                <span
                  key={i}
                  className='inline-block rounded-md bg-muted px-2 py-1 text-foreground'
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )
      },
    },
    {
      id: 'isActive',
      header: t('listingTypes.columns.status'),
      accessor: 'isActive',
      render: (value) =>
        value ? (
          <Badge variant='success'>{t('listingTypes.active')}</Badge>
        ) : (
          <Badge variant='secondary'>{t('listingTypes.inactive')}</Badge>
        ),
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      loading={loading}
      getRowKey={(row) => row.tierId}
      emptyMessage={t('listingTypes.empty')}
      sortable
      defaultSort={{ key: 'pricePerDay', direction: 'asc' }}
      itemsPerPage={20}
    />
  )
}

export default ListingTypeTable
