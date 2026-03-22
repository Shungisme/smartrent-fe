'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import StatsCard from '@/components/molecules/statsCard'
import RevenueChart from '@/components/molecules/revenueChart'
import DonutChart from '@/components/molecules/donutChart'
import PerformanceChart from '@/components/molecules/performanceChart'
import InvoiceCard, { InvoiceData } from '@/components/molecules/invoiceCard'
import { Button } from '@/components/atoms/button'
import { Input } from '@/components/atoms/input'
import {
  DollarSign,
  FileText,
  AlertCircle,
  TrendingUp,
  FileCheck,
  Plus,
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

const FinancialManagement = () => {
  const t = useTranslations('admin.finance')
  const [dateRange, setDateRange] = useState('01/10/2025 - 31/10/2025')

  const quickAccessButtons = [
    { icon: <FileText className='h-5 w-5' />, label: t('buttons.invoiceList') },
    {
      icon: <Plus className='h-5 w-5' />,
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
    <div className='section-stack'>
      <div className='section-stack'>
        {/* Top Actions */}
        <div className='flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end'>
          <div className='relative'>
            <Calendar className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              type='text'
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className='w-full sm:w-64 pl-10'
            />
          </div>
          <Button className='w-full sm:w-auto'>
            <Plus className='h-4 w-4' />
            {t('buttons.createInvoice')}
          </Button>
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
          <div className='surface-card flex flex-col gap-3 p-6'>
            <h3 className='mb-4 text-lg font-semibold text-foreground'>
              {t('sections.quickAccess')}
            </h3>
            <div className='space-y-3'>
              {quickAccessButtons.map((button, index) => (
                <Button
                  key={index}
                  variant='outline'
                  className='h-11 w-full justify-start px-4'
                >
                  {button.icon}
                  <span className='ml-2'>{button.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Recent Invoices */}
          <div className='surface-card p-6 lg:col-span-2'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-foreground'>
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

export default FinancialManagement
