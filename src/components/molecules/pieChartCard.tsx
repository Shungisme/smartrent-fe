import React from 'react'
import { Cell, Pie, PieChart } from 'recharts'
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

export type PieChartData = {
  label: string
  value: number
  color: string
  percentage?: number
}

type PieChartCardProps = {
  title: string
  data: PieChartData[]
  showPercentage?: boolean
  height?: string
}

const PieChartCard: React.FC<PieChartCardProps> = ({
  title,
  data,
  showPercentage = true,
  height = 'h-64',
}) => {
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

  return (
    <Card className='py-4'>
      <CardHeader className='pb-0'>
        <CardTitle className='text-base md:text-lg'>{title}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className={cn('grid gap-4 lg:grid-cols-[1fr_auto]', height)}>
          <div className='h-full min-h-[220px]'>
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
                  innerRadius={52}
                  outerRadius={90}
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
          </div>

          <div className='flex flex-col justify-center gap-2 lg:min-w-[180px]'>
            {segments.map((segment, index) => (
              <div key={`legend-${index}`} className='flex items-center gap-2'>
                <div
                  className='h-3 w-3 rounded-full shrink-0'
                  style={{ backgroundColor: `var(--color-slice${index})` }}
                />
                <div className='flex min-w-0 flex-col'>
                  <span className='truncate text-sm font-medium text-foreground'>
                    {segment.label}
                  </span>
                  <span className='text-xs text-muted-foreground'>
                    {segment.value.toLocaleString('vi-VN')}
                    {showPercentage && ` (${segment.percentage.toFixed(0)}%)`}
                  </span>
                </div>
              </div>
            ))}

            {segments.length === 0 && (
              <p className='text-sm text-muted-foreground'>No data</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PieChartCard
