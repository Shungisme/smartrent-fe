import { Metadata } from 'next'
import { TransactionsDashboardPage } from '@/components/features/transactions'

export const metadata: Metadata = {
  title: 'Tổng quan giao dịch - Thuê Nhà Trọ Admin',
  description:
    'Xem tổng quan về doanh thu, tỷ lệ thành công và xu hướng thanh toán',
}

export default function Page() {
  return <TransactionsDashboardPage />
}
