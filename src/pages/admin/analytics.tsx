import React, { useState } from 'react'
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
  const [timeRange, setTimeRange] = useState<TimeRange>('month')
  const [chartType, setChartType] = useState<ChartType>('line')

  return (
    <div className='space-y-6 p-6'>
      {/* Header */}
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold text-gray-900'>
          Phân Tích Ứng Dụng
        </h1>
        <p className='text-gray-600'>
          Theo dõi hiệu suất nền tảng, sự tương tác của người dùng và các chỉ số
          kinh doanh
        </p>
      </div>

      {/* Tabs with Filters */}
      <Tabs defaultValue='overview' className='space-y-6'>
        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
          {/* Tab Navigation */}
          <TabsList className='w-full md:w-auto'>
            <TabsTrigger value='overview'>Tổng Quan</TabsTrigger>
            <TabsTrigger value='users'>Người Dùng</TabsTrigger>
            <TabsTrigger value='posts'>Bài Đăng</TabsTrigger>
            <TabsTrigger value='revenue'>Doanh Thu</TabsTrigger>
            <TabsTrigger value='reports'>Báo Cáo</TabsTrigger>
          </TabsList>

          {/* Filters */}
          <div className='flex gap-3'>
            {/* Chart Type Selector */}
            <Select
              value={chartType}
              onValueChange={(value) => setChartType(value as ChartType)}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Loại biểu đồ' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='line'>Biểu đồ đường</SelectItem>
                <SelectItem value='bar'>Biểu đồ cột</SelectItem>
                <SelectItem value='area'>Biểu đồ khu vực</SelectItem>
              </SelectContent>
            </Select>

            {/* Time Range Selector */}
            <Select
              value={timeRange}
              onValueChange={(value) => setTimeRange(value as TimeRange)}
            >
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Khoảng thời gian' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='today'>Hôm nay</SelectItem>
                <SelectItem value='week'>Tuần này</SelectItem>
                <SelectItem value='month'>Tháng qua</SelectItem>
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
  )
}

AnalyticsPage.getLayout = (page) => {
  return <AdminLayout activeItem='analytics'>{page}</AdminLayout>
}

export default AnalyticsPage
