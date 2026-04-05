import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Badge } from '@/components/atoms/badge'
import { Calendar, User, Eye, Tag } from 'lucide-react'
import { NewsResponse, NewsStatus, NewsCategory } from '@/api/types/news.type'

interface NewsPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  news: NewsResponse | null
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

const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN')
}

const isValidImageSrc = (src: unknown): src is string => {
  if (typeof src !== 'string') return false
  const normalized = src.trim()
  return normalized.startsWith('/') || /^https?:\/\//i.test(normalized)
}

export const NewsPreviewModal: React.FC<NewsPreviewModalProps> = ({
  open,
  onOpenChange,
  news,
}) => {
  const t = useTranslations('news')

  const safeThumbnailSrc = isValidImageSrc(news?.thumbnailUrl)
    ? news.thumbnailUrl
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{t('previewModal.title')}</DialogTitle>
        </DialogHeader>
        {news && (
          <div className='space-y-4'>
            {/* Thumbnail */}
            {safeThumbnailSrc && (
              <div className='relative w-full h-64 rounded-lg overflow-hidden bg-gray-100'>
                <Image
                  src={safeThumbnailSrc}
                  alt={news.title}
                  fill
                  className='object-cover'
                />
              </div>
            )}

            {/* Title */}
            <h2 className='text-2xl font-bold text-gray-900'>{news.title}</h2>

            {/* Meta info */}
            <div className='flex flex-wrap gap-3 text-sm text-gray-600'>
              <div className='flex items-center gap-1'>
                <User className='h-4 w-4' />
                {news.authorName || t('notAvailable')}
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                {formatDateTime(news.createdAt)}
              </div>
              <div className='flex items-center gap-1'>
                <Eye className='h-4 w-4' />
                {news.viewCount.toLocaleString()} {t('table.views')}
              </div>
            </div>

            {/* Badges */}
            <div className='flex gap-2'>
              <Badge
                variant='outline'
                className={getCategoryColor(news.category)}
              >
                {t(`category.${news.category}`)}
              </Badge>
              <Badge variant='outline' className={getStatusColor(news.status)}>
                {t(`status.${news.status}`)}
              </Badge>
            </div>

            {/* Summary */}
            {news.summary && (
              <div className='p-4 bg-gray-50 rounded-lg'>
                <p className='text-sm italic text-gray-700'>{news.summary}</p>
              </div>
            )}

            {/* Content */}
            <div
              className='news-editor-preview prose prose-sm max-w-none'
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            {/* Tags */}
            {news.tags && (
              <div className='flex items-center gap-2 flex-wrap'>
                <Tag className='h-4 w-4 text-gray-500' />
                {news.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant='outline' className='text-xs'>
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}

            {/* SEO Info */}
            {(news.metaTitle || news.metaDescription || news.metaKeywords) && (
              <div className='border-t pt-4'>
                <h3 className='font-semibold text-sm text-gray-900 mb-2'>
                  {t('previewModal.seoTitle')}
                </h3>
                <div className='space-y-2 text-sm'>
                  {news.metaTitle && (
                    <div>
                      <span className='font-medium text-gray-700'>
                        {t('previewModal.metaTitleLabel')}:
                      </span>{' '}
                      {news.metaTitle}
                    </div>
                  )}
                  {news.metaDescription && (
                    <div>
                      <span className='font-medium text-gray-700'>
                        {t('previewModal.metaDescriptionLabel')}:
                      </span>{' '}
                      {news.metaDescription}
                    </div>
                  )}
                  {news.metaKeywords && (
                    <div>
                      <span className='font-medium text-gray-700'>
                        {t('previewModal.metaKeywordsLabel')}:
                      </span>{' '}
                      {news.metaKeywords}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
