import React from 'react'
import { Card } from '@/components/atoms/card'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

type StatsCardProps = {
  title: string
  value: string
  subtitle?: string
  badge?: {
    text: string
    variant: 'success' | 'warning' | 'danger'
  }
  trend?: {
    value: string
    isPositive: boolean
  }
  icon?: React.ReactNode
  className?: string
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  badge,
  trend,
  icon,
  className,
}) => {
  return (
    <Card className={cn('p-6', className)}>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-600'>{title}</p>
          <h3 className='mt-2 text-3xl font-bold text-gray-900'>{value}</h3>

          {trend && (
            <div className='mt-2 flex items-center gap-1'>
              {trend.isPositive ? (
                <TrendingUp className='h-4 w-4 text-green-600' />
              ) : (
                <TrendingDown className='h-4 w-4 text-red-600' />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-green-600' : 'text-red-600',
                )}
              >
                {trend.value}
              </span>
            </div>
          )}

          {subtitle && <p className='mt-1 text-sm text-gray-500'>{subtitle}</p>}

          {badge && (
            <span
              className={cn(
                'mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium',
                badge.variant === 'success' && 'bg-green-100 text-green-800',
                badge.variant === 'warning' && 'bg-yellow-100 text-yellow-800',
                badge.variant === 'danger' && 'bg-red-100 text-red-800',
              )}
            >
              {badge.text}
            </span>
          )}
        </div>

        {icon && (
          <div className='rounded-lg bg-blue-50 p-3 text-blue-600'>{icon}</div>
        )}
      </div>
    </Card>
  )
}

export default StatsCard
