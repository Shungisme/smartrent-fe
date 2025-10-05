import React from 'react'
import { Card } from '@/components/atoms/card'

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
  let currentAngle = 0

  const segments = data.map((item) => {
    const percentage = item.percentage ?? (item.value / total) * 100
    const angle = (percentage / 100) * 360
    const startAngle = currentAngle
    currentAngle += angle

    // Calculate SVG path for pie segment
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
      <h3 className='mb-4 text-lg font-semibold text-gray-900'>{title}</h3>
      <div className={`flex items-center justify-between ${height}`}>
        <svg className='h-full w-auto' viewBox='0 0 100 100'>
          {/* Pie segments */}
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              fill={segment.color}
              opacity='0.9'
              className='transition-opacity hover:opacity-100'
            />
          ))}
        </svg>

        {/* Legend */}
        <div className='flex flex-col gap-3 ml-6'>
          {segments.map((segment, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div
                className='h-3 w-3 rounded-full flex-shrink-0'
                style={{ backgroundColor: segment.color }}
              />
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-gray-900'>
                  {segment.label}
                </span>
                <span className='text-xs text-gray-500'>
                  {segment.value.toLocaleString('vi-VN')}
                  {showPercentage && ` (${segment.percentage.toFixed(0)}%)`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default PieChartCard
