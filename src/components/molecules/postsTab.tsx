import React from 'react'
import StatsCard from '@/components/molecules/statsCard'
import LineChartCard from '@/components/molecules/lineChartCard'
import PieChartCard from '@/components/molecules/pieChartCard'
import {
  postActivityData,
  postViewsClicksData,
  postStatusDistribution,
  postStats,
  type TimeRange,
} from '@/data/analyticsData'
import { FileText, Clock, Eye, MousePointerClick } from 'lucide-react'

type PostsTabProps = {
  timeRange: TimeRange
}

const PostsTab: React.FC<PostsTabProps> = ({ timeRange }) => {
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

  const filteredPostData = filterData(postActivityData)
  const filteredViewsData = filterData(postViewsClicksData)

  const totalPosts =
    filteredPostData[filteredPostData.length - 1]?.totalPosts ||
    postStats.totalPosts
  const newPosts = filteredPostData.reduce((sum, d) => sum + d.newPosts, 0)
  const totalViews = filteredViewsData.reduce((sum, d) => sum + d.views, 0)
  const totalClicks = filteredViewsData.reduce((sum, d) => sum + d.clicks, 0)
  const ctr = totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Tổng Bài Đăng'
          value={totalPosts.toLocaleString('vi-VN')}
          subtitle={`+${newPosts} trong kỳ này`}
          icon={<FileText className='h-5 w-5' />}
        />
        <StatsCard
          title='Chờ Duyệt'
          value={postStats.pendingPosts.toString()}
          icon={<Clock className='h-5 w-5' />}
        />
        <StatsCard
          title='Tổng Lượt Xem'
          value={totalViews.toLocaleString('vi-VN')}
          icon={<Eye className='h-5 w-5' />}
        />
        <StatsCard
          title='Lượt Nhấp'
          value={totalClicks.toLocaleString('vi-VN')}
          subtitle={`CTR: ${ctr}%`}
          icon={<MousePointerClick className='h-5 w-5' />}
        />
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
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

        {/* Views & Clicks Chart */}
        <LineChartCard
          title='Lượt Xem & Lượt Nhấp'
          datasets={[
            {
              data: filteredViewsData.map((d) => d.views),
              color: '#3B82F6',
              label: 'Lượt xem',
            },
            {
              data: filteredViewsData.map((d) => d.clicks),
              color: '#F97316',
              label: 'Lượt nhấp',
            },
          ]}
          labels={filteredViewsData.map((d) => d.date)}
          showLegend={true}
        />
      </div>

      {/* Status Distribution */}
      <div className='grid grid-cols-1 gap-6'>
        <PieChartCard
          title='Phân Bố Trạng Thái Bài Đăng'
          data={postStatusDistribution}
          showPercentage={true}
        />
      </div>
    </div>
  )
}

export default PostsTab
