'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { useDebounce } from '@/hooks/useDebounce'
import { Button } from '@/components/atoms/button'
import { Plus, Loader2 } from 'lucide-react'
import { NewsService } from '@/api/services/news.service'
import {
  NewsStatus,
  NewsCategory,
  NewsFilterRequest,
  NewsStatistics,
  NewsSummaryResponse,
  NewsResponse,
} from '@/api/types/news.type'
import { NewsStats } from '@/components/organisms/news/NewsStats'
import { NewsTable } from '@/components/organisms/news/NewsTable'
import { NewsPreviewModal } from '@/components/organisms/news/NewsPreviewModal'
import { NewsDeleteModal } from '@/components/organisms/news/NewsDeleteModal'

const SUCCESS_CODE = '999999'

const NewsManagement = () => {
  const router = useRouter()
  const t = useTranslations('news')

  const [newsList, setNewsList] = useState<NewsSummaryResponse[]>([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [tableLoading, setTableLoading] = useState(false)
  const [selectedNews, setSelectedNews] = useState<NewsSummaryResponse | null>(
    null,
  )
  const [previewNews, setPreviewNews] = useState<NewsResponse | null>(null)
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

      const apiFilters: NewsFilterRequest = {
        page: filterValues.page ? Number(filterValues.page) : 1,
        size: filterValues.pageSize ? Number(filterValues.pageSize) : 20,
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
        setTotalCount(response.data.totalItems)

        const totalItems = response.data.totalItems
        const activeStatus = apiFilters.status
        const activeCategory = apiFilters.category

        setStats((prev) => ({
          ...prev,
          totalNews:
            !activeStatus && !activeCategory ? totalItems : prev.totalNews,
          totalPublished:
            activeStatus === 'PUBLISHED' ? totalItems : prev.totalPublished,
          totalDrafts: activeStatus === 'DRAFT' ? totalItems : prev.totalDrafts,
          totalArchived:
            activeStatus === 'ARCHIVED' ? totalItems : prev.totalArchived,
          totalBlogs: activeCategory === 'BLOG' ? totalItems : prev.totalBlogs,
        }))
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

  const handlePreview = async (news: NewsSummaryResponse) => {
    try {
      const response = await NewsService.getNewsById(news.newsId)

      if (response.data) {
        setPreviewNews(response.data)
        setPreviewModalOpen(true)
      }
    } catch (error) {
      console.error('Error fetching news detail:', error)
      toast.error(t('messages.fetchError'))
    }
  }

  const handleEdit = (news: NewsSummaryResponse) => {
    router.push(`/content/news-editor?id=${news.newsId}`)
  }

  const handleCreate = () => {
    router.push('/content/news-editor')
  }

  const handleDeleteClick = (news: NewsSummaryResponse) => {
    setSelectedNews(news)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedNews) return

    try {
      setDeleteLoading(true)
      const response = await NewsService.deleteNews(selectedNews.newsId)

      if (response.code === SUCCESS_CODE) {
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
          <div className='flex items-center justify-end'>
            <Button
              onClick={handleCreate}
              className='w-full sm:w-auto flex items-center justify-center gap-2'
            >
              <Plus className='h-4 w-4' />
              {t('createButton')}
            </Button>
          </div>

          {/* Hidden by request */}
          {false && <NewsStats stats={stats} />}

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

          <NewsPreviewModal
            open={previewModalOpen}
            onOpenChange={setPreviewModalOpen}
            news={previewNews}
          />

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

export default NewsManagement
