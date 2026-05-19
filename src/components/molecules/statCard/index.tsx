import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/atoms/card'
import { cn } from '@/lib/utils'

const iconChipVariants = cva(
  'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [&>svg]:h-5 [&>svg]:w-5',
  {
    variants: {
      intent: {
        primary: 'bg-primary/10 text-primary',
        success: 'bg-success/12 text-success',
        warning: 'bg-warning/14 text-warning',
        destructive: 'bg-destructive/12 text-destructive',
        neutral: 'bg-muted text-muted-foreground',
      },
    },
    defaultVariants: { intent: 'primary' },
  },
)

interface StatCardProps
  extends
    Omit<React.ComponentProps<typeof Card>, 'title'>,
    VariantProps<typeof iconChipVariants> {
  label: React.ReactNode
  value: React.ReactNode
  /** Secondary line under the value (e.g. "12 running"). */
  hint?: React.ReactNode
  icon?: LucideIcon
  /** Signed percentage vs. previous period. Positive renders green, negative red. */
  trend?: number
  trendLabel?: string
}

/**
 * KPI / summary tile. Replaces the hand-rolled, duplicated stat blocks so every
 * metric card shares spacing, typography, hover and dark-mode behaviour.
 */
export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  trend,
  trendLabel = 'vs last period',
  intent,
  className,
  ...props
}: StatCardProps) {
  const hasTrend = typeof trend === 'number' && Number.isFinite(trend)
  const positive = (trend ?? 0) >= 0

  return (
    <Card
      className={cn(
        'gap-0 p-6 transition-shadow duration-200 hover:shadow-md',
        className,
      )}
      {...props}
    >
      <div className='flex items-start justify-between gap-4'>
        <div className='min-w-0 space-y-1.5'>
          <p className='truncate text-sm font-medium text-muted-foreground'>
            {label}
          </p>
          <p className='text-3xl font-semibold tracking-tight text-foreground tabular-nums'>
            {value}
          </p>
          {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
        </div>
        {Icon && (
          <span className={cn(iconChipVariants({ intent }))}>
            <Icon />
          </span>
        )}
      </div>
      {hasTrend && (
        <p
          className={cn(
            'mt-4 text-xs font-medium',
            positive ? 'text-success' : 'text-destructive',
          )}
        >
          {positive ? '↑' : '↓'} {Math.abs(trend as number)}%{' '}
          <span className='text-muted-foreground'>{trendLabel}</span>
        </p>
      )}
    </Card>
  )
}
