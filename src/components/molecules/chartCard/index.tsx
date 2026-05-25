import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'

interface ChartCardProps {
  title: React.ReactNode
  description?: React.ReactNode
  /** Right-side adornment in the header (e.g. trend chip, dropdown). */
  toolbar?: React.ReactNode
  /** Tailwind height utility for the chart body. Default: `h-64`. */
  bodyHeight?: string
  /** Replace the chart body with this content (used for empty/loading states). */
  empty?: React.ReactNode
  /** Footnote shown below the chart (e.g. units). */
  footer?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  toolbar,
  bodyHeight = 'h-64',
  empty,
  footer,
  className,
  children,
}) => {
  return (
    <Card
      className={cn('gap-4 py-5 transition-shadow hover:shadow-md', className)}
    >
      <CardHeader className='pb-0'>
        <div className='flex items-start justify-between gap-3'>
          <div className='min-w-0 space-y-0.5'>
            <CardTitle className='text-base font-semibold tracking-tight md:text-[15px]'>
              {title}
            </CardTitle>
            {description && (
              <p className='text-xs text-muted-foreground'>{description}</p>
            )}
          </div>
          {toolbar && <div className='shrink-0'>{toolbar}</div>}
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        <div className={cn('relative w-full', bodyHeight)}>
          {empty ?? children}
        </div>
        {footer && (
          <div className='text-xs text-muted-foreground'>{footer}</div>
        )}
      </CardContent>
    </Card>
  )
}

export default ChartCard
