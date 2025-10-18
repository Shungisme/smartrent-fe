import React from 'react'
import { Card } from '@/components/atoms/card'

type PerformanceChartProps = {
  revenue?: number[]
  avgInvoice?: number[]
  labels?: string[]
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  revenue = [200, 280, 250, 380, 350, 420, 500, 450, 520, 580, 550, 620],
  avgInvoice = [15, 17, 16, 19, 18, 20, 22, 21, 23, 24, 23, 25],
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
  const maxRevenue = Math.max(...revenue)
  const maxAvg = Math.max(...avgInvoice)

  return (
    <Card className='p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>
          Hiệu Suất Hàng Tháng
        </h3>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <div className='h-3 w-3 rounded bg-blue-500' />
            <span className='text-sm text-gray-600'>Doanh thu</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='h-0.5 w-6 bg-green-500' />
            <span className='text-sm text-gray-600'>Giá trị TB</span>
          </div>
        </div>
      </div>

      <div className='relative h-80'>
        <svg
          className='h-full w-full'
          viewBox='0 0 120 100'
          preserveAspectRatio='none'
        >
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((y) => (
            <line
              key={y}
              x1='10'
              y1={y}
              x2='110'
              y2={y}
              stroke='#e5e7eb'
              strokeWidth='0.2'
            />
          ))}

          {/* Revenue bars */}
          {revenue.map((value, index) => {
            const x = 10 + (index * 100) / revenue.length
            const height = (value / maxRevenue) * 80
            const y = 100 - height

            return (
              <rect
                key={`bar-${index}`}
                x={x}
                y={y}
                width='6'
                height={height}
                fill='#3b82f6'
                opacity='0.8'
                rx='1'
              />
            )
          })}

          {/* Average invoice line */}
          <polyline
            points={avgInvoice
              .map((value, index) => {
                const x = 10 + (index * 100) / avgInvoice.length + 3
                const y = 100 - (value / maxAvg) * 80
                return `${x},${y}`
              })
              .join(' ')}
            fill='none'
            stroke='#22c55e'
            strokeWidth='0.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />

          {/* Dots on line */}
          {avgInvoice.map((value, index) => {
            const x = 10 + (index * 100) / avgInvoice.length + 3
            const y = 100 - (value / maxAvg) * 80

            return (
              <circle
                key={`dot-${index}`}
                cx={x}
                cy={y}
                r='0.8'
                fill='#22c55e'
              />
            )
          })}
        </svg>

        {/* X-axis labels */}
        <div className='mt-2 flex justify-between px-2'>
          {labels.map((label, index) => (
            <span key={index} className='text-xs text-gray-500'>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className='mt-4 flex justify-between text-sm text-gray-600'>
        <span>Doanh thu: Triệu ₫</span>
        <span>Giá trị TB: Triệu ₫</span>
      </div>
    </Card>
  )
}

export default PerformanceChart
