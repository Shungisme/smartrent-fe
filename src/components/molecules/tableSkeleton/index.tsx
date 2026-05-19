import * as React from 'react'
import { Skeleton } from '@/components/atoms/skeleton'
import { cn } from '@/lib/utils'

interface TableSkeletonProps {
  /** Number of data columns to mirror. */
  columns: number
  /** Number of placeholder rows. */
  rows?: number
  /** Reserve a leading checkbox column. */
  selectable?: boolean
  /** Reserve a trailing actions column. */
  actions?: boolean
  className?: string
}

/**
 * Loading placeholder that mirrors the table layout (sticky-looking header +
 * shimmer rows) instead of a bare centered spinner, so the page keeps its
 * shape while data loads.
 */
export function TableSkeleton({
  columns,
  rows = 8,
  selectable = false,
  actions = false,
  className,
}: TableSkeletonProps) {
  const totalCols = columns + (selectable ? 1 : 0) + (actions ? 1 : 0)
  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: selectable
      ? `3rem repeat(${totalCols - 1}, minmax(0, 1fr))`
      : `repeat(${totalCols}, minmax(0, 1fr))`,
  }

  return (
    <div className={cn('table-surface', className)}>
      {/* Header */}
      <div
        className='grid items-center gap-4 border-b border-border/70 bg-muted/65 px-5 py-3.5'
        style={gridStyle}
      >
        {Array.from({ length: totalCols }).map((_, i) => (
          <Skeleton key={i} className='h-3 w-20' />
        ))}
      </div>

      {/* Rows */}
      <div>
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className='grid items-center gap-4 border-b border-border/60 px-5 py-4 last:border-b-0'
            style={gridStyle}
          >
            {Array.from({ length: totalCols }).map((_, c) => (
              <Skeleton
                key={c}
                className={cn('h-4', c === 0 && selectable ? 'w-4' : 'w-3/4')}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
