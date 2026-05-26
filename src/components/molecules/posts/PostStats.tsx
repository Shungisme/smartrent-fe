import React from 'react'
import { ListingStatisticsSummary } from '@/api/types/listing.type'
import { useTranslations } from 'next-intl'

interface PostStatsProps {
  stats: ListingStatisticsSummary
}

export const PostStats: React.FC<PostStatsProps> = ({ stats }) => {
  const t = useTranslations('posts')

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-xs'>
        <div className='text-2xl font-bold text-foreground'>
          {stats.totalListings ?? 0}
        </div>
        <div className='mt-1 text-sm text-muted-foreground'>
          {t('stats.total')}
        </div>
      </div>

      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-xs'>
        <div className='text-2xl font-bold text-warning-foreground'>
          {stats.pendingVerification}
        </div>
        <div className='mt-1 text-sm text-muted-foreground'>
          {t('stats.pending')}
        </div>
      </div>

      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-xs'>
        <div className='text-2xl font-bold text-success-foreground'>
          {stats.verified}
        </div>
        <div className='mt-1 text-sm text-muted-foreground'>
          {t('stats.approved')}
        </div>
      </div>

      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-xs'>
        <div className='text-2xl font-bold text-destructive'>
          {stats.expired}
        </div>
        <div className='mt-1 text-sm text-muted-foreground'>
          {t('stats.rejected')}
        </div>
      </div>
    </div>
  )
}
