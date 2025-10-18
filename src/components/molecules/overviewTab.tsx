import React from 'react'
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

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Tổng Người Dùng'
          value={totalUsers.toLocaleString('vi-VN')}
          subtitle={`+${newUsers} mới trong kỳ`}
          icon={<TrendingUp className='h-5 w-5' />}
        />
        <StatsCard
          title='Tổng Tin Đăng'
          value={totalPosts.toLocaleString('vi-VN')}
          subtitle={`+${newPosts} trong kỳ`}
          icon={<FileText className='h-5 w-5' />}
        />
        <StatsCard
          title='Tổng Lượt Xem'
          value={totalViews.toLocaleString('vi-VN')}
          subtitle={`${totalClicks.toLocaleString('vi-VN')} lượt nhấp`}
          icon={<Eye className='h-5 w-5' />}
        />
        <StatsCard
          title='Doanh Thu'
          value={formatCurrency(totalRevenue)}
          subtitle={`${avgPackagesSold} gói đã bán`}
          icon={<DollarSign className='h-5 w-5' />}
        />
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* User Growth Chart */}
        <LineChartCard
          title='Tăng Trưởng Người Dùng'
          datasets={[
            {
              data: filteredUserData.map((d) => d.newUsers),
              color: '#2563EB',
              label: 'Người dùng mới',
            },
          ]}
          labels={filteredUserData.map((d) => d.date)}
          showLegend={false}
        />

        {/* Post Activity Chart */}
        <LineChartCard
          title='Hoạt Động Bài Đăng'
          datasets={[
            {
              data: filteredPostData.map((d) => d.newPosts),
              color: '#22C55E',
              label: 'Bài đăng mới',
            },
          ]}
          labels={filteredPostData.map((d) => d.date)}
          showLegend={false}
        />

        {/* Revenue Chart */}
        <AreaChartCard
          title='Doanh Thu Theo Thời Gian'
          data={filteredRevenueData.map((d) => d.revenue)}
          labels={filteredRevenueData.map((d) => d.date)}
          color='#6366F1'
          unit='Đơn vị: VNĐ'
        />

        {/* User Type Distribution */}
        <PieChartCard
          title='Phân Bố Loại Người Dùng'
          data={userTypeDistribution}
          showPercentage={true}
        />
      </div>
    </div>
  )
}

export default OverviewTab
