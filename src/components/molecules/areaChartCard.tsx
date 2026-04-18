import React, { useId, useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/atoms/chart'
import { cn } from '@/lib/utils'

type AreaChartCardProps = {
  title: string
  data: number[]
  labels: string[]
  color?: string
  gradientId?: string
  height?: string
  showGrid?: boolean
  unit?: string
}

const AreaChartCard: React.FC<AreaChartCardProps> = ({
  title,
  data,
  labels,
  color = '#6366F1',
  gradientId = 'areaGradient',
  height = 'h-64',
  showGrid = true,
  unit,
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

  const formatTick = (value: string | number) => {
    if (typeof value !== 'number') {
      return value
    }

    if (Math.abs(value) < 1000) {
      return value.toLocaleString('vi-VN')
    }

    return new Intl.NumberFormat('vi-VN', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)
  }

  return (
    <Card className='py-4'>
      <CardHeader className='pb-0'>
        <CardTitle className='text-base md:text-lg'>{title}</CardTitle>
      </CardHeader>

      <CardContent className='space-y-2'>
        <div className={cn('w-full', height)}>
          <ChartContainer config={chartConfig} className='h-full w-full'>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 8, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientKey} x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='var(--color-value)'
                    stopOpacity={0.35}
                  />
                  <stop
                    offset='95%'
                    stopColor='var(--color-value)'
                    stopOpacity={0.03}
                  />
                </linearGradient>
              </defs>

              {showGrid && (
                <CartesianGrid vertical={false} strokeDasharray='3 3' />
              )}

              <XAxis
                dataKey='label'
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={42}
                tickMargin={8}
                tickFormatter={formatTick}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Area
                type='monotone'
                dataKey='value'
                stroke='var(--color-value)'
                strokeWidth={2.5}
                fill={`url(#${gradientKey})`}
                dot={{
                  r: 3,
                  fill: 'var(--color-value)',
                  strokeWidth: 2,
                  stroke: 'var(--background)',
                }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ChartContainer>
        </div>

        {unit && <div className='text-sm text-muted-foreground'>{unit}</div>}
      </CardContent>
    </Card>
  )
}

export default AreaChartCard
