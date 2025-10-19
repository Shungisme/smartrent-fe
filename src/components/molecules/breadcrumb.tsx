import React from 'react'
import Link from 'next/link'
import { Home, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type BreadcrumbItem = {
  label: string
  href?: string
  icon?: React.ReactNode
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
  separator?: React.ReactNode
  showHomeIcon?: boolean
  className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator,
  showHomeIcon = true,
  className,
}) => {
  const defaultSeparator = <ChevronRight className='h-4 w-4 text-gray-400' />

  return (
    <nav
      className={cn(
        'flex items-center space-x-1 text-sm mb-6 overflow-x-auto',
        className,
      )}
      aria-label='Breadcrumb'
    >
      <ol className='flex items-center space-x-1'>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0

          return (
            <li key={index} className='flex items-center'>
              {/* Separator - skip for first item */}
              {!isFirst && (
                <span className='mx-2' aria-hidden='true'>
                  {separator || defaultSeparator}
                </span>
              )}

              {/* Breadcrumb Item */}
              {isLast ? (
                // Current page - not clickable
                <span
                  className='flex items-center gap-1.5 font-medium text-gray-900 cursor-default'
                  aria-current='page'
                >
                  {isFirst && showHomeIcon && (
                    <Home className='h-4 w-4' aria-hidden='true' />
                  )}
                  {item.icon && (
                    <span className='flex-shrink-0' aria-hidden='true'>
                      {item.icon}
                    </span>
                  )}
                  <span className='truncate max-w-[200px] sm:max-w-none'>
                    {item.label}
                  </span>
                </span>
              ) : item.href ? (
                // Clickable link
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 text-gray-600 hover:text-gray-900',
                    'transition-colors duration-200 rounded-md px-2 py-1 -mx-2 -my-1',
                    'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                  )}
                >
                  {isFirst && showHomeIcon && (
                    <Home className='h-4 w-4' aria-hidden='true' />
                  )}
                  {item.icon && (
                    <span className='flex-shrink-0' aria-hidden='true'>
                      {item.icon}
                    </span>
                  )}
                  <span className='truncate max-w-[150px] sm:max-w-none'>
                    {item.label}
                  </span>
                </Link>
              ) : (
                // Plain text (no href)
                <span
                  className={cn(
                    'flex items-center gap-1.5 text-gray-600',
                    'px-2 py-1 -mx-2 -my-1',
                  )}
                >
                  {isFirst && showHomeIcon && (
                    <Home className='h-4 w-4' aria-hidden='true' />
                  )}
                  {item.icon && (
                    <span className='flex-shrink-0' aria-hidden='true'>
                      {item.icon}
                    </span>
                  )}
                  <span className='truncate max-w-[150px] sm:max-w-none'>
                    {item.label}
                  </span>
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
