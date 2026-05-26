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
      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-xs'>
        <div className='text-2xl font-bold text-foreground'>{stats.total}</div>
        <div className='mt-1 text-sm text-muted-foreground'>
          {t('stats.total')}
        </div>
      </div>
      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-xs'>
        <div className='text-2xl font-bold text-warning-foreground'>
          {stats.pending}
        </div>
        <div className='mt-1 text-sm text-muted-foreground'>
          {t('stats.pending')}
        </div>
      </div>
      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-xs'>
        <div className='text-2xl font-bold text-success-foreground'>
          {stats.resolved}
        </div>
        <div className='mt-1 text-sm text-muted-foreground'>
          {t('stats.resolved')}
        </div>
      </div>
      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-xs'>
        <div className='text-2xl font-bold text-muted-foreground'>
          {stats.dismissed}
        </div>
        <div className='mt-1 text-sm text-muted-foreground'>
          {t('stats.dismissed')}
        </div>
      </div>
    </div>
  )
}
