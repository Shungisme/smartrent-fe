'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Button } from '@/components/atoms/button'
import { Plus, Loader2 } from 'lucide-react'
import { NewsService } from '@/api/services/news.service'
import {
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

  useEffect(() => {
    fetchNews()
  }, [filterValues])

  const fetchNews = async () => {
    try {
      if (initialLoading) {
        setInitialLoading(true)
      } else {
        setTableLoading(true)
      }

      // Build filter array from filterValues
      const filterArray: string[] = []

      if (filterValues.title) {
        filterArray.push(`title:${filterValues.title}`)
      }
      if (filterValues.summary) {
        filterArray.push(`summary:${filterValues.summary}`)
      }
      if (filterValues.status) {
        filterArray.push(`status:${filterValues.status}`)
      }
      if (filterValues.category) {
        filterArray.push(`category:${filterValues.category}`)
      }
      if (filterValues.tag) {
        filterArray.push(`tag:${filterValues.tag}`)
      }

      const apiFilters: NewsFilterRequest = {
        page: filterValues.page ? Number(filterValues.page) : 1,
        size: filterValues.pageSize ? Number(filterValues.pageSize) : 20,
        filter: filterArray.length > 0 ? filterArray : undefined,
      }

      const response = await NewsService.getNewsList(apiFilters)

      if (response.data) {
        setNewsList(response.data.news)
        setTotalCount(response.data.totalItems)

        const totalItems = response.data.totalItems
        const activeStatus = filterArray.find((f) => f.startsWith('status:'))
        const activeCategory = filterArray.find((f) =>
          f.startsWith('category:'),
        )

        setStats((prev) => ({
          ...prev,
          totalNews:
            !activeStatus && !activeCategory ? totalItems : prev.totalNews,
          totalPublished: activeStatus?.includes('PUBLISHED')
            ? totalItems
            : prev.totalPublished,
          totalDrafts: activeStatus?.includes('DRAFT')
            ? totalItems
            : prev.totalDrafts,
          totalArchived: activeStatus?.includes('ARCHIVED')
            ? totalItems
            : prev.totalArchived,
          totalBlogs: activeCategory?.includes('BLOG')
            ? totalItems
            : prev.totalBlogs,
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
    setFilterValues((prev) => ({
      ...newFilters,
      page: (newFilters.page as number | undefined) ?? 1,
      pageSize:
        (newFilters.pageSize as number | undefined) ?? prev.pageSize ?? 20,
    }))
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
          <div className='flex items-center justify-stretch sm:justify-end'>
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
