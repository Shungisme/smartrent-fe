import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import AdminLayout from '@/components/layouts/AdminLayout'
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
  const t = useTranslations('admin.finance')
  const [dateRange, setDateRange] = useState('01/10/2025 - 31/10/2025')

  const quickAccessButtons = [
    { icon: <FileText className='h-5 w-5' />, label: t('buttons.invoiceList') },
    {
      icon: <FilePlus className='h-5 w-5' />,
      label: t('buttons.createInvoice'),
    },
    {
      icon: <Download className='h-5 w-5' />,
      label: t('buttons.exportReport'),
    },
    {
      icon: <BarChart3 className='h-5 w-5' />,
      label: t('buttons.detailedAnalysis'),
    },
  ]

  return (
    <div>
      <div className='space-y-6'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row items-start lg:items-start justify-between gap-4'>
          <div>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-900'>
              {t('title')}
            </h1>
            <p className='mt-1 text-sm text-gray-600'>{t('subtitle')}</p>
          </div>

          <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto'>
            <div className='relative'>
              <Calendar className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                type='text'
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className='w-full sm:w-64 pl-10'
              />
            </div>
            <Button className='bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto'>
              <FilePlus className='mr-2 h-4 w-4' />
              {t('buttons.createInvoice')}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
          <StatsCard
            title={t('stats.totalRevenue')}
            value='2.8B ₫'
            trend={{
              value: `+15.2% ${t('stats.comparedToLastMonth')}`,
              isPositive: true,
            }}
            icon={<DollarSign className='h-6 w-6' />}
          />

          <StatsCard
            title={t('stats.paidInvoices')}
            value='124'
            subtitle={`87% ${t('stats.ofTotalInvoices')}`}
            icon={<FileCheck className='h-6 w-6' />}
          />

          <StatsCard
            title={t('stats.unpaidInvoices')}
            value='18'
            badge={{ text: `7 ${t('stats.overdue')}`, variant: 'danger' }}
            icon={<AlertCircle className='h-6 w-6' />}
          />

          <StatsCard
            title={t('stats.avgInvoiceValue')}
            value='18.5M ₫'
            subtitle={t('stats.basedOnInvoices')}
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
              {t('sections.quickAccess')}
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
                {t('sections.recentInvoices')}
              </h3>
              <Button variant='ghost' size='sm'>
                {t('buttons.viewAll')}
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
