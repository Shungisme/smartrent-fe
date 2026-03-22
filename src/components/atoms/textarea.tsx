import * as React from 'react'

import { cn } from '@/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'placeholder:text-muted-foreground/90 border-input flex min-h-28 w-full rounded-md border bg-card px-3 py-2 text-sm shadow-xs transition-[border-color,box-shadow,background-color] outline-none disabled:cursor-not-allowed disabled:opacity-60',
        'hover:border-border focus-visible:border-primary/60 focus-visible:ring-4 focus-visible:ring-ring',
        'aria-invalid:ring-destructive/25 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
