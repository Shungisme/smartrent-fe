import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { Avatar } from '@/components/atoms/avatar'
import { cn } from '@/lib/utils'
import { PostStatus, UIPostData } from '@/types/posts.type'
import {
  getPropertyIcon,
  formatPrice,
  getStatusColor,
} from '@/utils/post.utils' // We might need to adjust utils to not use translations or pass them

// Re-implementing helper functions that need translations inside the component or pass t
// Since utils cannot use hooks directly unless valid custom hook.
// The utils I created in previous step used JSX but not translations for labels.
// getPropertyTypeLabel in posts.tsx used t().
// I should probably move the label logic back here or pass t to utils if possible (but utils are functions).

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
    const labels = {
      pending: t('statuses.pending'),
      approved: t('statuses.approved'),
      rejected: t('statuses.rejected'),
      expired: t('statuses.expired'),
    }
    return labels[status]
  }

  const columns: Column<UIPostData>[] = [
    {
      id: 'post',
      header: t('table.postDetails'),
      accessor: (row) => row.title,
      sortable: true,
      render: (_, row) => (
        <div className='flex gap-3'>
          <div className='relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
            <Image
              src={row.images[0]}
              alt={row.title}
              width={64}
              height={64}
              className='h-full w-full object-cover'
            />
            {row.images.length > 1 && (
              <div className='absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white'>
                +{row.images.length - 1}
              </div>
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='font-medium text-gray-900 truncate'>
              {row.title.length > 50
                ? `${row.title.substring(0, 50)}...`
                : row.title}
            </div>
            <div className='mt-0.5 text-xs text-gray-400'>{row.postCode}</div>
            <div className='mt-1 flex flex-wrap gap-1'>
              {row.vipLevel && (
                <Badge className='bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-0'>
                  VIP{row.vipLevel}
                </Badge>
              )}
              <Badge
                className={cn(
                  'text-xs px-2 py-0',
                  row.listingType === 'for_sale'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800',
                )}
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
        <div className='flex items-center gap-2'>
          <Avatar className='h-10 w-10'>
            <div className='h-full w-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold'>
              {row.poster.name.charAt(0).toUpperCase()}
            </div>
          </Avatar>
          <div>
            <div className='text-sm font-medium text-gray-900'>
              {row.poster.name}
            </div>
            <div className='text-xs text-gray-500'>{row.poster.phone}</div>
          </div>
        </div>
      ),
    },
    {
      id: 'propertyInfo',
      header: t('table.propertyInfo'),
      accessor: (row) => row.propertyInfo.type,
      render: (_, row) => (
        <div className='flex items-center gap-2 text-sm text-gray-700'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100'>
            {getPropertyIcon(row.propertyInfo.type)}
          </div>
          <div>
            <div className='font-medium'>
              {getPropertyTypeLabel(row.propertyInfo.type)}
            </div>
            <div className='text-xs text-gray-500'>
              {row.propertyInfo.area}m² • {row.propertyInfo.district}
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
        <div className='text-sm font-semibold text-gray-900'>
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
        <div className='text-sm text-gray-500'>
          <div>{row.postedDate}</div>
          <div className='text-xs text-gray-400'>{row.postedTime}</div>
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
    {
      id: 'actions',
      header: t('table.actions'),
      accessor: () => '',
      render: (_, row) => (
        <Button
          variant='outline'
          size='sm'
          onClick={() => onReview(row)}
          className='rounded-lg border-gray-300 px-3 py-1 text-sm hover:border-blue-500 hover:text-blue-600'
        >
          {t('table.reviewButton')}
        </Button>
      ),
    },
  ]

  const filters: FilterConfig[] = [
    {
      id: 'search',
      type: 'search',
      label: t('search.placeholder'),
      placeholder: t('search.placeholder'),
    },
    {
      id: 'status',
      type: 'select',
      label: t('filters.allStatus'),
      options: [
        { value: 'pending', label: t('filters.pending') },
        { value: 'approved', label: t('filters.approved') },
        { value: 'rejected', label: t('filters.rejected') },
      ],
    },
    {
      id: 'propertyInfo.type',
      type: 'select',
      label: t('filters.allTypes'),
      options: [
        { value: 'HOUSE', label: t('filters.house') },
        { value: 'APARTMENT', label: t('filters.apartment') },
        { value: 'OFFICE', label: t('filters.office') },
        { value: 'LAND', label: t('filters.land') },
      ],
    },
    {
      id: 'listingType',
      type: 'select',
      label: t('filters.allCategories'),
      options: [
        { value: 'for_sale', label: t('filters.forSale') },
        { value: 'for_rent', label: t('filters.forRent') },
      ],
    },
  ]

  return (
    <DataTable
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
    />
  )
}
