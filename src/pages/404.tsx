import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/atoms/button'

export default function Custom404() {
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center items-center px-6'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-gray-900 mb-4'>404</h1>
        <h2 className='text-2xl font-semibold text-gray-700 mb-4'>
          Trang không tìm thấy
        </h2>
        <p className='text-gray-600 mb-8 max-w-md'>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className='space-y-4'>
          <Button asChild>
            <Link href='/admin'>Về Trang Quản Trị</Link>
          </Button>
          <div>
            <Button variant='outline' asChild>
              <Link href='/admin/users'>Quản Lý Người Dùng</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
