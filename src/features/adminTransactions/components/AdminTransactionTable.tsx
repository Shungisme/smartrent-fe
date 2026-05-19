'use client'

import { MoreVertical } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/atoms/Button'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/atoms/Table'
import { AdminTransaction, PaymentStatus } from '../types/transaction.type'
import {
  formatDateTime,
  formatPhoneNumber,
  formatVND,
  getPaymentGatewayLabel,
  getPaymentStatusColor,
  getPaymentStatusLabel,
  getPaymentTypeLabel,
} from '../utils/formatters'

interface AdminTransactionTableProps {
  transactions: AdminTransaction[]
  isLoading?: boolean
  onViewDetails: (transactionId: string) => void
}

/**
 * Admin Transaction Table Component
 * Displays list of transactions with key information
 */
export const AdminTransactionTable = ({
  transactions,
  isLoading,
  onViewDetails,
}: AdminTransactionTableProps) => {
  const { t } = useTranslation()
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  const getStatusBadgeClass = (status: PaymentStatus): string => {
    const baseClass = 'px-3 py-1 rounded-full text-sm font-medium'
    const colorClass = {
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
      <div className='flex items-center justify-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-gray-500'>
          {t('admin.transactions?.noData') || 'Không có giao dịch nào'}
        </p>
      </div>
    )
  }

  return (
    <div className='rounded-lg border border-gray-200 overflow-hidden'>
      <Table>
        <TableHeader>
          <TableRow className='bg-gray-50'>
            <TableCell className='font-semibold'>Giao dịch</TableCell>
            <TableCell className='font-semibold'>Hóa đơn / Phòng</TableCell>
            <TableCell className='font-semibold'>Khách hàng</TableCell>
            <TableCell className='font-semibold'>Chủ nhà</TableCell>
            <TableCell className='font-semibold'>Loại</TableCell>
            <TableCell className='font-semibold'>Cổng thanh toán</TableCell>
            <TableCell className='font-semibold text-right'>Số tiền</TableCell>
            <TableCell className='font-semibold'>Trạng thái</TableCell>
            <TableCell className='font-semibold'>Ngày tạo</TableCell>
            <TableCell className='font-semibold text-center'>
              Hành động
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow
              key={transaction.transactionId}
              onMouseEnter={() => setHoveredRow(transaction.transactionId)}
              onMouseLeave={() => setHoveredRow(null)}
              className='hover:bg-gray-50 transition-colors'
            >
              {/* Transaction Code */}
              <TableCell className='font-medium'>
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>
                    {transaction.transactionCode}
                  </span>
                  {transaction.gatewayTransactionCode && (
                    <span className='text-xs text-gray-500'>
                      Gateway: {transaction.gatewayTransactionCode}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Invoice / Room */}
              <TableCell>
                <div className='flex flex-col gap-1'>
                  {transaction.invoice && (
                    <span className='text-sm'>
                      {transaction.invoice.invoiceCode}
                    </span>
                  )}
                  {transaction.room && (
                    <span className='text-xs text-gray-500'>
                      {transaction.room.roomCode} - {transaction.room.roomName}
                    </span>
                  )}
                </div>
              </TableCell>

              {/* Customer */}
              <TableCell>
                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-medium'>
                    {transaction.customer.name}
                  </span>
                  <span className='text-xs text-gray-500'>
                    {formatPhoneNumber(transaction.customer.phone)}
                  </span>
                </div>
              </TableCell>

              {/* Landlord */}
              <TableCell>
                {transaction.landlord ? (
                  <div className='flex flex-col gap-1'>
                    <span className='text-sm font-medium'>
                      {transaction.landlord.name}
                    </span>
                    <span className='text-xs text-gray-500'>
                      {formatPhoneNumber(transaction.landlord.phone)}
                    </span>
                  </div>
                ) : (
                  <span className='text-gray-500'>-</span>
                )}
              </TableCell>

              {/* Payment Type */}
              <TableCell>
                <span className='text-sm'>
                  {getPaymentTypeLabel(transaction.paymentType)}
                </span>
              </TableCell>

              {/* Gateway */}
              <TableCell>
                <span className='text-sm'>
                  {getPaymentGatewayLabel(transaction.paymentGateway)}
                </span>
              </TableCell>

              {/* Amount */}
              <TableCell className='text-right font-medium'>
                {formatVND(transaction.amount)}
              </TableCell>

              {/* Status */}
              <TableCell>
                <span className={getStatusBadgeClass(transaction.status)}>
                  {getPaymentStatusLabel(transaction.status)}
                </span>
              </TableCell>

              {/* Created Date */}
              <TableCell className='text-sm'>
                {formatDateTime(transaction.createdAt)}
              </TableCell>

              {/* Actions */}
              <TableCell className='text-center'>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => onViewDetails(transaction.transactionId)}
                  className='w-full'
                >
                  Chi tiết
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
