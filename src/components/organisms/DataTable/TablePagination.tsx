import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/atoms/button'
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
  const { currentPage, totalPages, totalItems, itemsPerPage } = pagination

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const canGoPrevious = currentPage > 1
  const canGoNext = currentPage < totalPages

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('...')
      }

      // Show pages around current page
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...')
      }

      // Show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalItems === 0) return null

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3 md:px-6'>
      {/* Items info & per page selector */}
      <div className='flex flex-col sm:flex-row items-center gap-3 text-sm text-gray-700'>
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>

        <div className='flex items-center gap-2'>
          <span className='text-gray-500'>Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className='rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className='text-gray-500'>per page</span>
        </div>
      </div>

      {/* Pagination controls */}
      <div className='flex items-center gap-2'>
        {/* Previous button */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className='h-8 w-8 p-0'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>

        {/* Page numbers */}
        <div className='flex items-center gap-1'>
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className='px-2 text-gray-400'>
                  ...
                </span>
              )
            }

            const pageNum = page as number
            const isActive = pageNum === currentPage

            return (
              <Button
                key={pageNum}
                variant={isActive ? 'default' : 'outline'}
                size='sm'
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 p-0 ${
                  isActive
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                {pageNum}
              </Button>
            )
          })}
        </div>

        {/* Next button */}
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className='h-8 w-8 p-0'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
