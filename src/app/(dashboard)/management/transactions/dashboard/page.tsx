import { Metadata } from 'next'
import { AdminTransactionsDashboardPage } from '@/features/adminTransactions/pages/AdminTransactionsDashboardPage'

export const metadata: Metadata = {
  title: 'Tổng quan giao dịch - SmartRent Admin',
  description:
    'Xem tổng quan về doanh thu, tỷ lệ thành công và xu hướng thanh toán',
}

export default function TransactionsDashboardPage() {
  return <AdminTransactionsDashboardPage />
}
