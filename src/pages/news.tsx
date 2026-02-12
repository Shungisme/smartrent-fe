import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import AdminLayout from '@/components/layouts/AdminLayout'
import { Button } from '@/components/atoms/button'
import { Plus, Loader2 } from 'lucide-react'
import { NewsService } from '@/api/services/news.service'
import {
  News,
  NewsStatus,
  NewsCategory,
  NewsFilterRequest,
  NewsStatistics,
} from '@/api/types/news.type'
import { NewsStats } from '@/components/organisms/news/NewsStats'
import { NewsTable } from '@/components/organisms/news/NewsTable'
import { NewsPreviewModal } from '@/components/organisms/news/NewsPreviewModal'
import { NewsDeleteModal } from '@/components/organisms/news/NewsDeleteModal'
import { NextPageWithLayout } from '@/types/next-page'

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
      toast.error(t('messages.fetchError'))
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
        toast.success(t('messages.deleteSuccess'))
        setDeleteModalOpen(false)
        setSelectedNews(null)
        await fetchNews()
      } else {
        toast.error(response.message || t('messages.deleteError'))
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      toast.error(t('messages.deleteError'))
    } finally {
      setDeleteLoading(false)
    }
  }

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
                {t('title')}
              </h1>
              <p className='mt-1 text-sm text-gray-600'>{t('subtitle')}</p>
            </div>
            <Button onClick={handleCreate} className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              {t('createButton')}
            </Button>
          </div>

          {/* Stats Cards */}
          <NewsStats stats={stats} />

          {/* DataTable */}
          <NewsTable
            data={newsList}
            totalItems={totalCount}
            loading={tableLoading}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            onPreview={handlePreview}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {/* Preview Modal */}
          <NewsPreviewModal
            open={previewModalOpen}
            onOpenChange={setPreviewModalOpen}
            news={selectedNews}
          />

          {/* Delete Confirmation Modal */}
          <NewsDeleteModal
            open={deleteModalOpen}
            onOpenChange={setDeleteModalOpen}
            news={selectedNews}
            loading={deleteLoading}
            onConfirm={handleDeleteConfirm}
          />
        </div>
      )}
    </div>
  )
}

NewsManagement.getLayout = (page: React.ReactNode) => (
  <AdminLayout activeItem='news'>{page}</AdminLayout>
)

export default NewsManagement
