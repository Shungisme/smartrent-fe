import React, { useEffect, useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import { StatCard } from '@/components/molecules/statCard'
import AreaChartCard from '@/components/molecules/areaChartCard'
import LineChartCard from '@/components/molecules/lineChartCard'
import PieChartCard, { PieChartData } from '@/components/molecules/pieChartCard'
import { DashboardService } from '@/api/services/dashboard.service'
import {
  AdminListingAnalyticsResponse,
  CategoryBreakdownItem,
  ListingProductTypeCategory,
  ListingTypeCategory,
  ListingVerificationCategory,
} from '@/api/types/dashboard.type'
import { type DateRangeValue } from '@/components/molecules/dateRangePicker'
import { FileText, Layers, ShieldCheck, Home, Loader2 } from 'lucide-react'
import { formatChartXLabel } from '@/utils/chart'

type PostsTabProps = {
  dateRange: DateRangeValue
}

const PIE_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
]
const OTHER_COLOR = 'var(--chart-5)'
const MAX_PIE_SLICES = 5

/** Keeps the top N-1 categories by count and folds the rest into "Other" —
 * this design system only has 5 fixed categorical colors, never a generated hue. */
function toPieData<T extends string>(
  items: CategoryBreakdownItem<T>[],
  labels: Record<T, string>,
  otherLabel: string,
): PieChartData[] {
  const sorted = [...items].sort((a, b) => b.count - a.count)
  const top =
    sorted.length <= MAX_PIE_SLICES
      ? sorted
      : sorted.slice(0, MAX_PIE_SLICES - 1)
  const rest =
    sorted.length <= MAX_PIE_SLICES ? [] : sorted.slice(MAX_PIE_SLICES - 1)

  const result: PieChartData[] = top.map((item, index) => ({
    label: labels[item.category] ?? item.category,
    value: item.count,
    color: PIE_COLORS[index] ?? OTHER_COLOR,
    percentage: item.percentage,
  }))

  if (rest.length > 0) {
    result.push({
      label: otherLabel,
      value: rest.reduce((sum, item) => sum + item.count, 0),
      color: OTHER_COLOR,
      percentage: rest.reduce((sum, item) => sum + item.percentage, 0),
    })
  }

  return result
}

const PostsTab: React.FC<PostsTabProps> = ({ dateRange }) => {
  const t = useTranslations('admin.analytics.posts')
  const tRevenue = useTranslations('admin.analytics.revenue')

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AdminListingAnalyticsResponse | null>(null)

  useEffect(() => {
    const fetchListingCreation = async () => {
      try {
        setLoading(true)
        const response = await DashboardService.getListingCreation({
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

    fetchListingCreation()
  }, [dateRange.from, dateRange.to, tRevenue])

  const listingTypeLabels: Record<ListingTypeCategory, string> = {
    RENT: t('listingTypes.RENT'),
    SALE: t('listingTypes.SALE'),
    SHARE: t('listingTypes.SHARE'),
  }

  const productTypeLabels: Record<ListingProductTypeCategory, string> = {
    ROOM: t('productTypes.ROOM'),
    APARTMENT: t('productTypes.APARTMENT'),
    HOUSE: t('productTypes.HOUSE'),
    OFFICE: t('productTypes.OFFICE'),
    STUDIO: t('productTypes.STUDIO'),
    STORE: t('productTypes.STORE'),
  }

  const verificationLabels: Record<ListingVerificationCategory, string> = {
    VERIFIED: t('verification.VERIFIED'),
    UNVERIFIED: t('verification.UNVERIFIED'),
  }

  const listingTypeChartData = useMemo(
    () =>
      toPieData(
        data?.listingTypeBreakdown || [],
        listingTypeLabels,
        t('productTypes.OTHER'),
      ),

    [data?.listingTypeBreakdown],
  )

  const productTypeChartData = useMemo(
    () =>
      toPieData(
        data?.productTypeBreakdown || [],
        productTypeLabels,
        t('productTypes.OTHER'),
      ),

    [data?.productTypeBreakdown],
  )

  const verificationChartData = useMemo(
    () =>
      toPieData(
        data?.verificationBreakdown || [],
        verificationLabels,
        t('productTypes.OTHER'),
      ),

    [data?.verificationBreakdown],
  )

  const verifiedPercent =
    data?.verificationBreakdown.find((item) => item.category === 'VERIFIED')
      ?.percentage ?? 0
  const rentPercent =
    data?.listingTypeBreakdown.find((item) => item.category === 'RENT')
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
          label={t('stats.newListings')}
          value={(data?.total ?? 0).toLocaleString('vi-VN')}
          icon={FileText}
          intent='primary'
        />
        <StatCard
          label={t('stats.totalListings')}
          value={(data?.totalListingsAsOfRangeEnd ?? 0).toLocaleString('vi-VN')}
          icon={Layers}
          intent='neutral'
        />
        <StatCard
          label={t('stats.verifiedShare')}
          value={`${verifiedPercent.toFixed(1)}%`}
          icon={ShieldCheck}
          intent='success'
        />
        <StatCard
          label={t('stats.rentShare')}
          value={`${rentPercent.toFixed(1)}%`}
          icon={Home}
          intent='neutral'
        />
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <AreaChartCard
          title={t('charts.postActivity')}
          data={(data?.dataPoints || []).map((item) => item.count)}
          labels={(data?.dataPoints || []).map((item) =>
            formatChartXLabel(item.label, data?.granularity || 'DAY'),
          )}
          color='var(--chart-2)'
          height='h-72'
        />
        <LineChartCard
          title={t('charts.cumulativeListings')}
          datasets={[
            {
              data: (data?.cumulativeDataPoints || []).map(
                (item) => item.count,
              ),
              color: 'var(--chart-1)',
              label: t('stats.totalListings'),
            },
          ]}
          labels={(data?.cumulativeDataPoints || []).map((item) =>
            formatChartXLabel(item.label, data?.granularity || 'DAY'),
          )}
          showLegend={false}
          height='h-72'
        />
      </div>

      <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
        <PieChartCard
          title={t('charts.listingTypeBreakdown')}
          data={listingTypeChartData}
          showPercentage
          height='h-72'
        />
        <PieChartCard
          title={t('charts.productTypeBreakdown')}
          data={productTypeChartData}
          showPercentage
          height='h-72'
        />
        <PieChartCard
          title={t('charts.verificationBreakdown')}
          data={verificationChartData}
          showPercentage
          height='h-72'
        />
      </div>
    </div>
  )
}

export default PostsTab
