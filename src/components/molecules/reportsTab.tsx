import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import StatsCard from '@/components/molecules/statsCard'
import LineChartCard from '@/components/molecules/lineChartCard'
import { DashboardService } from '@/api/services/dashboard.service'
import { type TimeRange } from '@/data/analyticsData'
import { AlertTriangle, Loader2 } from 'lucide-react'

type ReportsTabProps = {
  timeRange: TimeRange
}

const ReportsTab: React.FC<ReportsTabProps> = ({ timeRange }) => {
  const t = useTranslations('admin.analytics.reports')
  const tRevenue = useTranslations('admin.analytics.revenue')

  const [loading, setLoading] = useState(true)
  const [data, setData] =
    useState<
      Awaited<ReturnType<typeof DashboardService.getReportCount>>['data']
    >(null)

  const mapTimeRangeToDays = (range: TimeRange): number => {
    if (range === 'month') return 30
    return 7
  }

  const formatXLabel = (label: string, granularity: 'DAY' | 'MONTH') => {
    if (granularity === 'MONTH') {
      const [year, month] = label.split('-')
      return `T${month}/${year}`
    }
    return label.length > 5 ? label.slice(5) : label
  }

  useEffect(() => {
    const fetchReportCount = async () => {
      try {
        setLoading(true)
        const days = mapTimeRangeToDays(timeRange)
        const response = await DashboardService.getReportCount(days)

        if (!response.success || !response.data) {
          throw new Error(
            response.message || tRevenue('messages.defaultFetchError'),
          )
        }

        setData(response.data)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : tRevenue('messages.defaultFetchError')
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    fetchReportCount()
  }, [timeRange, tRevenue])

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <StatsCard
          title={t('stats.totalReports')}
          value={(data?.total || 0).toLocaleString('vi-VN')}
          icon={<AlertTriangle className='h-5 w-5' />}
        />
        <StatsCard
          title={t('charts.reports')}
          value={(data?.dataPoints.length || 0).toLocaleString('vi-VN')}
          subtitle={t('charts.reportsOverTime')}
          icon={<AlertTriangle className='h-5 w-5' />}
        />
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <LineChartCard
          title={t('charts.reportsOverTime')}
          datasets={[
            {
              data: (data?.dataPoints || []).map((item) => item.count),
              color: '#F97316',
              label: t('charts.reports'),
            },
          ]}
          labels={(data?.dataPoints || []).map((item) =>
            formatXLabel(item.label, data?.granularity || 'DAY'),
          )}
          height='h-80'
          showLegend={false}
        />
      </div>
    </div>
  )
}

export default ReportsTab
