import * as React from 'react'
import { cn } from '@/lib/utils'

interface PageHeaderProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  title: React.ReactNode
  description?: React.ReactNode
  /** Small uppercase label rendered above the title (e.g. "Management"). */
  eyebrow?: React.ReactNode
  /** Right-aligned actions (buttons, menus). */
  actions?: React.ReactNode
}

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
      {...props}
    >
      <div className='min-w-0 space-y-1.5'>
        {eyebrow && (
          <div className='text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground'>
            {eyebrow}
          </div>
        )}
        <h1 className='text-xl font-semibold tracking-tight text-foreground sm:text-[1.5rem] sm:leading-[1.2]'>
          {title}
        </h1>
        {description && (
          <p className='max-w-2xl text-sm leading-relaxed text-muted-foreground'>
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className='flex shrink-0 flex-wrap items-center gap-2 sm:justify-end'>
          {actions}
        </div>
      )}
    </div>
  )
}
