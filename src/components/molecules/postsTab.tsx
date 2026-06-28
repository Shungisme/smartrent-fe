import React, { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { toast } from 'sonner'
import StatsCard from '@/components/molecules/statsCard'
import LineChartCard from '@/components/molecules/lineChartCard'
import { DashboardService } from '@/api/services/dashboard.service'
import { type DateRangeValue } from '@/components/molecules/dateRangePicker'
import { FileText, Loader2 } from 'lucide-react'
import { formatChartXLabel } from '@/utils/chart'

type PostsTabProps = {
  dateRange: DateRangeValue
}

const PostsTab: React.FC<PostsTabProps> = ({ dateRange }) => {
  const t = useTranslations('admin.analytics.posts')
  const tRevenue = useTranslations('admin.analytics.revenue')

  const [loading, setLoading] = useState(true)
  const [data, setData] =
    useState<
      Awaited<ReturnType<typeof DashboardService.getListingCreation>>['data']
    >(null)

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

  if (loading) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        <StatsCard
          title={t('stats.totalPosts')}
          value={(data?.total || 0).toLocaleString('vi-VN')}
          subtitle={t('stats.inThisPeriod')}
          icon={<FileText className='h-5 w-5' />}
        />
        <StatsCard
          title={t('charts.newPosts')}
          value={(data?.dataPoints.length || 0).toLocaleString('vi-VN')}
          subtitle={t('charts.postActivity')}
          icon={<FileText className='h-5 w-5' />}
        />
      </div>

      <div className='grid grid-cols-1 gap-6'>
        <LineChartCard
          title={t('charts.postActivity')}
          datasets={[
            {
              data: (data?.dataPoints || []).map((item) => item.count),
              color: 'var(--chart-2)',
              label: t('charts.newPosts'),
            },
          ]}
          labels={(data?.dataPoints || []).map((item) =>
            formatChartXLabel(item.label, data?.granularity || 'DAY'),
          )}
          showLegend={false}
          height='h-80'
        />
      </div>
    </div>
  )
}

export default PostsTab
