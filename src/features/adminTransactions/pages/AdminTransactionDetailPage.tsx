'use client'

import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/atoms/button'
import { useAdminTransactionDetail } from '../hooks/useAdminTransactions'
import { TransactionTimelineComponent } from '../components/TransactionTimeline'
import {
  formatDateTime,
  formatPhoneNumber,
  formatVND,
  getPaymentGatewayLabel,
} from '../utils/formatters'

/**
 * Admin Transaction Detail Page
 */
export const AdminTransactionDetailPage = () => {
  const t = useTranslations('transactions')
  const router = useRouter()
  const params = useParams()
  const transactionId = params.transactionId as string

  const {
    data: transaction,
    isLoading,
    error,
  } = useAdminTransactionDetail(transactionId)

  const getStatusBadgeClass = (status: string): string => {
    const baseClass = 'px-4 py-2 rounded-full text-sm font-medium'
    const colorClass: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      REFUNDED: 'bg-blue-100 text-blue-800',
    }
    return `${baseClass} ${colorClass[status] || colorClass.PENDING}`
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className='space-y-6'>
        <Button variant='ghost' onClick={() => router.back()} className='gap-2'>
          <ArrowLeft className='h-4 w-4' />
          {t('detail.back')}
        </Button>
        <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
          <p className='text-red-800'>
            {error ? t('detail.loadError') : t('detail.notFound')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <Button
            variant='ghost'
            onClick={() => router.back()}
            className='gap-2 mb-4'
          >
            <ArrowLeft className='h-4 w-4' />
            {t('detail.back')}
          </Button>
          <h1 className='text-3xl font-bold text-gray-900'>
            {t('detail.title')}
          </h1>
        </div>
        <div className={getStatusBadgeClass(transaction.status)}>
          {t(`status.${transaction.status}`)}
        </div>
      </div>

      {/* Main Info */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Transaction Summary */}
        <div className='rounded-lg border border-gray-200 p-6 bg-white'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            {t('detail.transactionInfo')}
          </h2>
          <div className='space-y-4'>
            <div>
              <p className='text-sm text-gray-600'>
                {t('detail.transactionCode')}
              </p>
              <p className='text-lg font-semibold text-gray-900'>
                {transaction.transactionCode}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>
                {t('detail.idempotencyKey')}
              </p>
              <p className='font-mono text-sm text-gray-700'>
                {transaction.idempotencyKey}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>{t('detail.amount')}</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatVND(transaction.amount)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>{t('detail.paymentType')}</p>
              <p className='text-gray-900'>
                {t(`type.${transaction.paymentType}`)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>{t('detail.gateway')}</p>
              <p className='text-gray-900'>
                {getPaymentGatewayLabel(transaction.paymentGateway)}
              </p>
            </div>
            {transaction.paymentMethod && (
              <div>
                <p className='text-sm text-gray-600'>
                  {t('detail.paymentMethod')}
                </p>
                <p className='text-gray-900'>{transaction.paymentMethod}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dates Info */}
        <div className='rounded-lg border border-gray-200 p-6 bg-white'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            {t('detail.dates')}
          </h2>
          <div className='space-y-4'>
            <div>
              <p className='text-sm text-gray-600'>{t('detail.created')}</p>
              <p className='text-gray-900'>
                {formatDateTime(transaction.createdAt)}
              </p>
            </div>
            {transaction.completedAt && (
              <div>
                <p className='text-sm text-gray-600'>{t('detail.completed')}</p>
                <p className='text-gray-900'>
                  {formatDateTime(transaction.completedAt)}
                </p>
              </div>
            )}
            {transaction.expiredAt && (
              <div>
                <p className='text-sm text-gray-600'>{t('detail.expired')}</p>
                <p className='text-gray-900'>
                  {formatDateTime(transaction.expiredAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className='rounded-lg border border-gray-200 p-6 bg-white'>
        <h2 className='text-lg font-semibold text-gray-900 mb-4'>
          {t('detail.customerInfo')}
        </h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-3'>
            <p className='text-sm text-gray-600'>{t('detail.name')}</p>
            <p className='text-lg font-medium text-gray-900'>
              {transaction.customer.name}
            </p>
            <p className='text-sm text-gray-600'>ID</p>
            <p className='font-mono text-sm text-gray-700'>
              {transaction.customer.customerId}
            </p>
          </div>
          <div className='space-y-3'>
            <p className='text-sm text-gray-600'>{t('detail.email')}</p>
            <p className='text-gray-900'>{transaction.customer.email || '-'}</p>
            <p className='text-sm text-gray-600'>{t('detail.phone')}</p>
            <p className='text-gray-900'>
              {formatPhoneNumber(transaction.customer.phone)}
            </p>
          </div>
        </div>
      </div>

      {/* Landlord Info */}
      {transaction.landlord && (
        <div className='rounded-lg border border-gray-200 p-6 bg-white'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            {t('detail.landlordInfo')}
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-3'>
              <p className='text-sm text-gray-600'>{t('detail.name')}</p>
              <p className='text-lg font-medium text-gray-900'>
                {transaction.landlord.name}
              </p>
              <p className='text-sm text-gray-600'>{t('detail.id')}</p>
              <p className='font-mono text-sm text-gray-700'>
                {transaction.landlord.landlordId}
              </p>
            </div>
            <div className='space-y-3'>
              <p className='text-sm text-gray-600'>{t('detail.phone')}</p>
              <p className='text-gray-900'>
                {formatPhoneNumber(transaction.landlord.phone)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice & Room Info */}
      {(transaction.invoice || transaction.room) && (
        <div className='rounded-lg border border-gray-200 p-6 bg-white'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            {t('detail.invoiceInfo')}
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {transaction.invoice && (
              <div className='space-y-3'>
                <p className='text-sm text-gray-600'>
                  {t('detail.invoiceCode')}
                </p>
                <p className='text-lg font-medium text-gray-900'>
                  {transaction.invoice.invoiceCode}
                </p>
                <p className='text-sm text-gray-600'>{t('detail.id')}</p>
                <p className='font-mono text-sm text-gray-700'>
                  {transaction.invoice.invoiceId}
                </p>
                {transaction.invoice.status && (
                  <>
                    <p className='text-sm text-gray-600'>{t('table.status')}</p>
                    <p className='text-gray-900'>
                      {transaction.invoice.status}
                    </p>
                  </>
                )}
              </div>
            )}
            {transaction.room && (
              <div className='space-y-3'>
                <p className='text-sm text-gray-600'>{t('detail.roomCode')}</p>
                <p className='text-lg font-medium text-gray-900'>
                  {transaction.room.roomCode}
                </p>
                <p className='text-sm text-gray-600'>{t('detail.roomName')}</p>
                <p className='text-gray-900'>{transaction.room.roomName}</p>
                {transaction.room.address && (
                  <>
                    <p className='text-sm text-gray-600'>
                      {t('detail.address')}
                    </p>
                    <p className='text-gray-900'>{transaction.room.address}</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gateway Info */}
      {(transaction.gatewayTransactionCode ||
        transaction.gatewayResponseCode) && (
        <div className='rounded-lg border border-gray-200 p-6 bg-white'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            {t('detail.gatewayInfo')}
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {transaction.gatewayTransactionCode && (
              <div>
                <p className='text-sm text-gray-600'>
                  {t('detail.gatewayTransaction')}
                </p>
                <p className='font-mono text-gray-900'>
                  {transaction.gatewayTransactionCode}
                </p>
              </div>
            )}
            {transaction.gatewayResponseCode && (
              <div>
                <p className='text-sm text-gray-600'>
                  {t('detail.responseCode')}
                </p>
                <p className='font-mono text-gray-900'>
                  {transaction.gatewayResponseCode}
                </p>
              </div>
            )}
          </div>

          {transaction.providerPayload && (
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <p className='text-sm text-gray-600 mb-2'>
                {t('detail.payload')}
              </p>
              <pre className='bg-gray-50 p-4 rounded text-xs text-gray-700 overflow-x-auto'>
                {JSON.stringify(transaction.providerPayload, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Failure Reason */}
      {transaction.failureReason && (
        <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
          <h2 className='text-lg font-semibold text-red-900 mb-4'>
            {t('detail.failureReason')}
          </h2>
          <p className='text-red-700'>{transaction.failureReason}</p>
        </div>
      )}

      {/* Timeline */}
      {transaction.timeline && transaction.timeline.length > 0 && (
        <TransactionTimelineComponent timeline={transaction.timeline} />
      )}
    </div>
  )
}
