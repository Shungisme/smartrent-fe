import React from 'react'
import Link from 'next/link'
import { Home, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BreadcrumbItem } from '@/constants/navigation'

type BreadcrumbDisplayItem = BreadcrumbItem & {
  icon?: React.ReactNode
}

type BreadcrumbProps = {
  items: BreadcrumbDisplayItem[]
  separator?: React.ReactNode
  showHomeIcon?: boolean
  maxVisibleItems?: number
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  showHomeIcon = true,
  maxVisibleItems = 4,
  className,
}) => {
  const defaultSeparator = (
    <ChevronRight className='h-3.5 w-3.5 text-muted-foreground/60' />
  )

  const desktopItems =
    items.length > maxVisibleItems
      ? [items[0], ...items.slice(items.length - (maxVisibleItems - 1))]
      : items

  const mobileItems =
    items.length <= 2
      ? items
      : [items[items.length - 2], items[items.length - 1]]

  const renderItem = (
    item: BreadcrumbDisplayItem,
    index: number,
    list: BreadcrumbDisplayItem[],
  ) => {
    const isLast = index === list.length - 1
    const isFirst = index === 0
    const isDisabled = !!item.disabled

    return (
      <li key={`${item.label}-${index}`} className='flex items-center'>
        {!isFirst && (
          <span className='mx-1.5 sm:mx-2' aria-hidden='true'>
            {separator || defaultSeparator}
          </span>
        )}

        {isLast ? (
          <span
            className='inline-flex max-w-[11rem] items-center gap-1.5 truncate text-sm font-semibold text-foreground sm:max-w-[16rem]'
            aria-current='page'
          >
            {isFirst && showHomeIcon && <Home className='h-3.5 w-3.5' />}
            {item.icon && <span className='shrink-0'>{item.icon}</span>}
            <span className='truncate'>{item.label}</span>
          </span>
        ) : item.href && !isDisabled ? (
          <Link
            href={item.href}
            className='inline-flex max-w-[9rem] items-center gap-1.5 truncate rounded-sm px-1 py-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-[13rem]'
          >
            {isFirst && showHomeIcon && <Home className='h-3.5 w-3.5' />}
            {item.icon && <span className='shrink-0'>{item.icon}</span>}
            <span className='truncate'>{item.label}</span>
          </Link>
        ) : (
          <span className='inline-flex max-w-[9rem] items-center gap-1.5 truncate px-1 py-0.5 text-sm text-muted-foreground/60 sm:max-w-[13rem]'>
            {isFirst && showHomeIcon && <Home className='h-3.5 w-3.5' />}
            {item.icon && <span className='shrink-0'>{item.icon}</span>}
            <span className='truncate'>{item.label}</span>
          </span>
        )}
      </li>
    )
  }

  return (
    <nav className={cn('mb-6', className)} aria-label='Breadcrumb'>
      <ol className='hidden items-center sm:flex'>
        {desktopItems.map((item, index) => (
          <React.Fragment key={`${item.label}-${index}`}>
            {renderItem(item, index, desktopItems)}
            {items.length > maxVisibleItems && index === 0 && (
              <li className='mx-1.5 flex items-center text-muted-foreground/70 sm:mx-2'>
                {separator || defaultSeparator}
                <MoreHorizontal className='ml-1 h-3.5 w-3.5' />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>

      <ol className='flex items-center sm:hidden'>
        {mobileItems.map((item, index) => renderItem(item, index, mobileItems))}
      </ol>
    </nav>
  )
}

export default Breadcrumb
