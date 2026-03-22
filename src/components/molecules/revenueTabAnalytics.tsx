import React, { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { Card } from '@/components/atoms/card'
import StatsCard from '@/components/molecules/statsCard'
import AreaChartCard from '@/components/molecules/areaChartCard'
import PieChartCard, { PieChartData } from '@/components/molecules/pieChartCard'
import { formatCurrency, type TimeRange } from '@/data/analyticsData'
import { DashboardService } from '@/api/services/dashboard.service'
import {
  MembershipDistributionResponse,
  RevenueByTypeItem,
  RevenueOverTimeResponse,
  DashboardTransactionType,
  MembershipPackageLevel,
} from '@/api/types/dashboard.type'
import { Loader2 } from 'lucide-react'
import { DollarSign, Package, TrendingUp, Award } from 'lucide-react'

type RevenueTabAnalyticsProps = {
  timeRange: TimeRange
}

const RevenueTabAnalytics: React.FC<RevenueTabAnalyticsProps> = ({
  timeRange,
}) => {
  const t = useTranslations('admin.analytics.revenue')

  const [revenueData, setRevenueData] =
    useState<RevenueOverTimeResponse | null>(null)
  const [membershipData, setMembershipData] =
    useState<MembershipDistributionResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const buildDateRange = (range: TimeRange) => {
    const to = new Date()
    const from = new Date(to)

    if (range === 'today') {
      from.setDate(to.getDate())
    } else if (range === 'week') {
      from.setDate(to.getDate() - 6)
    } else {
      from.setDate(to.getDate() - 29)
    }

    const format = (value: Date) => value.toISOString().split('T')[0]

    return {
      from: format(from),
      to: format(to),
    }
  }

  useEffect(() => {
    const fetchDashboardCharts = async () => {
      try {
        setLoading(true)
        const { from, to } = buildDateRange(timeRange)
        const [revenueResponse, membershipResponse] = await Promise.all([
          DashboardService.getRevenueOverTime({ from, to }),
          DashboardService.getMembershipDistribution(),
        ])

        if (!revenueResponse.success || !revenueResponse.data) {
          throw new Error(
            revenueResponse.message || t('messages.revenueFetchError'),
          )
        }

        if (!membershipResponse.success || !membershipResponse.data) {
          throw new Error(
            membershipResponse.message || t('messages.membershipFetchError'),
          )
        }

        setRevenueData(revenueResponse.data)
        setMembershipData(membershipResponse.data)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : t('messages.defaultFetchError')
        toast.error(message)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardCharts()
  }, [timeRange, t])

  const typeLabels: Record<DashboardTransactionType, string> = {
    MEMBERSHIP_PURCHASE: t('transactionTypes.membershipPurchase'),
    MEMBERSHIP_UPGRADE: t('transactionTypes.membershipUpgrade'),
    POST_FEE: t('transactionTypes.postFee'),
    PUSH_FEE: t('transactionTypes.pushFee'),
    WALLET_TOPUP: t('transactionTypes.walletTopup'),
    REFUND: t('transactionTypes.refund'),
  }

  const levelLabels: Record<MembershipPackageLevel, string> = {
    BASIC: t('membershipLevels.basic'),
    STANDARD: t('membershipLevels.standard'),
    ADVANCED: t('membershipLevels.advanced'),
  }

  const levelColors: Record<MembershipPackageLevel, string> = {
    BASIC: '#94A3B8',
    STANDARD: '#6366F1',
    ADVANCED: '#F59E0B',
  }

  const membershipChartData: PieChartData[] = useMemo(
    () =>
      (membershipData?.distribution || []).map((item) => ({
        label: levelLabels[item.packageLevel] || item.packageName,
        value: item.count,
        color: levelColors[item.packageLevel],
        percentage: item.percentage,
      })),
    [levelLabels, levelColors, membershipData?.distribution],
  )

  const revenuePoints = revenueData?.dataPoints || []
  const avgRevenuePerDay =
    revenuePoints.length > 0
      ? Math.round(revenueData!.grandTotal / revenuePoints.length)
      : 0
  const topRevenueType: RevenueByTypeItem | undefined = [
    ...(revenueData?.revenueByType || []),
  ].sort((a, b) => b.totalAmount - a.totalAmount)[0]

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title={t('stats.totalRevenue')}
          value={formatCurrency(revenueData?.grandTotal || 0)}
          icon={<DollarSign className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.totalTransactions')}
          value={(revenueData?.totalTransactions || 0).toString()}
          icon={<Package className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.avgPerDay')}
          value={formatCurrency(avgRevenuePerDay)}
          icon={<TrendingUp className='h-5 w-5' />}
        />
        <StatsCard
          title={t('stats.activeMemberships')}
          value={(membershipData?.totalActive || 0).toString()}
          subtitle={
            topRevenueType
              ? `${t('stats.topSource')}: ${typeLabels[topRevenueType.transactionType]}`
              : undefined
          }
          icon={<Award className='h-5 w-5' />}
        />
      </div>

      <div className='grid grid-cols-1 gap-6 xl:grid-cols-5'>
        <div className='xl:col-span-3'>
          <AreaChartCard
            title={t('charts.revenueOverTime')}
            data={revenuePoints.map((point) => point.totalAmount)}
            labels={revenuePoints.map((point) => point.date)}
            color='#6366F1'
            height='h-80'
            unit={t('charts.unit')}
          />
        </div>
        <div className='xl:col-span-2'>
          <PieChartCard
            title={t('charts.membershipDistribution')}
            data={membershipChartData}
            showPercentage
            height='h-80'
          />
        </div>
      </div>

      {/* Revenue Breakdown by Transaction Type */}
      <Card className='p-6'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          {t('table.title')}
        </h3>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='pb-3 text-left text-sm font-semibold text-gray-700'>
                  {t('table.type')}
                </th>
                <th className='pb-3 text-right text-sm font-semibold text-gray-700'>
                  {t('table.revenue')}
                </th>
                <th className='pb-3 text-right text-sm font-semibold text-gray-700'>
                  {t('table.percentage')}
                </th>
                <th className='pb-3 text-right text-sm font-semibold text-gray-700'>
                  {t('table.transactions')}
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {(revenueData?.revenueByType || []).map((item) => {
                const percentage =
                  (revenueData?.grandTotal || 0) > 0
                    ? (item.totalAmount / (revenueData?.grandTotal || 1)) * 100
                    : 0

                return (
                  <tr
                    key={item.transactionType}
                    className='group hover:bg-gray-50'
                  >
                    <td className='py-4'>
                      <div className='flex items-center gap-3'>
                        <span className='font-medium text-gray-900'>
                          {typeLabels[item.transactionType]}
                        </span>
                      </div>
                    </td>
                    <td className='py-4 text-right font-medium text-gray-900'>
                      {formatCurrency(item.totalAmount)}
                    </td>
                    <td className='py-4 text-right'>
                      <span className='inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700'>
                        {percentage.toFixed(1)}%
                      </span>
                    </td>
                    <td className='py-4 text-right text-gray-600'>
                      {item.transactionCount}
                    </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot className='border-t-2 border-gray-300'>
              <tr>
                <td className='pt-4 font-semibold text-gray-900'>
                  {t('table.total')}
                </td>
                <td className='pt-4 text-right font-semibold text-gray-900'>
                  {formatCurrency(revenueData?.grandTotal || 0)}
                </td>
                <td className='pt-4 text-right font-semibold text-gray-900'>
                  100%
                </td>
                <td className='pt-4 text-right font-semibold text-gray-900'>
                  {revenueData?.totalTransactions || 0}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  )
}

export default RevenueTabAnalytics
