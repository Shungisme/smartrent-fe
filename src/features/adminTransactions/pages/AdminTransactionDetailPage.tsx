'use client'

import { ArrowLeft } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/atoms/Button'
import { useAdminTransactionDetail } from '../hooks/useAdminTransactions'
import { TransactionTimelineComponent } from '../components/TransactionTimeline'
import {
  formatDateTime,
  formatPhoneNumber,
  formatVND,
  getPaymentGatewayLabel,
  getPaymentStatusLabel,
  getPaymentTypeLabel,
  formatDate,
} from '../utils/formatters'

/**
 * Admin Transaction Detail Page
 */
export const AdminTransactionDetailPage = () => {
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
          Quay lại
        </Button>
        <div className='rounded-lg border border-red-200 bg-red-50 p-6'>
          <p className='text-red-800'>
            {error
              ? 'Không thể tải chi tiết giao dịch'
              : 'Giao dịch không tìm thấy'}
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
            Quay lại
          </Button>
          <h1 className='text-3xl font-bold text-gray-900'>
            Chi tiết giao dịch
          </h1>
        </div>
        <div className={getStatusBadgeClass(transaction.status)}>
          {getPaymentStatusLabel(transaction.status)}
        </div>
      </div>

      {/* Main Info */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
        {/* Transaction Summary */}
        <div className='rounded-lg border border-gray-200 p-6 bg-white'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Thông tin giao dịch
          </h2>
          <div className='space-y-4'>
            <div>
              <p className='text-sm text-gray-600'>Mã giao dịch</p>
              <p className='text-lg font-semibold text-gray-900'>
                {transaction.transactionCode}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Mã idempotency</p>
              <p className='font-mono text-sm text-gray-700'>
                {transaction.idempotencyKey}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Số tiền</p>
              <p className='text-2xl font-bold text-gray-900'>
                {formatVND(transaction.amount)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Loại thanh toán</p>
              <p className='text-gray-900'>
                {getPaymentTypeLabel(transaction.paymentType)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Cổng thanh toán</p>
              <p className='text-gray-900'>
                {getPaymentGatewayLabel(transaction.paymentGateway)}
              </p>
            </div>
            {transaction.paymentMethod && (
              <div>
                <p className='text-sm text-gray-600'>Phương thức thanh toán</p>
                <p className='text-gray-900'>{transaction.paymentMethod}</p>
              </div>
            )}
          </div>
        </div>

        {/* Dates Info */}
        <div className='rounded-lg border border-gray-200 p-6 bg-white'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Thông tin thời gian
          </h2>
          <div className='space-y-4'>
            <div>
              <p className='text-sm text-gray-600'>Ngày tạo</p>
              <p className='text-gray-900'>
                {formatDateTime(transaction.createdAt)}
              </p>
            </div>
            {transaction.completedAt && (
              <div>
                <p className='text-sm text-gray-600'>Ngày hoàn thành</p>
                <p className='text-gray-900'>
                  {formatDateTime(transaction.completedAt)}
                </p>
              </div>
            )}
            {transaction.expiredAt && (
              <div>
                <p className='text-sm text-gray-600'>Ngày hết hạn</p>
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
          Thông tin khách hàng
        </h2>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-3'>
            <p className='text-sm text-gray-600'>Tên khách hàng</p>
            <p className='text-lg font-medium text-gray-900'>
              {transaction.customer.name}
            </p>
            <p className='text-sm text-gray-600'>ID</p>
            <p className='font-mono text-sm text-gray-700'>
              {transaction.customer.customerId}
            </p>
          </div>
          <div className='space-y-3'>
            <p className='text-sm text-gray-600'>Email</p>
            <p className='text-gray-900'>{transaction.customer.email || '-'}</p>
            <p className='text-sm text-gray-600'>Số điện thoại</p>
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
            Thông tin chủ nhà
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-3'>
              <p className='text-sm text-gray-600'>Tên chủ nhà</p>
              <p className='text-lg font-medium text-gray-900'>
                {transaction.landlord.name}
              </p>
              <p className='text-sm text-gray-600'>ID</p>
              <p className='font-mono text-sm text-gray-700'>
                {transaction.landlord.landlordId}
              </p>
            </div>
            <div className='space-y-3'>
              <p className='text-sm text-gray-600'>Số điện thoại</p>
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
            Thông tin hóa đơn & phòng
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {transaction.invoice && (
              <div className='space-y-3'>
                <p className='text-sm text-gray-600'>Mã hóa đơn</p>
                <p className='text-lg font-medium text-gray-900'>
                  {transaction.invoice.invoiceCode}
                </p>
                <p className='text-sm text-gray-600'>ID</p>
                <p className='font-mono text-sm text-gray-700'>
                  {transaction.invoice.invoiceId}
                </p>
                {transaction.invoice.status && (
                  <>
                    <p className='text-sm text-gray-600'>Trạng thái</p>
                    <p className='text-gray-900'>
                      {transaction.invoice.status}
                    </p>
                  </>
                )}
              </div>
            )}
            {transaction.room && (
              <div className='space-y-3'>
                <p className='text-sm text-gray-600'>Mã phòng</p>
                <p className='text-lg font-medium text-gray-900'>
                  {transaction.room.roomCode}
                </p>
                <p className='text-sm text-gray-600'>Tên phòng</p>
                <p className='text-gray-900'>{transaction.room.roomName}</p>
                {transaction.room.address && (
                  <>
                    <p className='text-sm text-gray-600'>Địa chỉ</p>
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
            Thông tin cổng thanh toán
          </h2>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {transaction.gatewayTransactionCode && (
              <div>
                <p className='text-sm text-gray-600'>Mã giao dịch cổng</p>
                <p className='font-mono text-gray-900'>
                  {transaction.gatewayTransactionCode}
                </p>
              </div>
            )}
            {transaction.gatewayResponseCode && (
              <div>
                <p className='text-sm text-gray-600'>Mã phản hồi</p>
                <p className='font-mono text-gray-900'>
                  {transaction.gatewayResponseCode}
                </p>
              </div>
            )}
          </div>

          {transaction.providerPayload && (
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <p className='text-sm text-gray-600 mb-2'>Payload từ cổng</p>
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
            Lý do thất bại
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
