import React from 'react'
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

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Tổng Báo Cáo'
          value={reportStats.totalReports.toString()}
          icon={<AlertTriangle className='h-5 w-5' />}
        />
        <StatsCard
          title='Chờ Xử Lý'
          value={reportStats.pendingReports.toString()}
          badge={{
            text: 'Cần xử lý',
            variant: 'warning',
          }}
          icon={<Clock className='h-5 w-5' />}
        />
        <StatsCard
          title='Đã Giải Quyết'
          value={reportStats.resolvedReports.toString()}
          subtitle={`${reportStats.resolvedPercentage}% tổng số`}
          icon={<CheckCircle className='h-5 w-5' />}
        />
        <StatsCard
          title='Thời Gian Xử Lý TB'
          value={`${reportStats.avgResolutionTime}h`}
          icon={<Timer className='h-5 w-5' />}
        />
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Reports Over Time Chart */}
        <LineChartCard
          title='Số Lượng Báo Cáo Theo Thời Gian'
          datasets={[
            {
              data: filteredReportsData.map((d) => d.reports),
              color: '#F97316',
              label: 'Báo cáo',
            },
          ]}
          labels={filteredReportsData.map((d) => d.date)}
          height='h-80'
          showLegend={false}
        />

        {/* Report Type Distribution */}
        <PieChartCard
          title='Phân Loại Báo Cáo Vi Phạm'
          data={reportTypeDistribution}
          showPercentage={true}
          height='h-80'
        />
      </div>
    </div>
  )
}

export default ReportsTab
