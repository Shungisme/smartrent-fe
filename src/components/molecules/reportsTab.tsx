import React from 'react'
import { useTranslations } from 'next-intl'
import StatsCard from '@/components/molecules/statsCard'
import LineChartCard from '@/components/molecules/lineChartCard'
import PieChartCard from '@/components/molecules/pieChartCard'
import {
  reportsOverTimeData,
  reportTypeDistribution,
  reportStats,
  type TimeRange,
} from '@/data/analyticsData'
import { AlertTriangle, Clock, CheckCircle, Timer } from 'lucide-react'

type ReportsTabProps = {
  timeRange: TimeRange
}

const ReportsTab: React.FC<ReportsTabProps> = ({ timeRange }) => {
  const t = useTranslations('admin.analytics.reports')
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

  const filteredReportsData = filterData(reportsOverTimeData)

  // Translate report type distribution labels
  const translatedReportTypeDistribution = reportTypeDistribution.map(
    (item) => {
      let translatedLabel = item.label
      if (item.label === 'Spam/Trùng lặp')
        translatedLabel = tOverview('reportTypes.spam')
      else if (item.label === 'Nội dung không phù hợp')
        translatedLabel = tOverview('reportTypes.inappropriate')
      else if (item.label === 'Tin đăng giả')
        translatedLabel = tOverview('reportTypes.fake')
      else if (item.label === 'Vấn đề giá cả')
        translatedLabel = tOverview('reportTypes.pricing')
      else if (item.label === 'Khác')
        translatedLabel = tOverview('reportTypes.other')
      return { ...item, label: translatedLabel }
    },
  )

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title={t('stats.totalReports')}
          value={reportStats.totalReports.toString()}
          icon={<AlertTriangle className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.pending')}
          value={reportStats.pendingReports.toString()}
          badge={{
            text: t('stats.needsAction'),
            variant: 'warning',
          }}
          icon={<Clock className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.resolved')}
          value={reportStats.resolvedReports.toString()}
          subtitle={`${reportStats.resolvedPercentage}% ${t('stats.ofTotal')}`}
          icon={<CheckCircle className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.avgResolutionTime')}
          value={`${reportStats.avgResolutionTime}h`}
          icon={<Timer className='h-5 w-5' />}
        />
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Reports Over Time Chart */}
        <LineChartCard
          title={t('charts.reportsOverTime')}
          datasets={[
            {
              data: filteredReportsData.map((d) => d.reports),
              color: '#F97316',
              label: t('charts.reports'),
            },
          ]}
          labels={filteredReportsData.map((d) => d.date)}
          height='h-80'
          showLegend={false}
        />

        {/* Report Type Distribution */}
        <PieChartCard
          title={t('charts.typeDistribution')}
          data={translatedReportTypeDistribution}
          showPercentage={true}
          height='h-80'
        />
      </div>
    </div>
  )
}

export default ReportsTab
