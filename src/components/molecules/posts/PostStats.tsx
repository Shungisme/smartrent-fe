import React from 'react'
import { ListingStatisticsSummary } from '@/api/types/listing.type'
import { useTranslations } from 'next-intl'

interface PostStatsProps {
  stats: ListingStatisticsSummary
  totalPosts: number
}

export const PostStats: React.FC<PostStatsProps> = ({ stats, totalPosts }) => {
  const t = useTranslations('posts')

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <div className='rounded-xl border border-gray-100 bg-white p-6'>
        <div className='text-2xl font-bold text-gray-900'>{totalPosts}</div>
        <div className='mt-1 text-sm text-gray-400'>{t('stats.total')}</div>
      </div>

      <div className='rounded-xl border border-gray-100 bg-white p-6'>
        <div className='text-2xl font-bold text-yellow-600'>
          {stats.pendingVerification}
        </div>
        <div className='mt-1 text-sm text-gray-400'>{t('stats.pending')}</div>
      </div>

      <div className='rounded-xl border border-gray-100 bg-white p-6'>
        <div className='text-2xl font-bold text-green-600'>
          {stats.verified}
        </div>
        <div className='mt-1 text-sm text-gray-400'>{t('stats.approved')}</div>
      </div>

      <div className='rounded-xl border border-gray-100 bg-white p-6'>
        <div className='text-2xl font-bold text-red-600'>{stats.expired}</div>
        <div className='mt-1 text-sm text-gray-400'>{t('stats.rejected')}</div>
      </div>
    </div>
  )
}
