import React from 'react'
import { cn } from '@/lib/utils'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'p'
    | 'blockquote'
    | 'list'
    | 'inlineCode'
    | 'lead'
    | 'large'
    | 'small'
    | 'muted'
  as?: React.ElementType
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ variant = 'p', as, className, ...props }, ref) => {
    const Component = as || getDefaultComponent(variant)

    return (
      <Component
        ref={ref}
        className={cn(getVariantClasses(variant), className)}
        {...props}
      />
    )
  },
)

Typography.displayName = 'Typography'

function getDefaultComponent(variant: TypographyProps['variant']) {
  switch (variant) {
    case 'h1':
      return 'h1'
    case 'h2':
      return 'h2'
    case 'h3':
      return 'h3'
    case 'h4':
      return 'h4'
    case 'h5':
      return 'h5'
    case 'h6':
      return 'h6'
    case 'blockquote':
      return 'blockquote'
    case 'list':
      return 'ul'
    case 'inlineCode':
      return 'code'
    case 'lead':
    case 'large':
    case 'small':
    case 'muted':
    case 'p':
    default:
      return 'p'
  }
}

function getVariantClasses(variant: TypographyProps['variant']) {
  switch (variant) {
    case 'h1':
      return 'scroll-m-20 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl'
    case 'h2':
      return 'scroll-m-20 text-2xl font-semibold tracking-tight text-foreground md:text-3xl first:mt-0'
    case 'h3':
      return 'scroll-m-20 text-xl font-semibold tracking-tight text-foreground md:text-2xl'
    case 'h4':
      return 'scroll-m-20 text-lg font-semibold tracking-tight text-foreground'
    case 'h5':
      return 'scroll-m-20 text-base font-semibold tracking-tight text-foreground'
    case 'h6':
      return 'scroll-m-20 text-sm font-semibold tracking-tight text-muted-foreground'
    case 'blockquote':
      return 'mt-6 border-l-2 pl-6 italic'
    case 'list':
      return 'my-6 ml-6 list-disc [&>li]:mt-2'
    case 'inlineCode':
      return 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'
    case 'lead':
      return 'text-lg text-muted-foreground md:text-xl'
    case 'large':
      return 'text-base font-semibold text-foreground md:text-lg'
    case 'p':
      return 'text-sm leading-6 text-foreground md:text-base md:leading-7'
    case 'small':
      return 'text-xs font-medium leading-5 md:text-sm'
    case 'muted':
      return 'text-sm text-muted-foreground'
    default:
      return ''
  }
}

export { Typography }
