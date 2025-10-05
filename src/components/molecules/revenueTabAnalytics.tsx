import React from 'react'
import { Card } from '@/components/atoms/card'
import StatsCard from '@/components/molecules/statsCard'
import AreaChartCard from '@/components/molecules/areaChartCard'
import {
  revenueOverTimeData,
  revenueByPackage,
  revenueStats,
  formatCurrency,
  type TimeRange,
} from '@/data/analyticsData'
import { DollarSign, Package, TrendingUp, Award } from 'lucide-react'

type RevenueTabAnalyticsProps = {
  timeRange: TimeRange
}

const RevenueTabAnalytics: React.FC<RevenueTabAnalyticsProps> = ({
  timeRange,
}) => {
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

  const filteredRevenueData = filterData(revenueOverTimeData)
  const totalRevenue = filteredRevenueData.reduce(
    (sum, d) => sum + d.revenue,
    0,
  )
  const avgRevenuePerDay = Math.round(totalRevenue / filteredRevenueData.length)
  const estimatedPackagesSold = Math.round(filteredRevenueData.length * 4.8)

  return (
    <div className='space-y-6'>
      {/* Stats Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title='Tổng Doanh Thu'
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className='h-5 w-5' />}
        />
        <StatsCard
          title='Gói Thành Viên Đã Bán'
          value={estimatedPackagesSold.toString()}
          icon={<Package className='h-5 w-5' />}
        />
        <StatsCard
          title='Doanh Thu TB/Ngày'
          value={formatCurrency(avgRevenuePerDay)}
          icon={<TrendingUp className='h-5 w-5' />}
        />
        <StatsCard
          title='Doanh Thu TB/Gói'
          value={formatCurrency(revenueStats.avgRevenuePerPackage)}
          icon={<Award className='h-5 w-5' />}
        />
      </div>

      {/* Revenue Chart */}
      <AreaChartCard
        title='Doanh Thu Theo Thời Gian'
        data={filteredRevenueData.map((d) => d.revenue)}
        labels={filteredRevenueData.map((d) => d.date)}
        color='#6366F1'
        height='h-80'
        unit='Đơn vị: VNĐ'
      />

      {/* Revenue Breakdown Table */}
      <Card className='p-6'>
        <h3 className='mb-4 text-lg font-semibold text-gray-900'>
          Phân Tích Doanh Thu Theo Gói
        </h3>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='pb-3 text-left text-sm font-semibold text-gray-700'>
                  Gói
                </th>
                <th className='pb-3 text-right text-sm font-semibold text-gray-700'>
                  Doanh Thu
                </th>
                <th className='pb-3 text-right text-sm font-semibold text-gray-700'>
                  Tỷ Lệ
                </th>
                <th className='pb-3 text-right text-sm font-semibold text-gray-700'>
                  Lượt Mua
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {revenueByPackage.map((pkg, index) => (
                <tr key={index} className='group hover:bg-gray-50'>
                  <td className='py-4'>
                    <div className='flex items-center gap-3'>
                      <div
                        className='h-3 w-3 rounded-full'
                        style={{ backgroundColor: pkg.color }}
                      />
                      <span className='font-medium text-gray-900'>
                        {pkg.package}
                      </span>
                    </div>
                  </td>
                  <td className='py-4 text-right font-medium text-gray-900'>
                    {formatCurrency(pkg.revenue)}
                  </td>
                  <td className='py-4 text-right'>
                    <span className='inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700'>
                      {pkg.percentage}%
                    </span>
                  </td>
                  <td className='py-4 text-right text-gray-600'>{pkg.sales}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className='border-t-2 border-gray-300'>
              <tr>
                <td className='pt-4 font-semibold text-gray-900'>Tổng</td>
                <td className='pt-4 text-right font-semibold text-gray-900'>
                  {formatCurrency(
                    revenueByPackage.reduce((sum, pkg) => sum + pkg.revenue, 0),
                  )}
                </td>
                <td className='pt-4 text-right font-semibold text-gray-900'>
                  100%
                </td>
                <td className='pt-4 text-right font-semibold text-gray-900'>
                  {revenueByPackage.reduce((sum, pkg) => sum + pkg.sales, 0)}
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
