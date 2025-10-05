import React from 'react'
import { Card } from '@/components/atoms/card'

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
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data, 0)
  const valueRange = maxValue - minValue

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - ((value - minValue) / valueRange) * 80
      return `${x},${y}`
    })
    .join(' ')

  return (
    <Card className='p-6'>
      <h3 className='mb-4 text-lg font-semibold text-gray-900'>{title}</h3>
      <div className={`relative ${height}`}>
        <svg
          className='h-full w-full'
          viewBox='0 0 100 100'
          preserveAspectRatio='none'
        >
          {/* Grid lines */}
          {showGrid &&
            [0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1='0'
                y1={y}
                x2='100'
                y2={y}
                stroke='#e5e7eb'
                strokeWidth='0.2'
              />
            ))}

          {/* Area gradient */}
          <defs>
            <linearGradient id={gradientId} x1='0' x2='0' y1='0' y2='1'>
              <stop offset='0%' stopColor={color} stopOpacity='0.4' />
              <stop offset='100%' stopColor={color} stopOpacity='0.05' />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill={`url(#${gradientId})`}
          />

          {/* Line */}
          <polyline
            points={points}
            fill='none'
            stroke={color}
            strokeWidth='0.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />

          {/* Dots */}
          {data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((value - minValue) / valueRange) * 80

            return (
              <circle key={`dot-${index}`} cx={x} cy={y} r='0.8' fill={color} />
            )
          })}
        </svg>

        {/* X-axis labels */}
        <div className='mt-2 flex justify-between px-1'>
          {labels.map((label, index) => {
            // Show every nth label to avoid crowding
            const showEvery = Math.ceil(labels.length / 8)
            if (index % showEvery !== 0 && index !== labels.length - 1) {
              return (
                <span key={index} className='text-xs text-transparent'>
                  .
                </span>
              )
            }
            return (
              <span key={index} className='text-xs text-gray-500'>
                {label}
              </span>
            )
          })}
        </div>
      </div>
      {unit && <div className='mt-4 text-sm text-gray-600'>{unit}</div>}
    </Card>
  )
}

export default AreaChartCard
