import React from 'react'
import { useTranslations } from 'next-intl'
import { Card } from '@/components/atoms/card'

type DonutChartProps = {
  data?: { label: string; value: number; color: string }[]
}

const DonutChart: React.FC<DonutChartProps> = ({ data }) => {
  const t = useTranslations('admin.finance')

  const defaultData = [
    { label: t('invoice.status.paid'), value: 124, color: 'var(--chart-2)' },
    { label: t('invoice.status.unpaid'), value: 18, color: 'var(--chart-3)' },
    { label: t('invoice.status.overdue'), value: 7, color: 'var(--chart-4)' },
  ]

  const chartData = data || defaultData
  const total = chartData.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const segments = chartData.map((item) => {
    const percentage = (item.value / total) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    currentAngle += angle

    // Calculate SVG path for donut segment
    const startX = 50 + 40 * Math.cos((Math.PI * (startAngle - 90)) / 180)
    const startY = 50 + 40 * Math.sin((Math.PI * (startAngle - 90)) / 180)
    const endX = 50 + 40 * Math.cos((Math.PI * (startAngle + angle - 90)) / 180)
    const endY = 50 + 40 * Math.sin((Math.PI * (startAngle + angle - 90)) / 180)

    const largeArc = angle > 180 ? 1 : 0

    const pathData = [
      `M 50 50`,
      `L ${startX} ${startY}`,
      `A 40 40 0 ${largeArc} 1 ${endX} ${endY}`,
      `Z`,
    ].join(' ')

    return {
      ...item,
      percentage,
      pathData,
    }
  })

  return (
    <Card className='p-6'>
      <h3 className='mb-4 text-base font-semibold tracking-tight text-foreground'>
        {t('charts.donutChart.title')}
      </h3>
      <div className='flex items-center justify-between gap-4'>
        <svg className='h-48 w-48' viewBox='0 0 100 100'>
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              fill={segment.color}
              opacity='0.92'
            />
          ))}

          <circle cx='50' cy='50' r='25' fill='var(--card)' />

          <text
            x='50'
            y='48'
            textAnchor='middle'
            className='text-2xl font-semibold'
            fill='var(--foreground)'
          >
            {total}
          </text>
          <text
            x='50'
            y='58'
            textAnchor='middle'
            className='text-xs'
            fill='var(--muted-foreground)'
          >
            {t('charts.donutChart.total')}
          </text>
        </svg>

        <div className='flex flex-col gap-3'>
          {segments.map((segment, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div
                className='h-3 w-3 shrink-0 rounded-[3px]'
                style={{ backgroundColor: segment.color }}
              />
              <div className='flex flex-col leading-tight'>
                <span className='text-sm font-medium text-foreground'>
                  {segment.label}
                </span>
                <span className='text-xs text-muted-foreground tabular-nums'>
                  {segment.value} ({segment.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default DonutChart
