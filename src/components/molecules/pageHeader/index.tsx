import * as React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  /** Right-aligned actions (buttons, menus). */
  actions?: React.ReactNode
}

/**
 * Standard page title zone. Use at the top of every dashboard page so the
 * heading hierarchy and spacing stay consistent across the app.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      {...props}
    >
      <div className='min-w-0 space-y-1'>
        <h1 className='truncate text-2xl font-semibold tracking-tight text-foreground'>
          {title}
        </h1>
        {description && (
          <p className='text-sm text-muted-foreground'>{description}</p>
        )}
      </div>
      {actions && (
        <div className='flex shrink-0 items-center gap-2'>{actions}</div>
      )}
    </div>
  )
}
