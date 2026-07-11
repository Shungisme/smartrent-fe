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
import { formatDate } from '@/utils/format'

interface NewsTableProps {
  data: NewsSummaryResponse[]
  totalItems: number
  loading: boolean
  filterValues: Record<string, unknown>
  onFilterChange: (newFilters: Record<string, unknown>) => void
  onPreview: (news: NewsSummaryResponse) => void
  onEdit: (news: NewsSummaryResponse) => void
  onDelete: (news: NewsSummaryResponse) => void
  toolbarActions?: React.ReactNode
}

const getStatusColor = (status: NewsStatus): string => {
  const colors: Record<NewsStatus, string> = {
    DRAFT:
      'bg-warning/10 text-warning-foreground border-warning/30 dark:bg-warning/20',
    PUBLISHED:
      'bg-success/10 text-success-foreground border-success/30 dark:bg-success/20',
    ARCHIVED: 'bg-muted text-muted-foreground border-border/70',
  }
  return colors[status]
}

const getCategoryColor = (category: NewsCategory): string => {
  const colors: Record<NewsCategory, string> = {
    NEWS: 'border-blue-200/70 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300',
    BLOG: 'border-purple-200/70 bg-purple-50 text-purple-700 dark:border-purple-500/30 dark:bg-purple-500/10 dark:text-purple-300',
    POLICY:
      'border-orange-200/70 bg-orange-50 text-orange-700 dark:border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-300',
    MARKET:
      'border-emerald-200/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300',
    PROJECT:
      'border-cyan-200/70 bg-cyan-50 text-cyan-700 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-300',
    INVESTMENT:
      'border-indigo-200/70 bg-indigo-50 text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300',
    GUIDE:
      'border-pink-200/70 bg-pink-50 text-pink-700 dark:border-pink-500/30 dark:bg-pink-500/10 dark:text-pink-300',
  }
  return colors[category]
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
  toolbarActions,
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
          <div className='flex justify-end gap-3 lg:justify-start'>
            <div className='relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted'>
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
                  <FileText className='h-6 w-6 text-muted-foreground' />
                </div>
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <div className='font-medium text-foreground line-clamp-2'>
                {row.title}
              </div>
              <div className='mt-1 text-xs text-muted-foreground line-clamp-1'>
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
        <div className='flex items-center justify-end gap-2 lg:justify-start'>
          <User className='h-4 w-4 text-muted-foreground' />
          <span className='text-sm text-foreground/80'>
            {row.authorName || t('notAvailable')}
          </span>
        </div>
      ),
    },
    {
      id: 'stats',
      header: t('table.columns.stats'),
      accessor: () => '',
      render: (_, row) => (
        <div className='flex flex-col items-end gap-1 text-sm lg:items-start'>
          <div className='flex items-center gap-1 text-muted-foreground'>
            <Eye className='h-3.5 w-3.5' />
            <span>
              {row.viewCount.toLocaleString()} {t('table.views')}
            </span>
          </div>
          {row.tags.length > 0 && (
            <div className='flex items-center gap-1 text-muted-foreground'>
              <Tag className='h-3.5 w-3.5' />
              <span className='text-xs truncate'>
                {row.tags.length} {t('table.tags')}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'dates',
      header: t('table.columns.dates'),
      accessor: 'createdAt',
      sortable: true,
      render: (_, row) => (
        <div className='text-sm'>
          <div className='text-foreground'>{formatDate(row.createdAt)}</div>
          {row.publishedAt && (
            <div className='text-xs text-muted-foreground'>
              {t('table.published')}: {formatDate(row.publishedAt)}
            </div>
          )}
        </div>
      ),
    },
  ]

  const filterConfig: FilterConfig[] = [
    {
      id: 'title',
      type: 'search',
      label: t('filters.title'),
      placeholder: t('filters.titlePlaceholder'),
      isFilterField: true,
    },
    {
      id: 'summary',
      type: 'search',
      label: t('filters.summary'),
      placeholder: t('filters.summaryPlaceholder'),
      isFilterField: true,
    },
    {
      id: 'status',
      type: 'select',
      label: t('filters.status'),
      options: [
        { value: 'DRAFT', label: t('status.DRAFT') },
        { value: 'PUBLISHED', label: t('status.PUBLISHED') },
        { value: 'ARCHIVED', label: t('status.ARCHIVED') },
      ],
      isFilterField: true,
    },
    {
      id: 'category',
      type: 'select',
      label: t('filters.category'),
      options: [
        { value: 'NEWS', label: t('category.NEWS') },
        { value: 'BLOG', label: t('category.BLOG') },
        { value: 'POLICY', label: t('category.POLICY') },
        { value: 'MARKET', label: t('category.MARKET') },
        { value: 'PROJECT', label: t('category.PROJECT') },
        { value: 'INVESTMENT', label: t('category.INVESTMENT') },
        { value: 'GUIDE', label: t('category.GUIDE') },
      ],
      isFilterField: true,
    },
    {
      id: 'tag',
      type: 'search',
      label: t('filters.tag'),
      placeholder: t('filters.tagPlaceholder'),
      isFilterField: true,
    },
  ]

  return (
    <DataTable
      filterMode='api'
      data={data}
      columns={columns}
      filters={filterConfig}
      toolbarActions={toolbarActions}
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      totalItems={totalItems}
      loading={loading}
      getRowKey={(row) => row.newsId}
      actions={(row) => (
        <div className='flex items-center justify-center gap-0.5'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onPreview(row)}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
            title={t('actions.preview')}
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(row)}
            className='h-8 w-8 p-0 text-muted-foreground hover:text-foreground'
            title={t('actions.edit')}
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(row)}
            className='h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive'
            title={t('actions.delete')}
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      )}
    />
  )
}
