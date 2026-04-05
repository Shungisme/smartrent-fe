import React, { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import StatsCard from '@/components/molecules/statsCard'
import LineChartCard from '@/components/molecules/lineChartCard'
import AreaChartCard from '@/components/molecules/areaChartCard'
import PieChartCard from '@/components/molecules/pieChartCard'
import { formatCurrency, type TimeRange } from '@/data/analyticsData'
import { DashboardService } from '@/api/services/dashboard.service'
import { MembershipPackageLevel } from '@/api/types/dashboard.type'
import { DollarSign, Package, Users, Loader2 } from 'lucide-react'

type OverviewTabProps = {
  timeRange: TimeRange
}

const OverviewTab: React.FC<OverviewTabProps> = ({ timeRange }) => {
  const tOverview = useTranslations('admin.analytics.overview')
  const tRevenue = useTranslations('admin.analytics.revenue')
  const tPosts = useTranslations('admin.analytics.posts')
  const tReports = useTranslations('admin.analytics.reports')

  const [loading, setLoading] = useState(true)
  const [revenueData, setRevenueData] =
    useState<
      Awaited<ReturnType<typeof DashboardService.getRevenueOverTime>>['data']
    >(null)
  const [membershipData, setMembershipData] =
    useState<
      Awaited<
        ReturnType<typeof DashboardService.getMembershipDistribution>
      >['data']
    >(null)
  const [userGrowthData, setUserGrowthData] =
    useState<
      Awaited<ReturnType<typeof DashboardService.getUserGrowth>>['data']
    >(null)
  const [reportData, setReportData] =
    useState<
      Awaited<ReturnType<typeof DashboardService.getReportCount>>['data']
    >(null)
  const [listingData, setListingData] =
    useState<
      Awaited<ReturnType<typeof DashboardService.getListingCreation>>['data']
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
    const fetchOverviewData = async () => {
      try {
        setLoading(true)
        const days = mapTimeRangeToDays(timeRange)

        const [
          revenueResponse,
          membershipResponse,
          userResponse,
          reportResponse,
          listingResponse,
        ] = await Promise.all([
          DashboardService.getRevenueOverTime({ days }),
          DashboardService.getMembershipDistribution(),
          DashboardService.getUserGrowth(days),
          DashboardService.getReportCount(days),
          DashboardService.getListingCreation(days),
        ])

        if (!revenueResponse.success || !revenueResponse.data) {
          throw new Error(
            revenueResponse.message || tRevenue('messages.revenueFetchError'),
          )
        }

        if (!membershipResponse.success || !membershipResponse.data) {
          throw new Error(
            membershipResponse.message ||
              tRevenue('messages.membershipFetchError'),
          )
        }

        if (!userResponse.success || !userResponse.data) {
          throw new Error(
            userResponse.message || tRevenue('messages.defaultFetchError'),
          )
        }

        if (!reportResponse.success || !reportResponse.data) {
          throw new Error(
            reportResponse.message || tRevenue('messages.defaultFetchError'),
          )
        }

        if (!listingResponse.success || !listingResponse.data) {
          throw new Error(
            listingResponse.message || tRevenue('messages.defaultFetchError'),
          )
        }

        setRevenueData(revenueResponse.data)
        setMembershipData(membershipResponse.data)
        setUserGrowthData(userResponse.data)
        setReportData(reportResponse.data)
        setListingData(listingResponse.data)
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

    fetchOverviewData()
  }, [timeRange, tRevenue])

  const membershipColors: Record<MembershipPackageLevel, string> = {
    BASIC: '#94A3B8',
    STANDARD: '#6366F1',
    ADVANCED: '#F59E0B',
  }

  const membershipChartData = useMemo(
    () =>
      (membershipData?.distribution || []).map((item) => ({
        label: item.packageName,
        value: item.count,
        color: membershipColors[item.packageLevel],
        percentage: item.percentage,
      })),
    [membershipData?.distribution],
  )

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title={tRevenue('stats.totalRevenue')}
          value={formatCurrency(revenueData?.grandTotal || 0)}
          icon={<DollarSign className='h-5 w-5' />}
        />
        <StatsCard
          title={tRevenue('stats.totalTransactions')}
          value={(revenueData?.totalTransactions || 0).toLocaleString('vi-VN')}
          icon={<Package className='h-5 w-5' />}
        />
        <StatsCard
          title={tRevenue('stats.activeMemberships')}
          value={(membershipData?.totalActive || 0).toLocaleString('vi-VN')}
          icon={<Users className='h-5 w-5' />}
        />
        <StatsCard
          title={tOverview('charts.newUsers')}
          value={(userGrowthData?.total || 0).toLocaleString('vi-VN')}
          subtitle={tOverview('stats.newInPeriod')}
          icon={<Users className='h-5 w-5' />}
        />
      </div>

      <div className='grid grid-cols-1 gap-6 xl:grid-cols-5'>
        <div className='xl:col-span-3'>
          <AreaChartCard
            title={tOverview('charts.revenueOverTime')}
            data={(revenueData?.dataPoints || []).map(
              (item) => item.totalAmount,
            )}
            labels={(revenueData?.dataPoints || []).map((item) =>
              formatXLabel(item.date, revenueData?.granularity || 'DAY'),
            )}
            color='#6366F1'
            height='h-80'
            unit={tOverview('charts.unit')}
          />
        </div>
        <div className='xl:col-span-2'>
          <PieChartCard
            title={tRevenue('charts.membershipDistribution')}
            data={membershipChartData}
            showPercentage
            height='h-80'
          />
        </div>
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <LineChartCard
          title={tOverview('charts.userGrowth')}
          datasets={[
            {
              data: (userGrowthData?.dataPoints || []).map(
                (item) => item.count,
              ),
              color: '#2563EB',
              label: tOverview('charts.newUsers'),
            },
          ]}
          labels={(userGrowthData?.dataPoints || []).map((item) =>
            formatXLabel(item.label, userGrowthData?.granularity || 'DAY'),
          )}
          showLegend={false}
          height='h-80'
        />

        <LineChartCard
          title={tReports('charts.reportsOverTime')}
          datasets={[
            {
              data: (reportData?.dataPoints || []).map((item) => item.count),
              color: '#EF4444',
              label: tReports('charts.reports'),
            },
          ]}
          labels={(reportData?.dataPoints || []).map((item) =>
            formatXLabel(item.label, reportData?.granularity || 'DAY'),
          )}
          showLegend={false}
          height='h-80'
        />

        <LineChartCard
          title={tPosts('charts.postActivity')}
          datasets={[
            {
              data: (listingData?.dataPoints || []).map((item) => item.count),
              color: '#10B981',
              label: tPosts('charts.newPosts'),
            },
          ]}
          labels={(listingData?.dataPoints || []).map((item) =>
            formatXLabel(item.label, listingData?.granularity || 'DAY'),
          )}
          showLegend={false}
          height='h-80'
        />
      </div>
    </div>
  )
}

export default OverviewTab
