'use client'

import React from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { DataTable, type Column } from '@/components/organisms/DataTable'
import { Badge } from '@/components/atoms/badge'
import { VIPTier } from '@/api/types/vip-tier.type'
import { formatCurrency } from '@/utils/format'

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
      id: 'pricePerDay',
      header: t('listingTypes.columns.pricePerDay'),
      accessor: 'pricePerDay',
      sortable: true,
      render: (value) => (
        <div className='text-sm font-medium tabular-nums'>
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
            <span className='text-muted-foreground'>
              10 {t('listingTypes.days')}
            </span>
            <span className='font-medium tabular-nums'>
              {formatCurrency(tier.price10Days)}
            </span>
          </div>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>
              15 {t('listingTypes.days')}
            </span>
            <span className='font-medium tabular-nums'>
              {formatCurrency(tier.price15Days)}
            </span>
          </div>
          <div className='flex justify-between gap-4'>
            <span className='text-muted-foreground'>
              30 {t('listingTypes.days')}
            </span>
            <span className='font-medium tabular-nums'>
              {formatCurrency(tier.price30Days)}
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'capabilities',
      header: t('listingTypes.capabilities'),
      accessor: () => '',
      maxWidth: 200,
      render: (_, tier) => {
        const caps = [
          { key: 'autoApprove', enabled: tier.autoApprove },
          { key: 'noAds', enabled: tier.noAds },
          { key: 'priorityDisplay', enabled: tier.priorityDisplay },
          { key: 'hasShadowListing', enabled: tier.hasShadowListing },
        ].filter((cap) => cap.enabled)

        if (caps.length === 0) {
          return <span className='text-sm text-muted-foreground/50'>—</span>
        }

        return (
          <div className='flex flex-wrap gap-1 text-xs'>
            {caps.map((cap) => (
              <span
                key={cap.key}
                className='inline-block rounded-md bg-muted px-2 py-1 text-foreground'
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
      maxWidth: 200,
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
