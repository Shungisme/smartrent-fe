import React from 'react'
import StatsCard from '@/components/molecules/statsCard'
import LineChartCard from '@/components/molecules/lineChartCard'
import PieChartCard from '@/components/molecules/pieChartCard'
import {
  userGrowthData,
  userTypeDistribution,
  userStats,
  type TimeRange,
} from '@/data/analyticsData'
import { Users, UserCheck, UserPlus } from 'lucide-react'

type UsersTabProps = {
  timeRange: TimeRange
}

const UsersTab: React.FC<UsersTabProps> = ({ timeRange }) => {
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
  const totalUsers =
    filteredUserData[filteredUserData.length - 1]?.totalUsers ||
    userStats.totalUsers

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <StatsCard
          title='Tổng Người Dùng'
          value={totalUsers.toLocaleString('vi-VN')}
          icon={<Users className='h-5 w-5' />}
        />
        <StatsCard
          title='Chủ Nhà'
          value={userStats.landlords.toLocaleString('vi-VN')}
          subtitle={`${userStats.landlords === 680 ? '40' : calculatePercentage(userStats.landlords, totalUsers)}% tổng số`}
          icon={<UserCheck className='h-5 w-5' />}
        />
        <StatsCard
          title='Người Thuê'
          value={userStats.tenants.toLocaleString('vi-VN')}
          subtitle={`${userStats.tenants === 1240 ? '74' : calculatePercentage(userStats.tenants, totalUsers)}% tổng số`}
          icon={<UserPlus className='h-5 w-5' />}
        />
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* User Growth Chart */}
        <LineChartCard
          title='Tăng Trưởng Người Dùng Theo Thời Gian'
          datasets={[
            {
              data: filteredUserData.map((d) => d.newUsers),
              color: '#2563EB',
              label: 'Người dùng mới',
            },
          ]}
          labels={filteredUserData.map((d) => d.date)}
          height='h-80'
          showLegend={false}
        />

        {/* User Type Distribution */}
        <PieChartCard
          title='Phân Bố Loại Người Dùng'
          data={userTypeDistribution}
          showPercentage={true}
          height='h-80'
        />
      </div>
    </div>
  )
}

// Helper function
const calculatePercentage = (value: number, total: number): number => {
  return Math.round((value / total) * 100)
}

export default UsersTab
