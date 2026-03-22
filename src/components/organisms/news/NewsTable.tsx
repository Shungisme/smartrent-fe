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
import { cn } from '@/lib/utils'
import { Eye, Edit, Trash2, FileText, User, Tag } from 'lucide-react'
import {
  NewsCategory,
  NewsStatus,
  NewsSummaryResponse,
} from '@/api/types/news.type'

interface NewsTableProps {
  data: NewsSummaryResponse[]
  totalItems: number
  loading: boolean
  filterValues: Record<string, unknown>
  onFilterChange: (newFilters: Record<string, unknown>) => void
  onPreview: (news: NewsSummaryResponse) => void
  onEdit: (news: NewsSummaryResponse) => void
  onDelete: (news: NewsSummaryResponse) => void
}

const getStatusColor = (status: NewsStatus): string => {
  const colors: Record<NewsStatus, string> = {
    DRAFT: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    PUBLISHED: 'bg-green-50 text-green-700 border-green-200',
    ARCHIVED: 'bg-gray-50 text-gray-700 border-gray-200',
  }
  return colors[status]
}

const getCategoryColor = (category: NewsCategory): string => {
  const colors: Record<NewsCategory, string> = {
    NEWS: 'bg-blue-50 text-blue-700 border-blue-200',
    BLOG: 'bg-purple-50 text-purple-700 border-purple-200',
    POLICY: 'bg-orange-50 text-orange-700 border-orange-200',
    MARKET: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PROJECT: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    INVESTMENT: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    GUIDE: 'bg-pink-50 text-pink-700 border-pink-200',
  }
  return colors[category]
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

const isValidImageSrc = (src: unknown): src is string => {
  if (typeof src !== 'string') return false
  const normalized = src.trim()
  return normalized.startsWith('/') || /^https?:\/\//i.test(normalized)
}

const getDisplayStatus = (row: NewsSummaryResponse): NewsStatus => {
  if (row.status) return row.status
  return row.publishedAt ? 'PUBLISHED' : 'DRAFT'
}

export const NewsTable: React.FC<NewsTableProps> = ({
  data,
  totalItems,
  loading,
  filterValues,
  onFilterChange,
  onPreview,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations('news')

  const columns: Column<NewsSummaryResponse>[] = [
    {
      id: 'news',
      header: t('table.columns.news'),
      accessor: (row) => row.title,
      sortable: true,
      render: (_, row) => {
        const safeThumbnailSrc = isValidImageSrc(row.thumbnailUrl)
          ? row.thumbnailUrl
          : null
        const displayStatus = getDisplayStatus(row)

        return (
          <div className='flex gap-3'>
            <div className='relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100'>
              {safeThumbnailSrc ? (
                <Image
                  src={safeThumbnailSrc}
                  alt={row.title}
                  width={96}
                  height={64}
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center'>
                  <FileText className='h-6 w-6 text-gray-400' />
                </div>
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <div className='font-medium text-gray-900 line-clamp-2'>
                {row.title}
              </div>
              <div className='mt-1 text-xs text-gray-500 line-clamp-1'>
                {row.slug}
              </div>
              <div className='mt-1 flex flex-wrap gap-1'>
                <Badge
                  variant='outline'
                  className={cn(
                    'text-xs px-2 py-0',
                    getCategoryColor(row.category),
                  )}
                >
                  {t(`category.${row.category}`)}
                </Badge>
                <Badge
                  variant='outline'
                  className={cn(
                    'text-xs px-2 py-0',
                    getStatusColor(displayStatus),
                  )}
                >
                  {t(`status.${displayStatus}`)}
                </Badge>
              </div>
            </div>
          </div>
        )
      },
    },
    {
      id: 'author',
      header: t('table.columns.author'),
      accessor: (row) => row.authorName || t('notAvailable'),
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <User className='h-4 w-4 text-gray-400' />
          <span className='text-sm text-gray-700'>
            {row.authorName || t('notAvailable')}
          </span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      id: 'stats',
      header: t('table.columns.stats'),
      accessor: () => '',
      render: (_, row) => (
        <div className='flex flex-col gap-1 text-sm'>
          <div className='flex items-center gap-1 text-gray-600'>
            <Eye className='h-3.5 w-3.5' />
            <span>
              {row.viewCount.toLocaleString()} {t('table.views')}
            </span>
          </div>
          {row.tags.length > 0 && (
            <div className='flex items-center gap-1 text-gray-500'>
              <Tag className='h-3.5 w-3.5' />
              <span className='text-xs truncate'>
                {row.tags.length} {t('table.tags')}
              </span>
            </div>
          )}
        </div>
      ),
      hideOnMobile: true,
    },
    {
      id: 'dates',
      header: t('table.columns.dates'),
      accessor: 'createdAt',
      sortable: true,
      render: (_, row) => (
        <div className='text-sm'>
          <div className='text-gray-900'>{formatDate(row.createdAt)}</div>
          {row.publishedAt && (
            <div className='text-xs text-gray-500'>
              {t('table.published')}: {formatDate(row.publishedAt)}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: t('table.columns.actions'),
      accessor: () => '',
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onPreview(row)}
            className='h-8 w-8 p-0'
            title={t('actions.preview')}
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(row)}
            className='h-8 w-8 p-0'
            title={t('actions.edit')}
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(row)}
            className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
            title={t('actions.delete')}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ]

  const filters: FilterConfig[] = [
    {
      id: 'search',
      type: 'search',
      label: t('filters.search'),
      placeholder: t('filters.searchPlaceholder'),
    },
    {
      id: 'status',
      type: 'select',
      label: t('filters.allStatus'),
      options: [
        { value: 'DRAFT', label: t('status.DRAFT') },
        { value: 'PUBLISHED', label: t('status.PUBLISHED') },
        { value: 'ARCHIVED', label: t('status.ARCHIVED') },
      ],
    },
    {
      id: 'category',
      type: 'select',
      label: t('filters.allCategory'),
      options: [
        { value: 'NEWS', label: t('category.NEWS') },
        { value: 'BLOG', label: t('category.BLOG') },
        { value: 'POLICY', label: t('category.POLICY') },
        { value: 'MARKET', label: t('category.MARKET') },
        { value: 'PROJECT', label: t('category.PROJECT') },
        { value: 'INVESTMENT', label: t('category.INVESTMENT') },
        { value: 'GUIDE', label: t('category.GUIDE') },
      ],
    },
  ]

  return (
    <DataTable
      filterMode='api'
      data={data}
      columns={columns}
      filters={filters}
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      totalItems={totalItems}
      loading={loading}
      getRowKey={(row) => row.newsId}
    />
  )
}
