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
    paid: 'bg-success/10 text-success-foreground border-success/30 dark:bg-success/20',
    unpaid:
      'bg-warning/10 text-warning-foreground border-warning/30 dark:bg-warning/20',
    overdue:
      'bg-destructive/10 text-destructive border-destructive/30 dark:bg-destructive/20',
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
        'flex items-center justify-between rounded-lg border border-border/70 bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md',
        className,
      )}
    >
      <div className='flex-1'>
        <div className='flex items-center gap-3'>
          <span className='font-mono text-sm font-medium text-foreground'>
            {invoice.id}
          </span>
          <Badge
            variant='outline'
            className={cn('text-xs', getStatusColor(invoice.status))}
          >
            {getStatusLabel(invoice.status)}
          </Badge>
        </div>
        <p className='mt-1 text-sm font-medium text-foreground'>
          {invoice.customerName}
        </p>
        <p className='mt-0.5 text-xs text-muted-foreground'>
          {t('dueDate')} {invoice.dueDate}
        </p>
      </div>
      <div className='text-right'>
        <p className='text-lg font-bold text-foreground'>{invoice.amount}</p>
      </div>
    </div>
  )
}

export default InvoiceCard
