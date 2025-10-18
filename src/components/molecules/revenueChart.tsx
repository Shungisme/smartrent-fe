import React from 'react'
import { Card } from '@/components/atoms/card'

type RevenueChartProps = {
  data?: number[]
  labels?: string[]
}

const RevenueChart: React.FC<RevenueChartProps> = ({
  data = [250, 310, 280, 420, 380, 450, 520, 480, 550, 600, 580, 650],
  labels = [
    'T1',
    'T2',
    'T3',
    'T4',
    'T5',
    'T6',
    'T7',
    'T8',
    'T9',
    'T10',
    'T11',
    'T12',
  ],
}) => {
  const maxValue = Math.max(...data)
  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (value / maxValue) * 80
      return `${x},${y}`
    })
    .join(' ')

  return (
    <Card className='p-6'>
      <h3 className='mb-4 text-lg font-semibold text-gray-900'>
        Xu Hướng Doanh Thu
      </h3>
      <div className='relative h-64'>
        <svg
          className='h-full w-full'
          viewBox='0 0 100 100'
          preserveAspectRatio='none'
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
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
            <linearGradient id='areaGradient' x1='0' x2='0' y1='0' y2='1'>
              <stop offset='0%' stopColor='#3b82f6' stopOpacity='0.3' />
              <stop offset='100%' stopColor='#3b82f6' stopOpacity='0.05' />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <polygon
            points={`0,100 ${points} 100,100`}
            fill='url(#areaGradient)'
          />

          {/* Line */}
          <polyline
            points={points}
            fill='none'
            stroke='#3b82f6'
            strokeWidth='0.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>

        {/* X-axis labels */}
        <div className='mt-2 flex justify-between px-1'>
          {labels.map((label, index) => (
            <span key={index} className='text-xs text-gray-500'>
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className='mt-4 text-sm text-gray-600'>Đơn vị: Triệu ₫</div>
    </Card>
  )
}

export default RevenueChart
