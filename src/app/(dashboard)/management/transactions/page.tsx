import { Metadata } from 'next'
import { TransactionsPage } from '@/components/features/transactions'

export const metadata: Metadata = {
  title: 'Quản lý giao dịch - Thuê Nhà Trọ Admin',
  description: 'Xem và quản lý tất cả các giao dịch thanh toán',
}

export default function Page() {
  return <TransactionsPage />
}
