import React from 'react'
import { Cell, Pie, PieChart } from 'recharts'
import { useTranslations } from 'next-intl'
import { PieChart as PieIcon } from 'lucide-react'
import { ChartCard } from '@/components/molecules/chartCard'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/atoms/chart'

export type PieChartData = {
  label: string
  value: number
  color: string
  percentage?: number
}

type PieChartCardProps = {
  title: string
  description?: React.ReactNode
  data: PieChartData[]
  showPercentage?: boolean
  height?: string
  /** Overrides the generic "no data" empty state when there's nothing to show. */
  emptyLabel?: string
}

const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  description,
  data,
  showPercentage = true,
  height = 'h-64',
  emptyLabel,
}) => {
  const t = useTranslations('common')
  const total = data.reduce((sum, item) => sum + item.value, 0)

  const segments = data.map((item) => ({
    ...item,
    percentage: item.percentage ?? (total > 0 ? (item.value / total) * 100 : 0),
  }))

  const chartConfig = segments.reduce<ChartConfig>(
    (accumulator, item, index) => {
      accumulator[`slice${index}`] = {
        label: item.label,
        color: item.color,
      }
      return accumulator
    },
    {},
  )

  const isEmpty = total === 0 || segments.length === 0

  return (
    <ChartCard
      title={title}
      description={description}
      bodyHeight={height}
      empty={
        isEmpty ? (
          <div className='flex h-full flex-col items-center justify-center gap-2 text-muted-foreground'>
            <PieIcon className='h-6 w-6 opacity-50' />
            <span className='text-xs'>{emptyLabel ?? t('noData')}</span>
          </div>
        ) : undefined
      }
    >
      <div className='grid h-full gap-4 lg:grid-cols-[1fr_auto]'>
        <div className='relative flex h-full min-h-[200px] items-center justify-center'>
          <ChartContainer config={chartConfig} className='h-full w-full'>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={segments}
                dataKey='value'
                nameKey='label'
                innerRadius='55%'
                outerRadius='85%'
                paddingAngle={2}
                stroke='var(--background)'
                strokeWidth={2}
              >
                {segments.map((_, index) => (
                  <Cell
                    key={`slice-${index}`}
                    fill={`var(--color-slice${index})`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          {/* Center total */}
          <div className='pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center'>
            <span className='text-[10px] font-medium uppercase tracking-wider text-muted-foreground'>
              {t('total')}
            </span>
            <span className='text-xl font-semibold tabular-nums text-foreground'>
              {total.toLocaleString('vi-VN')}
            </span>
          </div>
        </div>

        <ul className='flex flex-col justify-center gap-2 lg:min-w-[180px]'>
          {segments.map((segment, index) => (
            <li
              key={`legend-${index}`}
              className='flex items-center gap-2.5 text-sm'
            >
              <span
                aria-hidden
                className='h-2.5 w-2.5 shrink-0 rounded-[3px]'
                style={{ backgroundColor: `var(--color-slice${index})` }}
              />
              <div className='flex min-w-0 flex-1 items-baseline justify-between gap-2'>
                <span className='truncate text-foreground'>
                  {segment.label}
                </span>
                <span className='shrink-0 font-medium tabular-nums text-muted-foreground'>
                  {showPercentage
                    ? `${segment.percentage.toFixed(0)}%`
                    : segment.value.toLocaleString('vi-VN')}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  )
}

export default PieChartCard
