import React, { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { StatCard } from '@/components/molecules/statCard'
import AreaChartCard from '@/components/molecules/areaChartCard'
import LineChartCard from '@/components/molecules/lineChartCard'
import PieChartCard, { PieChartData } from '@/components/molecules/pieChartCard'
import { DashboardService } from '@/api/services/dashboard.service'
import {
  AdminUserAnalyticsResponse,
  BrokerVerificationCategory,
  UserRoleCategory,
} from '@/api/types/dashboard.type'
import { type DateRangeValue } from '@/components/molecules/dateRangePicker'
import { Users, UserCheck, Briefcase, Clock3, Loader2 } from 'lucide-react'
import { formatChartXLabel } from '@/utils/chart'

type UsersTabProps = {
  dateRange: DateRangeValue
}

const UsersTab: React.FC<UsersTabProps> = ({ dateRange }) => {
  const t = useTranslations('admin.analytics.users')
  const tRevenue = useTranslations('admin.analytics.revenue')

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AdminUserAnalyticsResponse | null>(null)

  useEffect(() => {
    const fetchUserGrowth = async () => {
      try {
        setLoading(true)
        const response = await DashboardService.getUserGrowth({
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

    fetchUserGrowth()
  }, [dateRange.from, dateRange.to, tRevenue])

  const roleLabels: Record<UserRoleCategory, string> = {
    REGULAR: t('roles.REGULAR'),
    BROKER: t('roles.BROKER'),
  }
  const roleColors: Record<UserRoleCategory, string> = {
    REGULAR: 'var(--chart-1)',
    BROKER: 'var(--chart-2)',
  }

  const brokerStatusLabels: Record<BrokerVerificationCategory, string> = {
    NONE: t('brokerStatus.NONE'),
    PENDING: t('brokerStatus.PENDING'),
    APPROVED: t('brokerStatus.APPROVED'),
    REJECTED: t('brokerStatus.REJECTED'),
  }
  const brokerStatusColors: Record<BrokerVerificationCategory, string> = {
    NONE: 'var(--chart-5)',
    PENDING: 'var(--chart-3)',
    APPROVED: 'var(--chart-2)',
    REJECTED: 'var(--chart-4)',
  }

  const roleChartData: PieChartData[] = useMemo(
    () =>
      (data?.roleBreakdown || []).map((item) => ({
        label: roleLabels[item.category] ?? item.category,
        value: item.count,
        color: roleColors[item.category] ?? 'var(--chart-5)',
        percentage: item.percentage,
      })),

    [data?.roleBreakdown],
  )

  const brokerStatusChartData: PieChartData[] = useMemo(
    () =>
      (data?.brokerVerificationBreakdown || []).map((item) => ({
        label: brokerStatusLabels[item.category] ?? item.category,
        value: item.count,
        color: brokerStatusColors[item.category] ?? 'var(--chart-5)',
        percentage: item.percentage,
      })),

    [data?.brokerVerificationBreakdown],
  )

  // Live backlog across the whole system, independent of the selected range —
  // the pie chart below still shows PENDING among brokers registered in-range.
  const brokerPendingCount = data?.brokersPendingApproval ?? 0
  const brokerSharePercent =
    data?.roleBreakdown.find((item) => item.category === 'BROKER')
      ?.percentage ?? 0

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
          label={t('stats.newUsers')}
          value={(data?.total ?? 0).toLocaleString('vi-VN')}
          icon={Users}
          intent='primary'
        />
        <StatCard
          label={t('stats.totalUsers')}
          value={(data?.totalUsersAsOfRangeEnd ?? 0).toLocaleString('vi-VN')}
          icon={UserCheck}
          intent='neutral'
        />
        <StatCard
          label={t('stats.brokerShare')}
          value={`${brokerSharePercent.toFixed(1)}%`}
          icon={Briefcase}
          intent='success'
        />
        <StatCard
          label={t('stats.brokerPending')}
          value={brokerPendingCount.toLocaleString('vi-VN')}
          icon={Clock3}
          intent='warning'
        />
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <AreaChartCard
          title={t('charts.newUsersOverTime')}
          data={(data?.dataPoints || []).map((item) => item.count)}
          labels={(data?.dataPoints || []).map((item) =>
            formatChartXLabel(item.label, data?.granularity || 'DAY'),
          )}
          color='var(--chart-1)'
          height='h-72'
        />
        <LineChartCard
          title={t('charts.userGrowthOverTime')}
          datasets={[
            {
              data: (data?.cumulativeDataPoints || []).map(
                (item) => item.count,
              ),
              color: 'var(--chart-2)',
              label: t('stats.totalUsers'),
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
          title={t('charts.roleBreakdown')}
          data={roleChartData}
          showPercentage
          height='h-72'
        />
        <PieChartCard
          title={t('charts.brokerVerificationBreakdown')}
          data={brokerStatusChartData}
          showPercentage
          height='h-72'
          emptyLabel={t('emptyBrokerBreakdown')}
        />
      </div>
    </div>
  )
}

export default UsersTab
