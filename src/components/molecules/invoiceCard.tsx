import React from 'react'
import { useTranslations } from 'next-intl'
import { Badge } from '@/components/atoms/badge'
import { cn } from '@/lib/utils'

export type InvoiceStatus = 'paid' | 'unpaid' | 'overdue'

export type InvoiceData = {
  id: string
  customerName: string
  dueDate: string
  status: InvoiceStatus
  amount: string
}

type InvoiceCardProps = {
  invoice: InvoiceData
  className?: string
}

const getStatusColor = (status: InvoiceStatus): string => {
  const colors: Record<InvoiceStatus, string> = {
    paid: 'bg-green-100 text-green-800 border-green-200',
    unpaid: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    overdue: 'bg-red-100 text-red-800 border-red-200',
  }
  return colors[status]
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({ invoice, className }) => {
  const t = useTranslations('admin.finance.invoice')

  const getStatusLabel = (status: InvoiceStatus): string => {
    return t(`status.${status}`)
  }
  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-300 hover:shadow-md',
        className,
      )}
    >
      <div className='flex-1'>
        <div className='flex items-center gap-3'>
          <span className='font-mono text-sm font-medium text-gray-900'>
            {invoice.id}
          </span>
          <Badge
            variant='outline'
            className={cn('text-xs', getStatusColor(invoice.status))}
          >
            {getStatusLabel(invoice.status)}
          </Badge>
        </div>
        <p className='mt-1 text-sm font-medium text-gray-700'>
          {invoice.customerName}
        </p>
        <p className='mt-0.5 text-xs text-gray-500'>
          {t('dueDate')} {invoice.dueDate}
        </p>
      </div>
      <div className='text-right'>
        <p className='text-lg font-bold text-gray-900'>{invoice.amount}</p>
      </div>
    </div>
  )
}

export default InvoiceCard
