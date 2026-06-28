import React, { useId, useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Activity } from 'lucide-react'
import { ChartCard } from '@/components/molecules/chartCard'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/atoms/chart'
import { formatChartTick } from '@/utils/chart'

type AreaChartCardProps = {
  title: string
  description?: React.ReactNode
  data: number[]
  labels: string[]
  color?: string
  gradientId?: string
  height?: string
  showGrid?: boolean
  unit?: string
  emptyLabel?: string
}

const AreaChartCard: React.FC<AreaChartCardProps> = ({
  title,
  description,
  data,
  labels,
  color = 'var(--chart-1)',
  gradientId = 'areaGradient',
  height = 'h-64',
  showGrid = true,
  unit,
  emptyLabel,
}) => {
  const pointCount = Math.max(data.length, labels.length, 1)
  const uniqueId = useId().replace(/:/g, '')
  const gradientKey = `${gradientId}-${uniqueId}`

  const chartData = useMemo(
    () =>
      Array.from({ length: pointCount }, (_, index) => ({
        label: labels[index] ?? `${index + 1}`,
        value: data[index] ?? 0,
      })),
    [data, labels, pointCount],
  )

  const chartConfig: ChartConfig = {
    value: {
      label: title,
      color,
    },
  }

  const hasData = data.some((v) => v > 0)

  return (
    <ChartCard
      title={title}
      description={description}
      bodyHeight={height}
      footer={unit}
      empty={
        !hasData && emptyLabel ? (
          <div className='flex h-full flex-col items-center justify-center gap-2 text-muted-foreground'>
            <Activity className='h-6 w-6 opacity-50' />
            <span className='text-xs'>{emptyLabel}</span>
          </div>
        ) : undefined
      }
    >
      <ChartContainer config={chartConfig} className='h-full w-full'>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id={gradientKey} x1='0' y1='0' x2='0' y2='1'>
              <stop
                offset='5%'
                stopColor='var(--color-value)'
                stopOpacity={0.32}
              />
              <stop
                offset='95%'
                stopColor='var(--color-value)'
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>

          {showGrid && (
            <CartesianGrid
              vertical={false}
              strokeDasharray='3 3'
              stroke='var(--border)'
              strokeOpacity={0.6}
            />
          )}

          <XAxis
            dataKey='label'
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            stroke='var(--muted-foreground)'
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={42}
            tickMargin={8}
            tickFormatter={formatChartTick}
            stroke='var(--muted-foreground)'
            fontSize={11}
          />

          <ChartTooltip
            cursor={{
              stroke: 'var(--border)',
              strokeWidth: 1,
              strokeDasharray: '3 3',
            }}
            content={<ChartTooltipContent hideLabel />}
          />

          <Area
            type='monotone'
            dataKey='value'
            stroke='var(--color-value)'
            strokeWidth={2}
            fill={`url(#${gradientKey})`}
            dot={{
              r: 0,
            }}
            activeDot={{
              r: 5,
              fill: 'var(--color-value)',
              strokeWidth: 2,
              stroke: 'var(--background)',
            }}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}

export default AreaChartCard
