import React from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/atoms/button'
import { cn } from '@/lib/utils'
import type { PaginationConfig } from './types'

interface TablePaginationProps {
  pagination: PaginationConfig
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  itemsPerPageOptions?: number[]
}

export function TablePagination({
  pagination,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [5, 10, 20, 50],
}: TablePaginationProps) {
  const t = useTranslations('pagination')
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')

      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) pages.push(i)
      }

      if (currentPage < totalPages - 2) pages.push('...')
      if (!pages.includes(totalPages)) pages.push(totalPages)
    }

    return pages
  }

  if (totalItems === 0) return null

  return (
    <div className='flex flex-col items-center justify-between gap-3 px-1 py-2 sm:flex-row'>
      <div className='flex flex-col items-center gap-3 text-sm text-muted-foreground sm:flex-row'>
        <span>
          {t('showing')}{' '}
          <span className='font-medium text-foreground'>{startItem}</span>{' '}
          {t('to')}{' '}
          <span className='font-medium text-foreground'>{endItem}</span>{' '}
          {t('of')}{' '}
          <span className='font-medium text-foreground'>{totalItems}</span>{' '}
          {t('results')}
        </span>

        <div className='flex items-center gap-2'>
          <span>{t('show')}</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className='h-8 rounded-md border border-border bg-card px-2 text-sm text-foreground shadow-xs focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30'
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span>{t('perPage')}</span>
        </div>
      </div>

      <div className='flex items-center gap-1'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className='h-8 w-8 p-0'
          aria-label='Previous page'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        <div className='flex items-center gap-1'>
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className='px-1 text-muted-foreground/70'
                >
                  …
                </span>
              )
            }

            const pageNum = page as number
            const isActive = pageNum === currentPage

            return (
              <button
                key={pageNum}
                type='button'
                onClick={() => onPageChange(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground',
                )}
              >
                {pageNum}
              </button>
            )
          })}
        </div>

        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className='h-8 w-8 p-0'
          aria-label='Next page'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
