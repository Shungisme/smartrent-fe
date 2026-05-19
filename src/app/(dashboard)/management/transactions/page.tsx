import { Metadata } from 'next'
import { AdminTransactionsPage } from '@/features/adminTransactions/pages/AdminTransactionsPage'

export const metadata: Metadata = {
  title: 'Quản lý giao dịch - SmartRent Admin',
  description: 'Xem và quản lý tất cả các giao dịch thanh toán',
}

export default function TransactionsPage() {
  return <AdminTransactionsPage />
}
