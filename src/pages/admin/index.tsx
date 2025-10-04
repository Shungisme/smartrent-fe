import React from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import type { NextPageWithLayout } from '@/types/next-page'

const AdminDashboard: NextPageWithLayout = () => {
  return (
    <div>
      <h1 className='text-3xl font-bold text-gray-900 mb-6'>
        Bảng Điều Khiển Quản Trị
      </h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Stats Cards */}
        <div className='bg-white p-6 rounded-2xl border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Tổng Người Dùng</p>
              <p className='text-2xl font-bold text-gray-900'>1,234</p>
            </div>
            <div className='text-blue-500 text-2xl'>👥</div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-2xl border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Bài Đăng Chờ Duyệt</p>
              <p className='text-2xl font-bold text-gray-900'>45</p>
            </div>
            <div className='text-yellow-500 text-2xl'>📝</div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-2xl border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Báo Cáo Vi Phạm</p>
              <p className='text-2xl font-bold text-gray-900'>12</p>
            </div>
            <div className='text-red-500 text-2xl'>⚠️</div>
          </div>
        </div>

        <div className='bg-white p-6 rounded-2xl border border-gray-200'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-gray-600'>Doanh Thu Tháng</p>
              <p className='text-2xl font-bold text-gray-900'>₫52.4M</p>
            </div>
            <div className='text-green-500 text-2xl'>💰</div>
          </div>
        </div>
      </div>

      <div className='mt-8 text-center text-gray-600'>
        <p>Chào mừng đến với SmartRent Admin Panel</p>
        <p className='mt-2'>
          Sử dụng thanh điều hướng bên trái để truy cập các tính năng quản trị.
        </p>
      </div>
    </div>
  )
}

AdminDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='dashboard'>{page}</AdminLayout>
}

export default AdminDashboard
