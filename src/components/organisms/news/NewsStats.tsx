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
      <div className='rounded-xl border border-border/70 bg-card p-4 shadow-xs'>
        <div className='text-2xl font-bold text-foreground'>
          {stats.totalNews}
        </div>
        <div className='mt-1 text-xs text-muted-foreground'>
          {t('totalNews')}
        </div>
      </div>
      <div className='rounded-xl border border-border/70 bg-card p-4 shadow-xs'>
        <div className='text-2xl font-bold text-success-foreground'>
          {stats.totalPublished}
        </div>
        <div className='mt-1 text-xs text-muted-foreground'>
          {t('totalPublished')}
        </div>
      </div>
      <div className='rounded-xl border border-border/70 bg-card p-4 shadow-xs'>
        <div className='text-2xl font-bold text-warning-foreground'>
          {stats.totalDrafts}
        </div>
        <div className='mt-1 text-xs text-muted-foreground'>
          {t('totalDrafts')}
        </div>
      </div>
      <div className='rounded-xl border border-border/70 bg-card p-4 shadow-xs'>
        <div className='text-2xl font-bold text-muted-foreground'>
          {stats.totalArchived}
        </div>
        <div className='mt-1 text-xs text-muted-foreground'>
          {t('totalArchived')}
        </div>
      </div>
      <div className='rounded-xl border border-border/70 bg-card p-4 shadow-xs'>
        <div className='text-2xl font-bold text-chart-1'>
          {stats.totalBlogs}
        </div>
        <div className='mt-1 text-xs text-muted-foreground'>
          {t('totalBlogs')}
        </div>
      </div>
    </div>
  )
}
