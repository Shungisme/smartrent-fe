'use client'

import React, { useState } from 'react'
import OverviewTab from '@/components/molecules/overviewTab'
import UsersTab from '@/components/molecules/usersTab'
import PostsTab from '@/components/molecules/postsTab'
import RevenueTabAnalytics from '@/components/molecules/revenueTabAnalytics'
import ReportsTab from '@/components/molecules/reportsTab'
import DateRangePicker, {
  defaultDateRange,
  type DateRangeValue,
} from '@/components/molecules/dateRangePicker'

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
  const [dateRange, setDateRange] = useState<DateRangeValue>(() =>
    defaultDateRange(30),
  )

  return (
    <div className='space-y-6'>
      <div className='flex justify-stretch sm:justify-start'>
        <DateRangePicker value={dateRange} onChange={setDateRange} />
      </div>

      {section === 'overview' && <OverviewTab dateRange={dateRange} />}
      {section === 'users' && <UsersTab dateRange={dateRange} />}
      {section === 'posts' && <PostsTab dateRange={dateRange} />}
      {section === 'revenue' && <RevenueTabAnalytics dateRange={dateRange} />}
      {section === 'reports' && <ReportsTab dateRange={dateRange} />}
    </div>
  )
}

export default AnalyticsSectionPage
