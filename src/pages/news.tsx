import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import AdminLayout from '@/components/layouts/AdminLayout'
import {
  DataTable,
  Column,
  FilterConfig,
} from '@/components/organisms/DataTable'
import { Button } from '@/components/atoms/button'
import { Badge } from '@/components/atoms/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { cn } from '@/lib/utils'
import { NextPageWithLayout } from '@/types/next-page'
import {
  Loader2,
  Eye,
  Edit,
  Trash2,
  Plus,
  FileText,
  Calendar,
  User,
  Tag,
  TrendingUp,
} from 'lucide-react'
import { NewsService } from '@/api/services/news.service'
import {
  News,
  NewsStatus,
  NewsCategory,
  NewsFilterRequest,
  NewsStatistics,
} from '@/api/types/news.type'

// Helper functions
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

const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN')
}

const NewsManagement: NextPageWithLayout = () => {
  const router = useRouter()
  const t = useTranslations('news')

  const [newsList, setNewsList] = useState<News[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedNews, setSelectedNews] = useState<News | null>(null)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [stats, setStats] = useState<NewsStatistics>({
    totalNews: 0,
    totalPublished: 0,
    totalDrafts: 0,
    totalArchived: 0,
    totalBlogs: 0,
  })
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({
    page: 1,
    pageSize: 20,
  })
  const [totalCount, setTotalCount] = useState(0)
  const debouncedSearchTerm = useDebounce(filterValues.search || '', 500)

  // Fetch news on mount and when filters change
  useEffect(() => {
    fetchNews()
  }, [
    debouncedSearchTerm,
    filterValues.status,
    filterValues.category,
    filterValues.page,
    filterValues.pageSize,
  ])

  const fetchNews = async () => {
    try {
      if (initialLoading) {
        setInitialLoading(true)
      } else {
        setTableLoading(true)
      }

      // Map UI filters to API format
      const apiFilters: NewsFilterRequest = {
        page: filterValues.page ? Number(filterValues.page) - 1 : 0,
        size: filterValues.pageSize ? Number(filterValues.pageSize) : 20,
        sortBy: 'NEWEST',
      }

      if (debouncedSearchTerm) {
        apiFilters.keyword = String(debouncedSearchTerm)
      }

      if (filterValues.status) {
        apiFilters.status = String(filterValues.status) as NewsStatus
      }

      if (filterValues.category) {
        apiFilters.category = String(filterValues.category) as NewsCategory
      }

      const response = await NewsService.getNewsList(apiFilters)

      if (response.data) {
        setNewsList(response.data.news)
        setStats(response.data.statistics)
        setTotalCount(response.data.totalCount)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      toast.error('Không thể tải danh sách tin tức. Vui lòng thử lại.')
    } finally {
      setInitialLoading(false)
      setTableLoading(false)
    }
  }

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilterValues(newFilters)
  }

  const handlePreview = (news: News) => {
    setSelectedNews(news)
    setPreviewModalOpen(true)
  }

  const handleEdit = (news: News) => {
    router.push(`/news-editor?id=${news.news_id}`)
  }

  const handleCreate = () => {
    router.push('/news-editor')
  }

  const handleDeleteClick = (news: News) => {
    setSelectedNews(news)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedNews) return

    try {
      setDeleteLoading(true)
      const response = await NewsService.deleteNews(selectedNews.news_id)

      if (response.code === '1000') {
        toast.success('Xóa tin tức thành công')
        setDeleteModalOpen(false)
        setSelectedNews(null)
        await fetchNews()
      } else {
        toast.error(response.message || 'Không thể xóa tin tức')
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      toast.error('Không thể xóa tin tức. Vui lòng thử lại.')
    } finally {
      setDeleteLoading(false)
    }
  }

  // Define columns
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
            onClick={() => handlePreview(row)}
            className='h-8 w-8 p-0'
            title='Xem trước'
          >
            <Eye className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleEdit(row)}
            className='h-8 w-8 p-0'
            title='Chỉnh sửa'
          >
            <Edit className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleDeleteClick(row)}
            className='h-8 w-8 p-0 text-red-600 hover:text-red-700'
            title='Xóa'
          >
            <Trash2 className='h-4 w-4' />
          </Button>
        </div>
      ),
    },
  ]

  // Define filters
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
    <div>
      {initialLoading ? (
        <div className='flex items-center justify-center h-64'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Header */}
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4'>
            <div>
              <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
                Quản lý Tin tức
              </h1>
              <p className='mt-1 text-sm text-gray-600'>
                Tạo, chỉnh sửa và quản lý các bài viết tin tức và blog
              </p>
            </div>
            <Button onClick={handleCreate} className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              Tạo tin tức mới
            </Button>
          </div>

          {/* Stats Cards */}
          <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
            <div className='rounded-xl border border-gray-100 bg-white p-4'>
              <div className='text-2xl font-bold text-gray-900'>
                {stats.totalNews}
              </div>
              <div className='mt-1 text-xs text-gray-500'>Tổng tin tức</div>
            </div>
            <div className='rounded-xl border border-gray-100 bg-white p-4'>
              <div className='text-2xl font-bold text-green-600'>
                {stats.totalPublished}
              </div>
              <div className='mt-1 text-xs text-gray-500'>Đã xuất bản</div>
            </div>
            <div className='rounded-xl border border-gray-100 bg-white p-4'>
              <div className='text-2xl font-bold text-yellow-600'>
                {stats.totalDrafts}
              </div>
              <div className='mt-1 text-xs text-gray-500'>Bản nháp</div>
            </div>
            <div className='rounded-xl border border-gray-100 bg-white p-4'>
              <div className='text-2xl font-bold text-gray-600'>
                {stats.totalArchived}
              </div>
              <div className='mt-1 text-xs text-gray-500'>Lưu trữ</div>
            </div>
            <div className='rounded-xl border border-gray-100 bg-white p-4'>
              <div className='text-2xl font-bold text-purple-600'>
                {stats.totalBlogs}
              </div>
              <div className='mt-1 text-xs text-gray-500'>Blog</div>
            </div>
          </div>

          {/* DataTable */}
          <DataTable
            data={newsList}
            columns={columns}
            filters={filters}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            totalItems={totalCount}
            loading={tableLoading}
          />

          {/* Preview Modal */}
          <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
            <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Xem trước tin tức</DialogTitle>
              </DialogHeader>
              {selectedNews && (
                <div className='space-y-4'>
                  {/* Thumbnail */}
                  {selectedNews.thumbnail_url && (
                    <div className='relative w-full h-64 rounded-lg overflow-hidden bg-gray-100'>
                      <Image
                        src={selectedNews.thumbnail_url}
                        alt={selectedNews.title}
                        fill
                        className='object-cover'
                      />
                    </div>
                  )}

                  {/* Title */}
                  <h2 className='text-2xl font-bold text-gray-900'>
                    {selectedNews.title}
                  </h2>

                  {/* Meta info */}
                  <div className='flex flex-wrap gap-3 text-sm text-gray-600'>
                    <div className='flex items-center gap-1'>
                      <User className='h-4 w-4' />
                      {selectedNews.author_name || 'N/A'}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      {formatDateTime(selectedNews.created_at)}
                    </div>
                    <div className='flex items-center gap-1'>
                      <Eye className='h-4 w-4' />
                      {selectedNews.view_count.toLocaleString()} lượt xem
                    </div>
                  </div>

                  {/* Badges */}
                  <div className='flex gap-2'>
                    <Badge
                      variant='outline'
                      className={getCategoryColor(selectedNews.category)}
                    >
                      {selectedNews.category === 'NEWS' ? 'Tin tức' : 'Blog'}
                    </Badge>
                    <Badge
                      variant='outline'
                      className={getStatusColor(selectedNews.status)}
                    >
                      {selectedNews.status === 'DRAFT'
                        ? 'Bản nháp'
                        : selectedNews.status === 'PUBLISHED'
                          ? 'Đã xuất bản'
                          : 'Lưu trữ'}
                    </Badge>
                  </div>

                  {/* Summary */}
                  {selectedNews.summary && (
                    <div className='p-4 bg-gray-50 rounded-lg'>
                      <p className='text-sm italic text-gray-700'>
                        {selectedNews.summary}
                      </p>
                    </div>
                  )}

                  {/* Content */}
                  <div
                    className='prose prose-sm max-w-none'
                    dangerouslySetInnerHTML={{ __html: selectedNews.content }}
                  />

                  {/* Tags */}
                  {selectedNews.tags && (
                    <div className='flex items-center gap-2 flex-wrap'>
                      <Tag className='h-4 w-4 text-gray-500' />
                      {selectedNews.tags.split(',').map((tag, index) => (
                        <Badge
                          key={index}
                          variant='outline'
                          className='text-xs'
                        >
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* SEO Info */}
                  {(selectedNews.meta_title ||
                    selectedNews.meta_description ||
                    selectedNews.meta_keywords) && (
                    <div className='border-t pt-4'>
                      <h3 className='font-semibold text-sm text-gray-900 mb-2'>
                        SEO Metadata
                      </h3>
                      <div className='space-y-2 text-sm'>
                        {selectedNews.meta_title && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Meta Title:
                            </span>{' '}
                            {selectedNews.meta_title}
                          </div>
                        )}
                        {selectedNews.meta_description && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Meta Description:
                            </span>{' '}
                            {selectedNews.meta_description}
                          </div>
                        )}
                        {selectedNews.meta_keywords && (
                          <div>
                            <span className='font-medium text-gray-700'>
                              Meta Keywords:
                            </span>{' '}
                            {selectedNews.meta_keywords}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Delete Confirmation Modal */}
          <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa</DialogTitle>
              </DialogHeader>
              <div className='space-y-4'>
                <p className='text-sm text-gray-600'>
                  Bạn có chắc chắn muốn xóa tin tức "{selectedNews?.title}"?
                  Hành động này không thể hoàn tác.
                </p>
                <div className='flex justify-end gap-3'>
                  <Button
                    variant='outline'
                    onClick={() => setDeleteModalOpen(false)}
                    disabled={deleteLoading}
                  >
                    Hủy
                  </Button>
                  <Button
                    variant='destructive'
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                  >
                    {deleteLoading && (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    )}
                    Xóa
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

NewsManagement.getLayout = (page: React.ReactNode) => (
  <AdminLayout>{page}</AdminLayout>
)

export default NewsManagement
