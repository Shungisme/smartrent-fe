import React from 'react'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations('admin.analytics.posts')
  const tOverview = useTranslations('admin.analytics.overview')
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

  // Translate post status distribution labels
  const translatedPostStatusDistribution = postStatusDistribution.map(
    (item) => {
      let translatedLabel = item.label
      if (item.label === 'Hoạt động')
        translatedLabel = tOverview('postStatus.active')
      else if (item.label === 'Chờ duyệt')
        translatedLabel = tOverview('postStatus.pending')
      else if (item.label === 'Bị từ chối')
        translatedLabel = tOverview('postStatus.rejected')
      return { ...item, label: translatedLabel }
    },
  )

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title={t('stats.totalPosts')}
          value={totalPosts.toLocaleString('vi-VN')}
          subtitle={`+${newPosts} ${t('stats.inThisPeriod')}`}
          icon={<FileText className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.pending')}
          value={postStats.pendingPosts.toString()}
          icon={<Clock className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.totalViews')}
          value={totalViews.toLocaleString('vi-VN')}
          icon={<Eye className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.clicks')}
          value={totalClicks.toLocaleString('vi-VN')}
          subtitle={`CTR: ${ctr}%`}
          icon={<MousePointerClick className='h-5 w-5' />}
        />
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
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

        {/* Views & Clicks Chart */}
        <LineChartCard
          title={t('charts.viewsAndClicks')}
          datasets={[
            {
              data: filteredViewsData.map((d) => d.views),
              color: '#3B82F6',
              label: t('charts.views'),
            },
            {
              data: filteredViewsData.map((d) => d.clicks),
              color: '#F97316',
              label: t('charts.clicks'),
            },
          ]}
          labels={filteredViewsData.map((d) => d.date)}
          showLegend={true}
        />
      </div>

      {/* Status Distribution */}
      <div className='grid grid-cols-1 gap-6'>
        <PieChartCard
          title={t('charts.statusDistribution')}
          data={translatedPostStatusDistribution}
          showPercentage={true}
        />
      </div>
    </div>
  )
}

export default PostsTab
