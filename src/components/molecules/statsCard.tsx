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
  const badgeClasses = {
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/18 text-warning',
    danger: 'bg-destructive/15 text-destructive',
  }

  return (
    <Card className={cn('p-6', className)}>
      <div className='flex items-start justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-muted-foreground'>{title}</p>
          <h3 className='mt-2 text-3xl font-bold tracking-tight text-foreground'>
            {value}
          </h3>

          {trend && (
            <div className='mt-2 flex items-center gap-1'>
              {trend.isPositive ? (
                <TrendingUp className='h-4 w-4 text-success' />
              ) : (
                <TrendingDown className='h-4 w-4 text-destructive' />
              )}
              <span
                className={cn(
                  'text-sm font-medium',
                  trend.isPositive ? 'text-success' : 'text-destructive',
                )}
              >
                {trend.value}
              </span>
            </div>
          )}

          {subtitle && (
            <p className='mt-1 text-sm text-muted-foreground'>{subtitle}</p>
          )}

          {badge && (
            <span
              className={cn(
                'mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold',
                badgeClasses[badge.variant],
              )}
            >
              {badge.text}
            </span>
          )}
        </div>

        {icon && (
          <div className='rounded-lg bg-primary/12 p-3 text-primary'>
            {icon}
          </div>
        )}
      </div>
    </Card>
  )
}

export default StatsCard
