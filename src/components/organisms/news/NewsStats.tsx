import React from 'react'
import { useTranslations } from 'next-intl'
import { NewsStatistics } from '@/api/types/news.type'

interface NewsStatsProps {
  stats: NewsStatistics
}

export const NewsStats: React.FC<NewsStatsProps> = ({ stats }) => {
  const t = useTranslations('news.stats')

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-5'>
      <div className='rounded-xl border border-gray-100 bg-white p-4'>
        <div className='text-2xl font-bold text-gray-900'>
          {stats.totalNews}
        </div>
        <div className='mt-1 text-xs text-gray-500'>{t('totalNews')}</div>
      </div>
      <div className='rounded-xl border border-gray-100 bg-white p-4'>
        <div className='text-2xl font-bold text-green-600'>
          {stats.totalPublished}
        </div>
        <div className='mt-1 text-xs text-gray-500'>{t('totalPublished')}</div>
      </div>
      <div className='rounded-xl border border-gray-100 bg-white p-4'>
        <div className='text-2xl font-bold text-yellow-600'>
          {stats.totalDrafts}
        </div>
        <div className='mt-1 text-xs text-gray-500'>{t('totalDrafts')}</div>
      </div>
      <div className='rounded-xl border border-gray-100 bg-white p-4'>
        <div className='text-2xl font-bold text-gray-600'>
          {stats.totalArchived}
        </div>
        <div className='mt-1 text-xs text-gray-500'>{t('totalArchived')}</div>
      </div>
      <div className='rounded-xl border border-gray-100 bg-white p-4'>
        <div className='text-2xl font-bold text-purple-600'>
          {stats.totalBlogs}
        </div>
        <div className='mt-1 text-xs text-gray-500'>{t('totalBlogs')}</div>
      </div>
    </div>
  )
}
