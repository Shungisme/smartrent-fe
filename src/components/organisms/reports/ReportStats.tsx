import React from 'react'
import { useTranslations } from 'next-intl'

interface ReportStatsProps {
  stats: {
    total: number
    pending: number
    resolved: number
    dismissed: number
  }
}

export const ReportStats: React.FC<ReportStatsProps> = ({ stats }) => {
  const t = useTranslations('reports')

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <div className='rounded-xl border border-gray-100 bg-white p-6'>
        <div className='text-2xl font-bold text-gray-900'>{stats.total}</div>
        <div className='mt-1 text-sm text-gray-400'>{t('stats.total')}</div>
        <div className='mt-2 text-xs text-gray-500'>{t('stats.allTime')}</div>
      </div>
      <div className='rounded-xl border border-gray-100 bg-white p-6'>
        <div className='text-2xl font-bold text-yellow-600'>
          {stats.pending}
        </div>
        <div className='mt-1 text-sm text-gray-400'>{t('stats.pending')}</div>
        <div className='mt-2 text-xs text-gray-500'>
          {t('stats.needAttention')}
        </div>
      </div>
      <div className='rounded-xl border border-gray-100 bg-white p-6'>
        <div className='text-2xl font-bold text-green-600'>
          {stats.resolved}
        </div>
        <div className='mt-1 text-sm text-gray-400'>{t('stats.resolved')}</div>
        <div className='mt-2 text-xs text-gray-500'>
          {t('stats.actionTaken')}
        </div>
      </div>
      <div className='rounded-xl border border-gray-100 bg-white p-6'>
        <div className='text-2xl font-bold text-gray-500'>
          {stats.dismissed}
        </div>
        <div className='mt-1 text-sm text-gray-400'>{t('stats.dismissed')}</div>
        <div className='mt-2 text-xs text-gray-500'>{t('stats.noAction')}</div>
      </div>
    </div>
  )
}
