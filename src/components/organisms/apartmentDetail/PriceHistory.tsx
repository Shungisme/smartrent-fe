import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card'
import { Typography } from '@/components/atoms/typography'
import { PriceHistory as PriceHistoryType } from '@/types/apartmentDetail.types'

interface PriceHistoryProps {
  priceHistory: PriceHistoryType[]
}

const PriceHistory: React.FC<PriceHistoryProps> = ({ priceHistory }) => {
  const formatPrice = (price: number, currency: string) => {
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN').format(price) + ' VND'
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    // If already in DD/MM/YYYY format, return as is
    if (dateString.includes('/')) {
      return dateString
    }
    // Otherwise, format from ISO date
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  return (
    <Card className='w-full'>
      <CardHeader className='pb-4'>
        <CardTitle className='text-lg font-semibold'>Lịch sử giá</CardTitle>
      </CardHeader>
      <CardContent>
        <div className='space-y-3.5'>
          {priceHistory.map((entry, index) => (
            <div
              key={index}
              className='flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0'
            >
              <Typography
                variant='small'
                className='text-muted-foreground font-medium'
              >
                {formatDate(entry.date)}
              </Typography>
              <Typography
                variant='small'
                className='font-semibold text-foreground'
              >
                {formatPrice(entry.price, entry.currency)}
              </Typography>
            </div>
          ))}
        </div>

        {priceHistory.length === 0 && (
          <div className='text-center py-6'>
            <Typography variant='small' className='text-muted-foreground'>
              Chưa có lịch sử giá
            </Typography>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PriceHistory
