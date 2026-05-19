import * as React from 'react'
import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateProps extends Omit<React.ComponentProps<'div'>, 'title'> {
  icon?: LucideIcon
  title: React.ReactNode
  description?: React.ReactNode
  /** Primary call-to-action (e.g. a "Create" button). */
  action?: React.ReactNode
}

/**
 * Consistent "nothing here yet" state: icon, title, supporting copy and an
 * optional CTA. Use for empty tables, empty search results and blank sections
 * instead of a lone line of muted text.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-14 text-center',
        className,
      )}
      {...props}
    >
      <div className='flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground'>
        <Icon className='h-6 w-6' />
      </div>
      <p className='mt-4 text-sm font-semibold text-foreground'>{title}</p>
      {description && (
        <p className='mt-1 max-w-sm text-sm text-muted-foreground'>
          {description}
        </p>
      )}
      {action && <div className='mt-5'>{action}</div>}
    </div>
  )
}
