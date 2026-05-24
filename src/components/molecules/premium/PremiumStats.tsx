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
            <div className='text-sm text-gray-500'>
              {t('overview.activeMemberships')}
            </div>
            <div className='mt-2 text-3xl font-bold text-gray-900'>
              {stats.activeMemberships}
            </div>
            <div className='mt-1 text-xs text-gray-500'>
              {t('overview.packagesRunning')}
            </div>
          </div>
          <div className='rounded-lg bg-blue-100 p-3'>
            <Crown className='h-6 w-6 text-blue-600' />
          </div>
        </div>
      </Card>

      <Card className='p-6'>
        <div className='flex items-start justify-between'>
          <div>
            <div className='text-sm text-gray-500'>
              {t('overview.listingTypes')}
            </div>
            <div className='mt-2 text-3xl font-bold text-gray-900'>
              {stats.listingTypes}
            </div>
            <div className='mt-1 text-xs text-gray-500'>
              {t('overview.regularVipTiers')}
            </div>
          </div>
          <div className='rounded-lg bg-purple-100 p-3'>
            <Layers className='h-6 w-6 text-purple-600' />
          </div>
        </div>
      </Card>
    </div>
  )
}
