'use client'

import {
  Receipt,
  CalendarClock,
  User,
  Building2,
  Landmark,
  AlertTriangle,
  type LucideIcon,
} from 'lucide-react'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { useAdminTransactionDetail } from '../hooks/useAdminTransactions'
import { TransactionTimelineComponent } from '../components/TransactionTimeline'
import {
  formatDateTime,
  formatPhoneNumber,
  formatVND,
  getPaymentGatewayLabel,
} from '../utils/formatters'

const STATUS_BADGE_CLASS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  SUCCESS: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  REFUNDED: 'bg-blue-100 text-blue-800',
}

/** A titled card section with a leading accent icon. */
const SectionCard: React.FC<{
  icon: LucideIcon
  title: string
  children: React.ReactNode
}> = ({ icon: Icon, title, children }) => (
  <div className='rounded-xl border border-border/70 bg-card p-6 shadow-sm'>
    <div className='mb-4 flex items-center gap-2 text-base font-semibold text-foreground'>
      <Icon className='h-4 w-4 text-primary' />
      {title}
    </div>
    {children}
  </div>
)

/** A label/value pair. */
const Field: React.FC<{
  label: string
  value: React.ReactNode
  mono?: boolean
}> = ({ label, value, mono }) => (
  <div className='min-w-0'>
    <p className='text-xs font-medium text-muted-foreground'>{label}</p>
    <p
      className={cn(
        'mt-0.5 break-words text-sm text-foreground',
        mono && 'font-mono',
      )}
    >
      {value}
    </p>
  </div>
)

/**
 * Admin Transaction Detail Page
 */
export const AdminTransactionDetailPage = () => {
  const t = useTranslations('transactions')
  const params = useParams()
  const transactionId = params.transactionId as string

  const {
    data: transaction,
    isLoading,
    error,
  } = useAdminTransactionDetail(transactionId)

  if (isLoading) {
    return (
      <div className='flex h-[60vh] items-center justify-center'>
        <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-primary' />
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className='rounded-xl border border-red-200 bg-red-50 p-6'>
        <p className='text-red-800'>
          {error ? t('detail.loadError') : t('detail.notFound')}
        </p>
      </div>
    )
  }

  const typeKey = `type.${transaction.paymentType}`
  const paymentTypeLabel = t.has(typeKey) ? t(typeKey) : transaction.paymentType

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-wrap items-start justify-between gap-4'>
        <div className='min-w-0'>
          <h1 className='text-2xl font-bold text-foreground md:text-3xl'>
            {t('detail.title')}
          </h1>
          <p className='mt-1 font-mono text-sm text-muted-foreground'>
            {transaction.transactionCode}
          </p>
        </div>
        <span
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium',
            STATUS_BADGE_CLASS[transaction.status] ??
              STATUS_BADGE_CLASS.PENDING,
          )}
        >
          {t(`status.${transaction.status}`)}
        </span>
      </div>

      {/* Amount highlight */}
      <div className='rounded-xl border border-border/70 bg-card p-6 shadow-sm'>
        <p className='text-xs font-medium text-muted-foreground'>
          {t('detail.amount')}
        </p>
        <p className='mt-1 text-3xl font-bold text-primary'>
          {formatVND(transaction.amount)}
        </p>
      </div>

      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Transaction Summary */}
        <SectionCard icon={Receipt} title={t('detail.transactionInfo')}>
          <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
            <Field
              label={t('detail.transactionCode')}
              value={transaction.transactionCode}
            />
            <Field
              label={t('detail.idempotencyKey')}
              value={transaction.idempotencyKey}
              mono
            />
            <Field label={t('detail.paymentType')} value={paymentTypeLabel} />
            <Field
              label={t('detail.gateway')}
              value={getPaymentGatewayLabel(transaction.paymentGateway)}
            />
            {transaction.paymentMethod && (
              <Field
                label={t('detail.paymentMethod')}
                value={transaction.paymentMethod}
              />
            )}
          </div>
        </SectionCard>

        {/* Dates Info */}
        <SectionCard icon={CalendarClock} title={t('detail.dates')}>
          <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
            <Field
              label={t('detail.created')}
              value={formatDateTime(transaction.createdAt)}
            />
            {transaction.completedAt && (
              <Field
                label={t('detail.completed')}
                value={formatDateTime(transaction.completedAt)}
              />
            )}
            {transaction.expiredAt && (
              <Field
                label={t('detail.expired')}
                value={formatDateTime(transaction.expiredAt)}
              />
            )}
          </div>
        </SectionCard>
      </div>

      {/* Customer Info */}
      <SectionCard icon={User} title={t('detail.customerInfo')}>
        <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
          <Field label={t('detail.name')} value={transaction.customer.name} />
          <Field label='ID' value={transaction.customer.customerId} mono />
          <Field
            label={t('detail.email')}
            value={transaction.customer.email || '-'}
          />
          <Field
            label={t('detail.phone')}
            value={formatPhoneNumber(transaction.customer.phone)}
          />
        </div>
      </SectionCard>

      {/* Landlord Info */}
      {transaction.landlord && (
        <SectionCard icon={User} title={t('detail.landlordInfo')}>
          <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
            <Field label={t('detail.name')} value={transaction.landlord.name} />
            <Field
              label={t('detail.id')}
              value={transaction.landlord.landlordId}
              mono
            />
            <Field
              label={t('detail.phone')}
              value={formatPhoneNumber(transaction.landlord.phone)}
            />
          </div>
        </SectionCard>
      )}

      {/* Invoice & Room Info */}
      {(transaction.invoice || transaction.room) && (
        <SectionCard icon={Building2} title={t('detail.invoiceInfo')}>
          <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
            {transaction.invoice && (
              <>
                <Field
                  label={t('detail.invoiceCode')}
                  value={transaction.invoice.invoiceCode}
                />
                <Field
                  label={t('detail.id')}
                  value={transaction.invoice.invoiceId}
                  mono
                />
                {transaction.invoice.status && (
                  <Field
                    label={t('table.status')}
                    value={transaction.invoice.status}
                  />
                )}
              </>
            )}
            {transaction.room && (
              <>
                <Field
                  label={t('detail.roomCode')}
                  value={transaction.room.roomCode}
                />
                <Field
                  label={t('detail.roomName')}
                  value={transaction.room.roomName}
                />
                {transaction.room.address && (
                  <Field
                    label={t('detail.address')}
                    value={transaction.room.address}
                  />
                )}
              </>
            )}
          </div>
        </SectionCard>
      )}

      {/* Gateway Info */}
      {(transaction.gatewayTransactionCode ||
        transaction.gatewayResponseCode) && (
        <SectionCard icon={Landmark} title={t('detail.gatewayInfo')}>
          <div className='grid gap-x-6 gap-y-4 sm:grid-cols-2'>
            {transaction.gatewayTransactionCode && (
              <Field
                label={t('detail.gatewayTransaction')}
                value={transaction.gatewayTransactionCode}
                mono
              />
            )}
            {transaction.gatewayResponseCode && (
              <Field
                label={t('detail.responseCode')}
                value={transaction.gatewayResponseCode}
                mono
              />
            )}
          </div>

          {transaction.providerPayload && (
            <div className='mt-6 border-t border-border/60 pt-6'>
              <p className='mb-2 text-xs font-medium text-muted-foreground'>
                {t('detail.payload')}
              </p>
              <pre className='overflow-x-auto rounded-lg bg-muted/40 p-4 text-xs text-muted-foreground'>
                {JSON.stringify(transaction.providerPayload, null, 2)}
              </pre>
            </div>
          )}
        </SectionCard>
      )}

      {/* Failure Reason */}
      {transaction.failureReason && (
        <div className='rounded-xl border border-red-200 bg-red-50 p-6'>
          <div className='mb-2 flex items-center gap-2 text-base font-semibold text-red-900'>
            <AlertTriangle className='h-4 w-4' />
            {t('detail.failureReason')}
          </div>
          <p className='text-sm text-red-700'>{transaction.failureReason}</p>
        </div>
      )}

      {/* Timeline */}
      {transaction.timeline && transaction.timeline.length > 0 && (
        <TransactionTimelineComponent timeline={transaction.timeline} />
      )}
    </div>
  )
}
