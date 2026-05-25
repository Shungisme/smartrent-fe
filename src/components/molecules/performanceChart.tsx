import React from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Card } from '@/components/atoms/card'

type PerformanceChartProps = {
  revenue?: number[]
  avgInvoice?: number[]
  labels?: string[]
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  revenue = [200, 280, 250, 380, 350, 420, 500, 450, 520, 580, 550, 620],
  avgInvoice = [15, 17, 16, 19, 18, 20, 22, 21, 23, 24, 23, 25],
  labels,
}) => {
  const t = useTranslations('admin.finance')
  const locale = useLocale()

  // Default month labels based on locale
  const defaultMonthLabels =
    locale === 'en'
      ? [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]
      : [
          'T1',
          'T2',
          'T3',
          'T4',
          'T5',
          'T6',
          'T7',
          'T8',
          'T9',
          'T10',
          'T11',
          'T12',
        ]

  const monthLabels = labels || defaultMonthLabels

  const maxRevenue = Math.max(...revenue)
  const maxAvg = Math.max(...avgInvoice)

  return (
    <Card className='p-6'>
      <div className='mb-4 flex items-center justify-between flex-wrap gap-2'>
        <h3 className='text-base font-semibold tracking-tight text-foreground'>
          {t('charts.performanceChart.title')}
        </h3>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 rounded-[3px] bg-[var(--chart-1)]' />
            <span className='text-xs text-muted-foreground'>
              {t('charts.performanceChart.revenue')}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-0.5 w-6 bg-[var(--chart-2)]' />
            <span className='text-xs text-muted-foreground'>
              {t('charts.performanceChart.avgValue')}
            </span>
          </div>
        </div>
      </div>

      <div className='relative h-80'>
        <svg
          className='h-full w-full'
          viewBox='0 0 120 100'
          preserveAspectRatio='none'
        >
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1='10'
              y1={y}
              x2='110'
              y2={y}
              stroke='var(--border)'
              strokeOpacity='0.6'
              strokeWidth='0.2'
            />
          ))}

          {revenue.map((value, index) => {
            const x = 10 + (index * 100) / revenue.length
            const height = (value / maxRevenue) * 80
            const y = 100 - height
            return (
              <rect
                key={`bar-${index}`}
                x={x}
                y={y}
                width='6'
                height={height}
                fill='var(--chart-1)'
                opacity='0.85'
                rx='1'
              />
            )
          })}

          <polyline
            points={avgInvoice
              .map((value, index) => {
                const x = 10 + (index * 100) / avgInvoice.length + 3
                const y = 100 - (value / maxAvg) * 80
                return `${x},${y}`
              })
              .join(' ')}
            fill='none'
            stroke='var(--chart-2)'
            strokeWidth='0.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />

          {avgInvoice.map((value, index) => {
            const x = 10 + (index * 100) / avgInvoice.length + 3
            const y = 100 - (value / maxAvg) * 80
            return (
              <circle
                key={`dot-${index}`}
                cx={x}
                cy={y}
                r='0.8'
                fill='var(--chart-2)'
              />
            )
          })}
        </svg>

        <div className='mt-2 flex justify-between px-2'>
          {monthLabels.map((label, index) => (
            <span key={index} className='text-xs text-muted-foreground'>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className='mt-4 flex justify-between text-xs text-muted-foreground'>
        <span>{t('charts.performanceChart.revenueUnit')}</span>
        <span>{t('charts.performanceChart.avgUnit')}</span>
      </div>
    </Card>
  )
}

export default PerformanceChart
