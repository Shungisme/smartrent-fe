import React from 'react'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/atoms/dialog'
import { Badge } from '@/components/atoms/badge'
import { Calendar, User, Eye, Tag } from 'lucide-react'
import { News, NewsStatus, NewsCategory } from '@/api/types/news.type'

interface NewsPreviewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  news: News | null
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

const formatDateTime = (dateString: string | null): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN')
}

export const NewsPreviewModal: React.FC<NewsPreviewModalProps> = ({
  open,
  onOpenChange,
  news,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-4xl max-h-[80vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Xem trước tin tức</DialogTitle>
        </DialogHeader>
        {news && (
          <div className='space-y-4'>
            {/* Thumbnail */}
            {news.thumbnail_url && (
              <div className='relative w-full h-64 rounded-lg overflow-hidden bg-gray-100'>
                <Image
                  src={news.thumbnail_url}
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
                {news.author_name || 'N/A'}
              </div>
              <div className='flex items-center gap-1'>
                <Calendar className='h-4 w-4' />
                {formatDateTime(news.created_at)}
              </div>
              <div className='flex items-center gap-1'>
                <Eye className='h-4 w-4' />
                {news.view_count.toLocaleString()} lượt xem
              </div>
            </div>

            {/* Badges */}
            <div className='flex gap-2'>
              <Badge
                variant='outline'
                className={getCategoryColor(news.category)}
              >
                {news.category === 'NEWS' ? 'Tin tức' : 'Blog'}
              </Badge>
              <Badge variant='outline' className={getStatusColor(news.status)}>
                {news.status === 'DRAFT'
                  ? 'Bản nháp'
                  : news.status === 'PUBLISHED'
                    ? 'Đã xuất bản'
                    : 'Lưu trữ'}
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
              className='prose prose-sm max-w-none'
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            {/* Tags */}
            {news.tags && (
              <div className='flex items-center gap-2 flex-wrap'>
                <Tag className='h-4 w-4 text-gray-500' />
                {news.tags.split(',').map((tag, index) => (
                  <Badge key={index} variant='outline' className='text-xs'>
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}

            {/* SEO Info */}
            {(news.meta_title ||
              news.meta_description ||
              news.meta_keywords) && (
              <div className='border-t pt-4'>
                <h3 className='font-semibold text-sm text-gray-900 mb-2'>
                  SEO Metadata
                </h3>
                <div className='space-y-2 text-sm'>
                  {news.meta_title && (
                    <div>
                      <span className='font-medium text-gray-700'>
                        Meta Title:
                      </span>{' '}
                      {news.meta_title}
                    </div>
                  )}
                  {news.meta_description && (
                    <div>
                      <span className='font-medium text-gray-700'>
                        Meta Description:
                      </span>{' '}
                      {news.meta_description}
                    </div>
                  )}
                  {news.meta_keywords && (
                    <div>
                      <span className='font-medium text-gray-700'>
                        Meta Keywords:
                      </span>{' '}
                      {news.meta_keywords}
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
