import React from 'react'
import { NewsStatistics } from '@/api/types/news.type'

interface NewsStatsProps {
  stats: NewsStatistics
}

export const NewsStats: React.FC<NewsStatsProps> = ({ stats }) => {
  return (
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
  )
}
