import React from 'react'
import Image from 'next/image'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import { cn } from '@/lib/utils'
import { Eye, Edit, Trash2, FileText, User, Tag } from 'lucide-react'
import { News, NewsStatus, NewsCategory } from '@/api/types/news.type'

interface NewsTableProps {
  data: News[]
  totalItems: number
  loading: boolean
  filterValues: Record<string, unknown>
  onFilterChange: (newFilters: Record<string, unknown>) => void
  onPreview: (news: News) => void
  onEdit: (news: News) => void
  onDelete: (news: News) => void
}

const getStatusColor = (status: NewsStatus): string => {
  const colors = {
    DRAFT: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    PUBLISHED: 'bg-green-50 text-green-700 border-green-200',
    ARCHIVED: 'bg-gray-50 text-gray-700 border-gray-200',
  }
  return colors[status]
}

const getCategoryColor = (category: NewsCategory): string => {
  const colors = {
    NEWS: 'bg-blue-50 text-blue-700 border-blue-200',
    BLOG: 'bg-purple-50 text-purple-700 border-purple-200',
  }
  return colors[category]
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
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
  const columns: Column<News>[] = [
    {
      id: 'news',
      header: 'Bài viết',
      accessor: (row) => row.title,
      sortable: true,
      render: (_, row) => (
        <div className='flex gap-3'>
          <div className='relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100'>
            {row.thumbnail_url ? (
              <Image
                src={row.thumbnail_url}
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
                {row.category === 'NEWS' ? 'Tin tức' : 'Blog'}
              </Badge>
              <Badge
                variant='outline'
                className={cn('text-xs px-2 py-0', getStatusColor(row.status))}
              >
                {row.status === 'DRAFT'
                  ? 'Bản nháp'
                  : row.status === 'PUBLISHED'
                    ? 'Đã xuất bản'
                    : 'Lưu trữ'}
              </Badge>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'author',
      header: 'Tác giả',
      accessor: (row) => row.author_name || 'N/A',
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <User className='h-4 w-4 text-gray-400' />
          <span className='text-sm text-gray-700'>
            {row.author_name || 'N/A'}
          </span>
        </div>
      ),
      hideOnMobile: true,
    },
    {
      id: 'stats',
      header: 'Thống kê',
      accessor: () => '',
      render: (_, row) => (
        <div className='flex flex-col gap-1 text-sm'>
          <div className='flex items-center gap-1 text-gray-600'>
            <Eye className='h-3.5 w-3.5' />
            <span>{row.view_count.toLocaleString()} lượt xem</span>
          </div>
          {row.tags && (
            <div className='flex items-center gap-1 text-gray-500'>
              <Tag className='h-3.5 w-3.5' />
              <span className='text-xs truncate'>
                {row.tags.split(',').length} tags
              </span>
            </div>
          )}
        </div>
      ),
      hideOnMobile: true,
    },
    {
      id: 'dates',
      header: 'Ngày tạo',
      accessor: 'created_at',
      sortable: true,
      render: (_, row) => (
        <div className='text-sm'>
          <div className='text-gray-900'>{formatDate(row.created_at)}</div>
          {row.published_at && (
            <div className='text-xs text-gray-500'>
              Xuất bản: {formatDate(row.published_at)}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      header: 'Thao tác',
      accessor: () => '',
      render: (_, row) => (
        <div className='flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onPreview(row)}
            className='h-8 w-8 p-0'
            title='Xem trước'
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onEdit(row)}
            className='h-8 w-8 p-0'
            title='Chỉnh sửa'
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => onDelete(row)}
            className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
            title='Xóa'
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
      label: 'Tìm kiếm',
      placeholder: 'Tìm kiếm theo tiêu đề, nội dung...',
    },
    {
      id: 'status',
      type: 'select',
      label: 'Tất cả trạng thái',
      options: [
        { value: 'DRAFT', label: 'Bản nháp' },
        { value: 'PUBLISHED', label: 'Đã xuất bản' },
        { value: 'ARCHIVED', label: 'Lưu trữ' },
      ],
    },
    {
      id: 'category',
      type: 'select',
      label: 'Tất cả danh mục',
      options: [
        { value: 'NEWS', label: 'Tin tức' },
        { value: 'BLOG', label: 'Blog' },
      ],
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      filters={filters}
      filterValues={filterValues}
      onFilterChange={onFilterChange}
      totalItems={totalItems}
      loading={loading}
    />
  )
}
