import React, { useMemo } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { useTranslations } from 'next-intl'
import { Activity } from 'lucide-react'
import { ChartCard } from '@/components/molecules/chartCard'
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/atoms/chart'
import { formatChartTick } from '@/utils/chart'

export type LineChartDataset = {
  data: number[]
  color: string
  label: string
}

type LineChartCardProps = {
  title: string
  description?: React.ReactNode
  datasets: LineChartDataset[]
  labels: string[]
  height?: string
  showGrid?: boolean
  showLegend?: boolean
}

const LineChartCard: React.FC<LineChartCardProps> = ({
  title,
  description,
  datasets,
  labels,
  height = 'h-64',
  showGrid = true,
  showLegend = true,
}) => {
  const t = useTranslations('common')
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

  const hasData = datasets.some((d) => d.data.some((v) => v > 0))

  return (
    <ChartCard
      title={title}
      description={description}
      bodyHeight={height}
      empty={
        !hasData ? (
          <div className='flex h-full flex-col items-center justify-center gap-2 text-muted-foreground'>
            <Activity className='h-6 w-6 opacity-50' />
            <span className='text-xs'>{t('noData')}</span>
          </div>
        ) : undefined
      }
    >
      <ChartContainer config={chartConfig} className='h-full w-full'>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
        >
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
            content={<ChartTooltipContent />}
          />

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
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{
                  r: 5,
                  fill: `var(--color-${dataKey})`,
                  strokeWidth: 2,
                  stroke: 'var(--background)',
                }}
                connectNulls
              />
            )
          })}
        </LineChart>
      </ChartContainer>
    </ChartCard>
  )
}

export default LineChartCard
