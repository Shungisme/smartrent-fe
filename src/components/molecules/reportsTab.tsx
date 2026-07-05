import React, { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { StatCard } from '@/components/molecules/statCard'
import AreaChartCard from '@/components/molecules/areaChartCard'
import LineChartCard from '@/components/molecules/lineChartCard'
import PieChartCard, { PieChartData } from '@/components/molecules/pieChartCard'
import { DashboardService } from '@/api/services/dashboard.service'
import {
  AdminReportAnalyticsResponse,
  ReportCategory,
  ReportStatusCategory,
} from '@/api/types/dashboard.type'
import { type DateRangeValue } from '@/components/molecules/dateRangePicker'
import {
  AlertTriangle,
  CheckCircle2,
  Timer,
  Clock3,
  Loader2,
} from 'lucide-react'
import { formatChartXLabel } from '@/utils/chart'

type ReportsTabProps = {
  dateRange: DateRangeValue
}

const ReportsTab: React.FC<ReportsTabProps> = ({ dateRange }) => {
  const t = useTranslations('admin.analytics.reports')
  const tRevenue = useTranslations('admin.analytics.revenue')

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AdminReportAnalyticsResponse | null>(null)

  useEffect(() => {
    const fetchReportCount = async () => {
      try {
        setLoading(true)
        const response = await DashboardService.getReportCount({
          from: dateRange.from,
          to: dateRange.to,
        })

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
  }, [dateRange.from, dateRange.to, tRevenue])

  const categoryLabels: Record<ReportCategory, string> = {
    LISTING: t('categories.LISTING'),
    MAP: t('categories.MAP'),
  }
  const categoryColors: Record<ReportCategory, string> = {
    LISTING: 'var(--chart-1)',
    MAP: 'var(--chart-3)',
  }

  const statusLabels: Record<ReportStatusCategory, string> = {
    PENDING: t('status.PENDING'),
    RESOLVED: t('status.RESOLVED'),
    REJECTED: t('status.REJECTED'),
  }
  const statusColors: Record<ReportStatusCategory, string> = {
    PENDING: 'var(--chart-3)',
    RESOLVED: 'var(--chart-2)',
    REJECTED: 'var(--chart-4)',
  }

  const categoryChartData: PieChartData[] = useMemo(
    () =>
      (data?.categoryBreakdown || []).map((item) => ({
        label: categoryLabels[item.category] ?? item.category,
        value: item.count,
        color: categoryColors[item.category] ?? 'var(--chart-5)',
        percentage: item.percentage,
      })),

    [data?.categoryBreakdown],
  )

  const statusChartData: PieChartData[] = useMemo(
    () =>
      (data?.statusBreakdown || []).map((item) => ({
        label: statusLabels[item.category] ?? item.category,
        value: item.count,
        color: statusColors[item.category] ?? 'var(--chart-5)',
        percentage: item.percentage,
      })),

    [data?.statusBreakdown],
  )

  const pendingCount =
    data?.statusBreakdown.find((item) => item.category === 'PENDING')?.count ??
    0

  const formatResolutionTime = (hours: number | null): string => {
    if (hours === null || hours === undefined) return t('units.notAvailable')
    if (hours < 24) return `${hours.toFixed(1)}h`
    return `${(hours / 24).toFixed(1)} ${t('units.days')}`
  }

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
        <StatCard
          label={t('stats.newReports')}
          value={(data?.total ?? 0).toLocaleString('vi-VN')}
          icon={AlertTriangle}
          intent='primary'
        />
        <StatCard
          label={t('stats.resolutionRate')}
          value={`${(data?.resolutionRatePercent ?? 0).toFixed(1)}%`}
          icon={CheckCircle2}
          intent='success'
        />
        <StatCard
          label={t('stats.avgResolutionTime')}
          value={formatResolutionTime(data?.avgResolutionHours ?? null)}
          icon={Timer}
          intent='neutral'
        />
        <StatCard
          label={t('stats.pending')}
          value={pendingCount.toLocaleString('vi-VN')}
          icon={Clock3}
          intent='warning'
        />
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <AreaChartCard
          title={t('charts.reportsOverTime')}
          data={(data?.dataPoints || []).map((item) => item.count)}
          labels={(data?.dataPoints || []).map((item) =>
            formatChartXLabel(item.label, data?.granularity || 'DAY'),
          )}
          color='var(--chart-4)'
          height='h-72'
        />
        <LineChartCard
          title={t('charts.cumulativeReports')}
          datasets={[
            {
              data: (data?.cumulativeDataPoints || []).map(
                (item) => item.count,
              ),
              color: 'var(--chart-1)',
              label: t('charts.reports'),
            },
          ]}
          labels={(data?.cumulativeDataPoints || []).map((item) =>
            formatChartXLabel(item.label, data?.granularity || 'DAY'),
          )}
          showLegend={false}
          height='h-72'
        />
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <PieChartCard
          title={t('charts.categoryBreakdown')}
          data={categoryChartData}
          showPercentage
          height='h-72'
        />
        <PieChartCard
          title={t('charts.statusBreakdown')}
          data={statusChartData}
          showPercentage
          height='h-72'
        />
      </div>
    </div>
  )
}

export default ReportsTab
