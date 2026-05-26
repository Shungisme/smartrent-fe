'use client'

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Crown, Check, X, Sparkles } from 'lucide-react'
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
        const style = TIER_STYLES[tier.tierCode] || FALLBACK_TIER_STYLE
        const name = locale === 'vi' ? tier.tierName : tier.tierNameEn
        return (
          <div className='flex items-center gap-3'>
            <span
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-border/60',
                style.chip,
              )}
            >
              <Crown className={cn('h-4 w-4', style.icon)} />
            </span>
            <div className='leading-tight'>
              <div className='font-medium text-foreground'>
                {name || t(`listingTypes.tiers.${tier.tierCode.toLowerCase()}`)}
              </div>
              <div className='text-xs text-muted-foreground'>
                {t('listingTypes.level', { level: tier.tierLevel })}
              </div>
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
        return <span className='text-sm text-muted-foreground/70'>—</span>
      },
    },
    {
      id: 'pricePerDay',
      header: t('listingTypes.columns.pricePerDay'),
      accessor: 'pricePerDay',
      sortable: true,
      render: (value) => (
        <div className='font-mono text-sm font-medium tabular-nums text-foreground'>
          {formatCurrency(value as number)}
        </div>
      ),
    },
    {
      id: 'longPricing',
      header: t('listingTypes.dayPricing'),
      accessor: 'price30Days',
      render: (_, tier) => (
        <div className='grid grid-cols-3 gap-x-3 gap-y-0.5 text-xs leading-tight'>
          {[
            { d: 10, p: tier.price10Days },
            { d: 15, p: tier.price15Days },
            { d: 30, p: tier.price30Days },
          ].map((row) => (
            <React.Fragment key={row.d}>
              <div className='col-span-1 text-muted-foreground'>
                {row.d} {t('listingTypes.days')}
              </div>
              <div className='col-span-2 text-right font-mono font-medium tabular-nums text-foreground'>
                {formatCurrency(row.p)}
              </div>
            </React.Fragment>
          ))}
        </div>
      ),
    },
    {
      id: 'media',
      header: t('listingTypes.mediaLimits'),
      accessor: (row) => row.maxImages + row.maxVideos,
      render: (_, tier) => (
        <div className='flex flex-col gap-0.5 text-xs leading-tight'>
          <div className='flex items-center gap-1.5'>
            <span className='text-muted-foreground'>
              {t('listingTypes.maxImages')}
            </span>
            <span className='font-mono font-medium tabular-nums text-foreground'>
              {tier.maxImages}
            </span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span className='text-muted-foreground'>
              {t('listingTypes.maxVideos')}
            </span>
            <span className='font-mono font-medium tabular-nums text-foreground'>
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
          <div className='grid grid-cols-1 gap-y-1 text-xs leading-tight sm:grid-cols-2 sm:gap-x-3'>
            {caps.map((cap) => (
              <span key={cap.key} className='inline-flex items-center gap-1.5'>
                {cap.enabled ? (
                  <Check className='h-3.5 w-3.5 shrink-0 text-success' />
                ) : (
                  <X className='h-3.5 w-3.5 shrink-0 text-muted-foreground/40' />
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
          return <span className='text-sm text-muted-foreground/70'>—</span>
        }
        return (
          <ul className='flex flex-col gap-1 text-xs leading-tight'>
            {tier.features.slice(0, 3).map((feature, i) => (
              <li key={i} className='flex items-start gap-1.5 text-foreground'>
                <Sparkles className='mt-0.5 h-3 w-3 shrink-0 text-amber-500' />
                <span>{feature}</span>
              </li>
            ))}
            {tier.features.length > 3 && (
              <li className='text-muted-foreground'>
                +{tier.features.length - 3}
              </li>
            )}
          </ul>
        )
      },
    },
    {
      id: 'isActive',
      header: t('listingTypes.columns.status'),
      accessor: 'isActive',
      render: (value) =>
        value ? (
          <Badge variant='success' className='gap-1.5'>
            <span className='inline-block h-1.5 w-1.5 rounded-full bg-success' />
            {t('listingTypes.active')}
          </Badge>
        ) : (
          <Badge variant='secondary' className='gap-1.5'>
            <span className='inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground/50' />
            {t('listingTypes.inactive')}
          </Badge>
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
