import React from 'react'
import { useTranslations } from 'next-intl'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Avatar } from '@/components/atoms/avatar'
import { MediaThumbnail } from '@/components/molecules/mediaPreview'
import { Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PostStatus, UIPostData } from '@/types/posts.type'
import { getPropertyIcon, getStatusColor } from '@/utils/post.utils'
import { TIER_STYLES, FALLBACK_TIER_STYLE } from '@/utils/premium.utils'

const VipTypeBadge: React.FC<{ vipType: string }> = ({ vipType }) => {
  const t = useTranslations('posts.filters')
  const style = TIER_STYLES[vipType] ?? FALLBACK_TIER_STYLE
  const labels: Record<string, string> = {
    NORMAL: t('vipNormal'),
    SILVER: t('vipSilver'),
    GOLD: t('vipGold'),
    DIAMOND: t('vipDiamond'),
  }
  const label = labels[vipType] ?? vipType
  return (
    <Badge
      variant='outline'
      className={cn(
        'px-2 py-0 text-[10px] font-semibold uppercase tracking-wide',
        style.badge,
      )}
    >
      {label}
    </Badge>
  )
}

interface PostTableProps {
  data: UIPostData[]
  loading: boolean
  totalItems: number
  filterValues: Record<string, unknown>
  onFilterChange: (filters: Record<string, unknown>) => void
  onReview: (post: UIPostData) => void
}

export const PostTable: React.FC<PostTableProps> = ({
  data,
  loading,
  totalItems,
  filterValues,
  onFilterChange,
  onReview,
}) => {
  const t = useTranslations('posts')

  // Helper functions with translations
  const getPropertyTypeLabel = (type: string): string => {
    const typeMap: Record<string, string> = {
      HOUSE: 'house',
      APARTMENT: 'apartment',
      OFFICE: 'office',
      LAND: 'land',
      ROOM: 'room',
      OTHER: 'other',
    }
    const key = typeMap[type]
    return key ? t(`propertyTypes.${key}`) : type
  }

  const getStatusLabel = (status: PostStatus): string => {
    const labels: Record<PostStatus, string> = {
      pending: t('statuses.pending'),
      resubmitted: t('statuses.resubmitted'),
      approved: t('statuses.approved'),
      rejected: t('statuses.rejected'),
      revision_required: t('statuses.revision_required'),
      suspended: t('statuses.suspended'),
      expired: t('statuses.expired'),
      pending_payment: t('statuses.pending_payment'),
    }
    return labels[status] ?? t('statuses.pending')
  }

  const columns: Column<UIPostData>[] = [
    {
      id: 'post',
      header: t('table.postDetails'),
      accessor: (row) => row.title,
      sortable: true,
      render: (_, row) => (
        <div className='flex min-w-0 items-start justify-end gap-3 text-left lg:justify-start'>
          <div className='relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted'>
            <MediaThumbnail src={row.images[0]} alt={row.title} />
            {row.images.length > 1 && (
              <div className='absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white'>
                +{row.images.length - 1}
              </div>
            )}
          </div>
          <div className='min-w-0 flex-1 space-y-1'>
            <div
              className='line-clamp-2 max-w-[20rem] break-words text-sm font-medium leading-snug text-foreground'
              title={row.title}
            >
              {row.title}
            </div>
            <div className='font-mono text-[11px] text-muted-foreground'>
              {row.postCode}
            </div>
            <div className='flex flex-wrap gap-1'>
              {row.vipType && <VipTypeBadge vipType={row.vipType} />}
              <Badge
                variant={row.listingType === 'for_sale' ? 'info' : 'secondary'}
                className={cn('px-2 py-0 text-[10px]')}
              >
                {row.listingType === 'for_sale'
                  ? t('listingTypes.for_sale')
                  : t('listingTypes.for_rent')}
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'poster',
      header: t('table.poster'),
      accessor: (row) => row.poster.name,
      sortable: true,
      render: (_, row) => (
        <div className='flex items-center justify-end gap-2 lg:justify-start'>
          <Avatar className='h-10 w-10'>
            <div className='h-full w-full bg-muted flex items-center justify-center text-foreground font-semibold'>
              {row.poster.name.charAt(0).toUpperCase()}
            </div>
          </Avatar>
          <div>
            <div className='text-sm font-medium text-foreground'>
              {row.poster.name}
            </div>
            <div className='text-xs text-muted-foreground'>
              {row.poster.phone}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'propertyInfo',
      header: t('table.propertyInfo'),
      accessor: (row) => row.propertyInfo.type,
      render: (_, row) => (
        <div className='flex items-center gap-2 text-sm text-foreground'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-muted'>
            {getPropertyIcon(row.propertyInfo.type)}
          </div>
          <div>
            <div className='font-medium'>
              {getPropertyTypeLabel(row.propertyInfo.type)}
            </div>
            <div className='text-xs text-muted-foreground'>
              {row.propertyInfo.area ? `${row.propertyInfo.area}m²` : ''}
              {row.propertyInfo.area && row.propertyInfo.district ? ' • ' : ''}
              {row.propertyInfo.district}
            </div>
          </div>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      id: 'price',
      header: t('table.price'),
      accessor: 'price',
      render: (value) => (
        <div className='text-sm font-semibold text-foreground'>
          {value as React.ReactNode}
        </div>
      ),
    },
    {
      id: 'postedDate',
      header: t('table.postedDate'),
      accessor: 'postedDate',
      sortable: true,
      render: (_, row) => (
        <div className='text-sm text-muted-foreground'>
          <div>{row.postedDate}</div>
        </div>
      ),
    },
    {
      id: 'status',
      header: t('table.status'),
      accessor: 'status',
      render: (value) => (
        <Badge
          variant='outline'
          className={cn(
            'text-xs font-medium',
            getStatusColor(value as PostStatus),
          )}
        >
          {getStatusLabel(value as PostStatus)}
        </Badge>
      ),
    },
  ]

  const filters: FilterConfig[] = [
    {
      id: 'title',
      type: 'search',
      label: t('filters.titleSearch'),
      placeholder: t('filters.titleSearchPlaceholder'),
      isFilterField: true,
    },
    {
      id: 'ownerSearch',
      type: 'search',
      label: t('filters.ownerSearch'),
      placeholder: t('filters.ownerSearchPlaceholder'),
      isFilterField: true,
    },
    {
      id: 'postDate',
      type: 'date-range',
      label: t('filters.postDate'),
      isFilterField: true,
    },
    {
      id: 'expiryDate',
      type: 'date-range',
      label: t('filters.expiryDate'),
      isFilterField: true,
    },
    {
      id: 'moderationStatus',
      type: 'select',
      label: t('filters.status'),
      options: [
        { value: 'PENDING_REVIEW', label: t('tabs.pendingReview') },
        { value: 'APPROVED', label: t('tabs.approved') },
        { value: 'REJECTED', label: t('tabs.rejected') },
        { value: 'REVISION_REQUIRED', label: t('tabs.revisionRequired') },
        { value: 'SUSPENDED', label: t('tabs.suspended') },
        { value: 'RESUBMITTED', label: t('tabs.resubmitted') },
      ],
      isFilterField: true,
    },
    {
      id: 'productType',
      type: 'select',
      label: t('filters.type'),
      options: [
        { value: 'ROOM', label: t('propertyTypes.room') },
        { value: 'APARTMENT', label: t('filters.apartment') },
        { value: 'HOUSE', label: t('filters.house') },
        { value: 'OFFICE', label: t('filters.office') },
        { value: 'STUDIO', label: t('filters.studio') },
      ],
      isFilterField: true,
    },
    {
      id: 'listingType',
      type: 'select',
      label: t('filters.category'),
      options: [
        { value: 'RENT', label: t('filters.forRent') },
        { value: 'SALE', label: t('filters.forSale') },
        { value: 'SHARE', label: t('filters.share') },
      ],
      isFilterField: true,
    },
    {
      id: 'vipType',
      type: 'select',
      label: t('filters.vipTier'),
      options: [
        { value: 'NORMAL', label: t('filters.vipNormal') },
        { value: 'SILVER', label: t('filters.vipSilver') },
        { value: 'GOLD', label: t('filters.vipGold') },
        { value: 'DIAMOND', label: t('filters.vipDiamond') },
      ],
      isFilterField: true,
    },
    {
      id: 'price',
      type: 'range',
      label: t('filters.priceRange'),
      isFilterField: true,
    },
    {
      id: 'area',
      type: 'range',
      label: t('filters.areaRange'),
      isFilterField: true,
    },
    {
      id: 'bedroomsRange',
      type: 'range',
      label: t('filters.bedroomsRange'),
      isFilterField: true,
    },
    {
      id: 'bathroomsRange',
      type: 'range',
      label: t('filters.bathroomsRange'),
      isFilterField: true,
    },
  ]

  return (
    <DataTable
      fillHeight
      data={data}
      columns={columns}
      filters={filters}
      filterMode='api'
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      loading={loading}
      pagination
      totalItems={totalItems}
      itemsPerPage={20}
      itemsPerPageOptions={[5, 10, 20, 50]}
      sortable
      defaultSort={{ key: 'postedDate', direction: 'desc' }}
      emptyMessage={t('table.noPostsFound')}
      getRowKey={(row) => row.id}
      actions={(row) => (
        <div className='flex items-center justify-center gap-0.5'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onReview(row)}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
            title={t('table.reviewButton')}
          >
            <Eye className='h-4 w-4' />
          </Button>
        </div>
      )}
    />
  )
}
