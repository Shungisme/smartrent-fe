import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import AdminLayout from '@/components/layouts/AdminLayout'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/atoms/tabs'
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
import type { TimeRange, ChartType } from '@/data/analyticsData'
import type { NextPageWithLayout } from '@/types/next-page'

const AnalyticsPage: NextPageWithLayout = () => {
  const t = useTranslations('admin.analytics')
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const [chartType, setChartType] = useState<ChartType>('line')

  return (
    <div>
      <div className='space-y-6'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              {t('title')}
            </h1>
            <p className='mt-1 text-sm text-gray-600'>{t('subtitle')}</p>
          </div>
        </div>

        {/* Tabs with Filters */}
        <Tabs defaultValue='overview' className='space-y-6'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
            {/* Tab Navigation */}
            <div className='overflow-x-auto'>
              <TabsList className='inline-flex w-auto min-w-full md:w-auto'>
                <TabsTrigger value='overview' className='flex-shrink-0'>
                  {t('tabs.overview')}
                </TabsTrigger>
                <TabsTrigger value='users' className='flex-shrink-0'>
                  {t('tabs.users')}
                </TabsTrigger>
                <TabsTrigger value='posts' className='flex-shrink-0'>
                  {t('tabs.posts')}
                </TabsTrigger>
                <TabsTrigger value='revenue' className='flex-shrink-0'>
                  {t('tabs.revenue')}
                </TabsTrigger>
                <TabsTrigger value='reports' className='flex-shrink-0'>
                  {t('tabs.reports')}
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Filters */}
            <div className='flex flex-col sm:flex-row gap-3'>
              {/* Chart Type Selector */}
              <Select
                value={chartType}
                onValueChange={(value) => setChartType(value as ChartType)}
              >
                <SelectTrigger className='w-full sm:w-[180px]'>
                  <SelectValue placeholder={t('filters.chartType.label')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='line'>
                    {t('filters.chartType.line')}
                  </SelectItem>
                  <SelectItem value='bar'>
                    {t('filters.chartType.bar')}
                  </SelectItem>
                  <SelectItem value='area'>
                    {t('filters.chartType.area')}
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Time Range Selector */}
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
                  <SelectItem value='week'>
                    {t('filters.timeRange.week')}
                  </SelectItem>
                  <SelectItem value='month'>
                    {t('filters.timeRange.month')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tab Content */}
          <TabsContent value='overview' className='space-y-6'>
            <OverviewTab timeRange={timeRange} />
          </TabsContent>

          <TabsContent value='users' className='space-y-6'>
            <UsersTab timeRange={timeRange} />
          </TabsContent>

          <TabsContent value='posts' className='space-y-6'>
            <PostsTab timeRange={timeRange} />
          </TabsContent>

          <TabsContent value='revenue' className='space-y-6'>
            <RevenueTabAnalytics timeRange={timeRange} />
          </TabsContent>

          <TabsContent value='reports' className='space-y-6'>
            <ReportsTab timeRange={timeRange} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

AnalyticsPage.getLayout = (page) => {
  return <AdminLayout activeItem='analytics'>{page}</AdminLayout>
}

export default AnalyticsPage
