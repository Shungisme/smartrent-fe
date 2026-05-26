import React from 'react'
import { Card } from '@/components/atoms/card'
import { Crown, Layers } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PremiumOverviewStats } from '@/types/premium.type'

interface PremiumStatsProps {
  stats: PremiumOverviewStats
}

export const PremiumStats: React.FC<PremiumStatsProps> = ({ stats }) => {
  const t = useTranslations('premium')

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
      <Card className='p-6'>
        <div className='flex items-start justify-between'>
          <div>
            <div className='text-sm text-muted-foreground'>
              {t('overview.activeMemberships')}
            </div>
            <div className='mt-2 text-3xl font-bold text-foreground'>
              {stats.activeMemberships}
            </div>
            <div className='mt-1 text-xs text-muted-foreground'>
              {t('overview.packagesRunning')}
            </div>
          </div>
          <div className='rounded-lg bg-primary/10 p-3 dark:bg-primary/20'>
            <Crown className='h-6 w-6 text-primary' />
          </div>
        </div>
      </Card>

      <Card className='p-6'>
        <div className='flex items-start justify-between'>
          <div>
            <div className='text-sm text-muted-foreground'>
              {t('overview.listingTypes')}
            </div>
            <div className='mt-2 text-3xl font-bold text-foreground'>
              {stats.listingTypes}
            </div>
            <div className='mt-1 text-xs text-muted-foreground'>
              {t('overview.regularVipTiers')}
            </div>
          </div>
          <div className='rounded-lg bg-chart-1/10 p-3 dark:bg-chart-1/20'>
            <Layers className='h-6 w-6 text-chart-1' />
          </div>
        </div>
      </Card>
    </div>
  )
}
