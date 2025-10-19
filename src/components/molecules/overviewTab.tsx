import React from 'react'
import { useTranslations } from 'next-intl'
import StatsCard from '@/components/molecules/statsCard'
import LineChartCard from '@/components/molecules/lineChartCard'
import AreaChartCard from '@/components/molecules/areaChartCard'
import PieChartCard from '@/components/molecules/pieChartCard'
import {
  userGrowthData,
  userTypeDistribution,
  postActivityData,
  revenueOverTimeData,
  formatCurrency,
  type TimeRange,
} from '@/data/analyticsData'
import { TrendingUp, FileText, Eye, DollarSign } from 'lucide-react'

type OverviewTabProps = {
  timeRange: TimeRange
}

const OverviewTab: React.FC<OverviewTabProps> = ({ timeRange }) => {
  const t = useTranslations('admin.analytics.overview')
  // Filter data based on time range
  const filterData = <T extends { date: string }>(data: T[]): T[] => {
    switch (timeRange) {
      case 'today':
        return data.slice(-1)
      case 'week':
        return data.slice(-7)
      case 'month':
      default:
        return data
    }
  }

  const filteredUserData = filterData(userGrowthData)
  const filteredPostData = filterData(postActivityData)
  const filteredRevenueData = filterData(revenueOverTimeData)

  // Calculate stats
  const totalUsers =
    filteredUserData[filteredUserData.length - 1]?.totalUsers || 0
  const newUsers = filteredUserData.reduce((sum, d) => sum + d.newUsers, 0)
  const totalPosts =
    filteredPostData[filteredPostData.length - 1]?.totalPosts || 0
  const newPosts = filteredPostData.reduce((sum, d) => sum + d.newPosts, 0)

  // Calculate total views and clicks from post data (simulated)
  const totalViews = filteredPostData.reduce(
    (sum, d) => sum + d.newPosts * 13,
    0,
  )
  const totalClicks = Math.round(totalViews * 0.21)

  const totalRevenue = filteredRevenueData.reduce(
    (sum, d) => sum + d.revenue,
    0,
  )
  const avgPackagesSold = Math.round(filteredRevenueData.length * 4.8)

  // Translate user type distribution labels
  const translatedUserTypeDistribution = userTypeDistribution.map((item) => ({
    ...item,
    label:
      item.label === 'Chủ Nhà'
        ? t('userTypes.landlord')
        : t('userTypes.tenant'),
  }))

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title={t('stats.totalUsers')}
          value={totalUsers.toLocaleString('vi-VN')}
          subtitle={`+${newUsers} ${t('stats.newInPeriod')}`}
          icon={<TrendingUp className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.totalPosts')}
          value={totalPosts.toLocaleString('vi-VN')}
          subtitle={`+${newPosts} ${t('stats.inPeriod')}`}
          icon={<FileText className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.totalViews')}
          value={totalViews.toLocaleString('vi-VN')}
          subtitle={`${totalClicks.toLocaleString('vi-VN')} ${t('stats.clicks')}`}
          icon={<Eye className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.revenue')}
          value={formatCurrency(totalRevenue)}
          subtitle={`${avgPackagesSold} ${t('stats.packagesSold')}`}
          icon={<DollarSign className='h-5 w-5' />}
        />
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* User Growth Chart */}
        <LineChartCard
          title={t('charts.userGrowth')}
          datasets={[
            {
              data: filteredUserData.map((d) => d.newUsers),
              color: '#2563EB',
              label: t('charts.newUsers'),
            },
          ]}
          labels={filteredUserData.map((d) => d.date)}
          showLegend={false}
        />

        {/* Post Activity Chart */}
        <LineChartCard
          title={t('charts.postActivity')}
          datasets={[
            {
              data: filteredPostData.map((d) => d.newPosts),
              color: '#22C55E',
              label: t('charts.newPosts'),
            },
          ]}
          labels={filteredPostData.map((d) => d.date)}
          showLegend={false}
        />

        {/* Revenue Chart */}
        <AreaChartCard
          title={t('charts.revenueOverTime')}
          data={filteredRevenueData.map((d) => d.revenue)}
          labels={filteredRevenueData.map((d) => d.date)}
          color='#6366F1'
          unit={t('charts.unit')}
        />

        {/* User Type Distribution */}
        <PieChartCard
          title={t('charts.userTypeDistribution')}
          data={translatedUserTypeDistribution}
          showPercentage={true}
        />
      </div>
    </div>
  )
}

export default OverviewTab
