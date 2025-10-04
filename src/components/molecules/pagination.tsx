import React from 'react'
import { Button } from '@/components/atoms/button'

type PaginationProps = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  return (
    <div className='flex items-center justify-between mt-6'>
      <div className='text-sm text-gray-700'>
        Hiển thị <span className='font-medium'>{startItem}</span> đến{' '}
        <span className='font-medium'>{endItem}</span> trong tổng số{' '}
        <span className='font-medium'>{totalItems}</span> người dùng
      </div>

      <div className='flex items-center gap-2'>
        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Trang trước
        </Button>

        <div className='flex items-center gap-1'>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size='sm'
              onClick={() => onPageChange(page)}
              className='w-8 h-8 p-0'
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant='outline'
          size='sm'
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Trang sau
        </Button>
      </div>
    </div>
  )
}

export default Pagination
