import { Metadata } from 'next'
import { TransactionDetailPage } from '@/components/features/transactions'

export const metadata: Metadata = {
  title: 'Chi tiết giao dịch - SmartRent Admin',
  description: 'Xem chi tiết giao dịch thanh toán',
}

export default function Page() {
  return <TransactionDetailPage />
}
