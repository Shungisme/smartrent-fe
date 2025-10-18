import React from 'react'
import { Card } from '@/components/atoms/card'

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
  // Find max value across all datasets for scaling
  const allValues = datasets.flatMap((d) => d.data)
  const maxValue = Math.max(...allValues)
  const minValue = Math.min(...allValues, 0)
  const valueRange = maxValue - minValue

  // Generate points for each dataset
  const generatePoints = (data: number[]) => {
    return data
      .map((value, index) => {
        const x = (index / (data.length - 1)) * 100
        const y = 100 - ((value - minValue) / valueRange) * 80
        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <Card className='p-6'>
      <div className='mb-4 flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-gray-900'>{title}</h3>
        {showLegend && datasets.length > 1 && (
          <div className='flex items-center gap-4'>
            {datasets.map((dataset, index) => (
              <div key={index} className='flex items-center gap-2'>
                <div
                  className='h-3 w-3 rounded'
                  style={{ backgroundColor: dataset.color }}
                />
                <span className='text-sm text-gray-600'>{dataset.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

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

          {/* Render each dataset */}
          {datasets.map((dataset, datasetIndex) => {
            const points = generatePoints(dataset.data)

            return (
              <g key={datasetIndex}>
                {/* Line */}
                <polyline
                  points={points}
                  fill='none'
                  stroke={dataset.color}
                  strokeWidth='0.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />

                {/* Dots */}
                {dataset.data.map((value, index) => {
                  const x = (index / (dataset.data.length - 1)) * 100
                  const y = 100 - ((value - minValue) / valueRange) * 80

                  return (
                    <circle
                      key={`dot-${datasetIndex}-${index}`}
                      cx={x}
                      cy={y}
                      r='0.8'
                      fill={dataset.color}
                    />
                  )
                })}
              </g>
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
    </Card>
  )
}

export default LineChartCard
