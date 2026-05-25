import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-4 focus-visible:ring-ring aria-invalid:ring-destructive/25 aria-invalid:border-destructive transition-[color,box-shadow,background-color] overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/10 text-primary [a&]:hover:bg-primary/15',
        secondary:
          'border-transparent bg-muted text-foreground/80 [a&]:hover:bg-muted/80',
        destructive:
          'border-transparent bg-destructive/12 text-destructive [a&]:hover:bg-destructive/18 focus-visible:ring-destructive/25',
        outline:
          'border-border/80 bg-card text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        success:
          'border-transparent bg-success/12 text-success-foreground [a&]:hover:bg-success/18',
        warning:
          'border-transparent bg-warning/18 text-warning-foreground [a&]:hover:bg-warning/24',
        info: 'border-transparent bg-chart-1/12 text-chart-1 [a&]:hover:bg-chart-1/18',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot='badge'
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
