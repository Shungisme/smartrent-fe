import React, { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/atoms/chart'
import { cn } from '@/lib/utils'

export type LineChartDataset = {
  data: number[]
  color: string
  label: string
}

type LineChartCardProps = {
  title: string
  datasets: LineChartDataset[]
  labels: string[]
  height?: string
  showGrid?: boolean
  showLegend?: boolean
}

const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  datasets,
  labels,
  height = 'h-64',
  showGrid = true,
  showLegend = true,
}) => {
  const pointCount = Math.max(
    labels.length,
    ...datasets.map((dataset) => dataset.data.length),
    1,
  )

  const chartData = useMemo(
    () =>
      Array.from({ length: pointCount }, (_, index) => {
        const point: Record<string, string | number | null> = {
          label: labels[index] ?? `${index + 1}`,
        }

        datasets.forEach((dataset, datasetIndex) => {
          point[`series${datasetIndex}`] = dataset.data[index] ?? null
        })

        return point
      }),
    [datasets, labels, pointCount],
  )

  const chartConfig = useMemo(
    () =>
      datasets.reduce<ChartConfig>((accumulator, dataset, datasetIndex) => {
        accumulator[`series${datasetIndex}`] = {
          label: dataset.label,
          color: dataset.color,
        }

        return accumulator
      }, {}),
    [datasets],
  )

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
            <LineChart
              data={chartData}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
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

              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

              {showLegend && datasets.length > 1 && (
                <ChartLegend content={<ChartLegendContent />} />
              )}

              {datasets.map((_, datasetIndex) => {
                const dataKey = `series${datasetIndex}`

                return (
                  <Line
                    key={dataKey}
                    type='monotone'
                    dataKey={dataKey}
                    stroke={`var(--color-${dataKey})`}
                    strokeWidth={2.5}
                    dot={{
                      r: 3,
                      fill: `var(--color-${dataKey})`,
                      strokeWidth: 2,
                      stroke: 'var(--background)',
                    }}
                    activeDot={{ r: 5 }}
                    connectNulls
                  />
                )
              })}
            </LineChart>
          </ChartContainer>
        </div>

        {datasets.length === 0 && (
          <p className='text-center text-sm text-muted-foreground'>No data</p>
        )}
      </CardContent>
    </Card>
  )
}

export default LineChartCard
