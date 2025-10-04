import React, { useState } from 'react'
import AdminLayout from '@/components/layouts/AdminLayout'
import Breadcrumb from '@/components/molecules/breadcrumb'
import StatsCard from '@/components/molecules/statsCard'
import RevenueChart from '@/components/molecules/revenueChart'
import DonutChart from '@/components/molecules/donutChart'
import PerformanceChart from '@/components/molecules/performanceChart'
import InvoiceCard, { InvoiceData } from '@/components/molecules/invoiceCard'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import type { NextPageWithLayout } from '@/types/next-page'
import {
  DollarSign,
  FileText,
  AlertCircle,
  TrendingUp,
  FileCheck,
  FilePlus,
  Download,
  BarChart3,
  Calendar,
} from 'lucide-react'

// Mock recent invoices data
const recentInvoices: InvoiceData[] = [
  {
    id: 'INV-2024-001',
    customerName: 'Nguyễn Văn An',
    dueDate: '15/01/2024',
    status: 'paid',
    amount: '15.0M ₫',
  },
  {
    id: 'INV-2024-002',
    customerName: 'Trần Thị Bình',
    dueDate: '20/01/2024',
    status: 'unpaid',
    amount: '22.0M ₫',
  },
  {
    id: 'INV-2024-003',
    customerName: 'Lê Văn Cường',
    dueDate: '12/01/2024',
    status: 'overdue',
    amount: '18.5M ₫',
  },
  {
    id: 'INV-2024-004',
    customerName: 'Phạm Thị Dung',
    dueDate: '18/01/2024',
    status: 'paid',
    amount: '25.0M ₫',
  },
  {
    id: 'INV-2024-005',
    customerName: 'Hoàng Văn Em',
    dueDate: '25/01/2024',
    status: 'unpaid',
    amount: '20.0M ₫',
  },
]

const FinancialManagement: NextPageWithLayout = () => {
  const [dateRange, setDateRange] = useState('01/10/2025 - 31/10/2025')

  const breadcrumbItems = [
    { label: 'Thực Đơn Điều Hướng' },
    { label: 'Quản Lý Tài Chính' },
    { label: 'Tổng Quan' },
  ]

  const quickAccessButtons = [
    { icon: <FileText className='h-5 w-5' />, label: 'Danh Sách Hóa Đơn' },
    { icon: <FilePlus className='h-5 w-5' />, label: 'Tạo Hóa Đơn Mới' },
    { icon: <Download className='h-5 w-5' />, label: 'Xuất Báo Cáo' },
    { icon: <BarChart3 className='h-5 w-5' />, label: 'Phân Tích Chi Tiết' },
  ]

  return (
    <div>
      <Breadcrumb items={breadcrumbItems} />

      <div className='space-y-6'>
        {/* Header Section */}
        <div className='flex items-start justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>
              Quản Lý Tài Chính
            </h1>
            <p className='mt-1 text-sm text-gray-600'>
              Theo dõi doanh thu, hóa đơn và các chỉ số tài chính của hệ thống
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <div className='relative'>
              <Calendar className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                type='text'
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className='w-64 pl-10'
              />
            </div>
            <Button className='bg-blue-600 hover:bg-blue-700 text-white'>
              <FilePlus className='mr-2 h-4 w-4' />
              Tạo Hóa Đơn Mới
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <StatsCard
            title='Tổng Doanh Thu'
            value='2.8B ₫'
            trend={{ value: '+15.2% so với tháng trước', isPositive: true }}
            icon={<DollarSign className='h-6 w-6' />}
          />

          <StatsCard
            title='Hóa Đơn Đã Thanh Toán'
            value='124'
            subtitle='87% tổng số hóa đơn'
            icon={<FileCheck className='h-6 w-6' />}
          />

          <StatsCard
            title='Hóa Đơn Chưa Thanh Toán'
            value='18'
            badge={{ text: '7 quá hạn', variant: 'danger' }}
            icon={<AlertCircle className='h-6 w-6' />}
          />

          <StatsCard
            title='Giá Trị Trung Bình Hóa Đơn'
            value='18.5M ₫'
            subtitle='Dựa trên 142 hóa đơn'
            icon={<TrendingUp className='h-6 w-6' />}
          />
        </div>

        {/* Charts Section */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <RevenueChart />
          <DonutChart />
        </div>

        {/* Quick Access + Recent Invoices */}
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* Quick Access */}
          <div className='rounded-2xl border border-gray-200 bg-white p-6'>
            <h3 className='mb-4 text-lg font-semibold text-gray-900'>
              Truy Cập Nhanh
            </h3>
            <div className='space-y-2'>
              {quickAccessButtons.map((button, index) => (
                <Button
                  key={index}
                  variant='outline'
                  className='w-full justify-start'
                >
                  {button.icon}
                  <span className='ml-2'>{button.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className='lg:col-span-2 rounded-2xl border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Hóa Đơn Gần Đây
              </h3>
              <Button variant='ghost' size='sm'>
                Xem tất cả
              </Button>
            </div>
            <div className='space-y-3'>
              {recentInvoices.map((invoice) => (
                <InvoiceCard key={invoice.id} invoice={invoice} />
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <PerformanceChart />
      </div>
    </div>
  )
}

FinancialManagement.getLayout = function getLayout(page: React.ReactNode) {
  return <AdminLayout activeItem='finance'>{page}</AdminLayout>
}

export default FinancialManagement
