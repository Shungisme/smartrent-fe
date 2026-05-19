import { Metadata } from 'next'
import { AdminTransactionDetailPage } from '@/features/adminTransactions/pages/AdminTransactionDetailPage'

export const metadata: Metadata = {
  title: 'Chi tiết giao dịch - SmartRent Admin',
  description: 'Xem chi tiết giao dịch thanh toán',
}

export default function TransactionDetailPage() {
  return <AdminTransactionDetailPage />
}
