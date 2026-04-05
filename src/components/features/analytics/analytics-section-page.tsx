'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/atoms/select'
import OverviewTab from '@/components/molecules/overviewTab'
import UsersTab from '@/components/molecules/usersTab'
import PostsTab from '@/components/molecules/postsTab'
import RevenueTabAnalytics from '@/components/molecules/revenueTabAnalytics'
import ReportsTab from '@/components/molecules/reportsTab'
import type { TimeRange } from '@/data/analyticsData'

export type AnalyticsSection =
  | 'overview'
  | 'users'
  | 'posts'
  | 'revenue'
  | 'reports'

type AnalyticsSectionPageProps = {
  section: AnalyticsSection
}

const AnalyticsSectionPage: React.FC<AnalyticsSectionPageProps> = ({
  section,
}) => {
  const t = useTranslations('admin.analytics')
  const [timeRange, setTimeRange] = useState<TimeRange>('month')

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-3 sm:flex-row'>
        <Select
          value={timeRange}
          onValueChange={(value) => setTimeRange(value as TimeRange)}
        >
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder={t('filters.timeRange.label')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='today'>
              {t('filters.timeRange.today')}
            </SelectItem>
            <SelectItem value='week'>{t('filters.timeRange.week')}</SelectItem>
            <SelectItem value='month'>
              {t('filters.timeRange.month')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {section === 'overview' && <OverviewTab timeRange={timeRange} />}
      {section === 'users' && <UsersTab timeRange={timeRange} />}
      {section === 'posts' && <PostsTab timeRange={timeRange} />}
      {section === 'revenue' && <RevenueTabAnalytics timeRange={timeRange} />}
      {section === 'reports' && <ReportsTab timeRange={timeRange} />}
    </div>
  )
}

export default AnalyticsSectionPage
