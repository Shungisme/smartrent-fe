import React from 'react'
import { Card } from '@/components/atoms/card'

type DonutChartProps = {
  data?: { label: string; value: number; color: string }[]
}

const DonutChart: React.FC<DonutChartProps> = ({
  data = [
    { label: 'Đã thanh toán', value: 124, color: '#22c55e' },
    { label: 'Chưa thanh toán', value: 18, color: '#eab308' },
    { label: 'Quá hạn', value: 7, color: '#ef4444' },
  ],
}) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = 0

  const segments = data.map((item) => {
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
      <h3 className='mb-4 text-lg font-semibold text-gray-900'>
        Phân Bố Trạng Thái Hóa Đơn
      </h3>
      <div className='flex items-center justify-between'>
        <svg className='h-48 w-48' viewBox='0 0 100 100'>
          {/* Donut segments */}
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              fill={segment.color}
              opacity='0.9'
            />
          ))}

          {/* Center circle (makes it a donut) */}
          <circle cx='50' cy='50' r='25' fill='white' />

          {/* Center text */}
          <text
            x='50'
            y='48'
            textAnchor='middle'
            className='text-2xl font-bold'
            fill='#111827'
          >
            {total}
          </text>
          <text
            x='50'
            y='58'
            textAnchor='middle'
            className='text-xs'
            fill='#6b7280'
          >
            Tổng
          </text>
        </svg>

        {/* Legend */}
        <div className='flex flex-col gap-3'>
          {segments.map((segment, index) => (
            <div key={index} className='flex items-center gap-2'>
              <div
                className='h-3 w-3 rounded-full'
                style={{ backgroundColor: segment.color }}
              />
              <div className='flex flex-col'>
                <span className='text-sm font-medium text-gray-900'>
                  {segment.label}
                </span>
                <span className='text-xs text-gray-500'>
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
